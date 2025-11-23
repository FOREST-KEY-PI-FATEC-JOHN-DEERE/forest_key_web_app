import { decrypt } from "@/utils/crypto/decrypt";
import { encrypt } from "@/utils/crypto/encrypt";
import { supabase } from "@/utils/supabase/client";

export interface IApplicationUser {
  id_app_user: string;
  application_name: string;
  password: string;
  created_at: string;
  created_by: string | null;
  responsible_user_id?: string | null;
}

const sensitiveFields: (keyof IApplicationUser)[] = ["password"];

function encryptSensitive(payload: Partial<IApplicationUser>) {
  const result: Partial<IApplicationUser> = { ...payload };
  sensitiveFields.forEach((field) => {
    const value = payload[field];
    if (value) {
      result[field] = encrypt(value);
    }
  });
  return result;
}

function decryptSensitive(user: IApplicationUser): IApplicationUser {
  const result: IApplicationUser = { ...user };
  sensitiveFields.forEach((field) => {
    const value = user[field];
    if (value) {
      result[field] = decrypt(value);
    }
  });
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
  const encryptedUser = encryptSensitive(newUser);

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
  const toUpdate: Partial<IApplicationUser> = { ...payload };

  if (payload.password) {
    toUpdate.created_at = new Date().toISOString();
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
  const { error } = await supabase
    .from("Application_User")
    .delete()
    .eq("id_app_user", id);

  if (error) throw new Error(error.message);

  return { success: true };
}
