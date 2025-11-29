// supabase/functions/rotate-application-passwords/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import crypto from "node:crypto";

/* ============================================================
   1. Variáveis de ambiente
   ============================================================ */
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ENCRYPTION_KEY_HEX = Deno.env.get("ENCRYPTION_KEY");

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ENCRYPTION_KEY_HEX) {
  throw new Error(
    "SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ou ENCRYPTION_KEY não definidos."
  );
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/* ============================================================
   2. Criptografia AES-256-ECB (MESMA DA APLICAÇÃO)
   ============================================================ */

const key = Buffer.from(ENCRYPTION_KEY_HEX, "hex"); // 32 bytes

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv("aes-256-ecb", key, null);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return encrypted.toString("base64");
}

/* ============================================================
   3. Gerador de senha forte (equivalente ao front)
   ============================================================ */

function generateStrongSecret(length = 16): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}<>?";
  const allChars = upper + lower + numbers + symbols;

  const bytes = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    result += allChars[bytes[i] % allChars.length];
  }

  return result;
}

/* ============================================================
   4. Edge Function principal
   ============================================================ */

Deno.serve(async () => {
  const nowIso = new Date().toISOString();

  // Busca APENAS usuários de aplicação:
  //  - ativos (status = true)
  //  - com senha expirada (expire_at <= agora)
  const { data: expired, error } = await supabase
    .from("Application_User")
    .select("id_app_user")
    .eq("status", true)
    .lte("expire_at", nowIso);

  if (error) {
    console.error("Erro ao buscar Application_User expirados:", error);
    return new Response("Erro ao buscar", { status: 500 });
  }

  if (!expired || expired.length === 0) {
    return new Response("Nenhuma senha expirada para rotacionar", {
      status: 200,
    });
  }

  let rotated = 0;

  for (const row of expired) {
    const newPlainPassword = generateStrongSecret(16);
    const encryptedPassword = encrypt(newPlainPassword);

    const { error: updError } = await supabase
      .from("Application_User")
      .update({
        password: encryptedPassword,
        last_update: new Date().toISOString(),
        changed_by: "atualizada por sistema", // <<< automático
      })
      .eq("id_app_user", row.id_app_user);

    if (!updError) {
      rotated++;
    } else {
      console.error("Erro ao atualizar senha:", row.id_app_user, updError);
    }
  }

  return new Response(`Senhas rotacionadas: ${rotated}`, { status: 200 });
});
