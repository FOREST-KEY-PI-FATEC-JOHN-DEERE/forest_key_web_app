import { decrypt } from "@/utils/crypto/decrypt";
import { encrypt } from "@/utils/crypto/encrypt";
import { supabase } from "@/utils/supabase/client";

export interface IApplicationUser {
  id_app_user: string;
  application_name: string;
  password: string;
  created_at: string;
  created_by: string | null;

  expire_at?: string | null;
  last_update?: string | null;
  changed_by?: string | null;
  status?: boolean | null;
}

const sensitiveFields: Array<keyof Pick<IApplicationUser, "password">> = [
  "password",
];

function encryptSensitive(payload: Partial<IApplicationUser>) {
  const result: Partial<IApplicationUser> = { ...payload };

  for (const field of sensitiveFields) {
    const value = payload[field];
    if (typeof value === "string" && value) {
      (result as any)[field] = encrypt(value);
    }
  }

  return result;
}

function decryptSensitive(user: IApplicationUser): IApplicationUser {
  const result: IApplicationUser = { ...user };

  for (const field of sensitiveFields) {
    const value = user[field];
    if (typeof value === "string" && value) {
      (result as any)[field] = decrypt(value);
    }
  }

  return result;
}

export async function getAllAppUsers(): Promise<IApplicationUser[]> {
  const { data, error } = await supabase
    .from("Application_User")
    .select("*")
    .order("application_name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => decryptSensitive(row as IApplicationUser));
}

export async function getAppUserByID(
  id: string
): Promise<IApplicationUser | null> {
  const { data, error } = await supabase
    .from("Application_User")
    .select("*")
    .eq("id_app_user", id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return decryptSensitive(data as IApplicationUser);
}

export async function createAppUser(newUser: Partial<IApplicationUser>) {
  const now = new Date();
  const expire = new Date(now);
  expire.setDate(expire.getDate() + 45);

  const baseUser: Partial<IApplicationUser> = {
    ...newUser,
    created_at: now.toISOString(),
    expire_at: expire.toISOString(),
    status: newUser.status ?? true, 
  };

  const encryptedUser = encryptSensitive(baseUser);

  const { data, error } = await supabase
    .from("Application_User")
    .insert(encryptedUser)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return decryptSensitive(data as IApplicationUser);
}

export async function updateAppUser(
  id: string,
  payload: Partial<IApplicationUser>
) {
  const now = new Date();
  const toUpdate: Partial<IApplicationUser> = { ...payload };

  if (payload.password) {
    toUpdate.last_update = now.toISOString();

    const expire = new Date(now);
    expire.setDate(expire.getDate() + 45);
    toUpdate.expire_at = expire.toISOString();

    if (!payload.changed_by) {
      toUpdate.changed_by = "Sistema";
    }
  }

  const encryptedPayload = encryptSensitive(toUpdate);

  const { data, error } = await supabase
    .from("Application_User")
    .update(encryptedPayload)
    .eq("id_app_user", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return decryptSensitive(data as IApplicationUser);
}

export async function deleteAppUser(id: string) {
  const now = new Date();

  const softDeletePayload: Partial<IApplicationUser> = {
    status: false,
    last_update: now.toISOString(),
    changed_by: "Sistema",
  };

  const { data, error } = await supabase
    .from("Application_User")
    .update(softDeletePayload)
    .eq("id_app_user", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return decryptSensitive(data as IApplicationUser);
}
