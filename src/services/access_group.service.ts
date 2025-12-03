// src/services/access_group.service.ts
import { createClient } from "@/utils/supabase/server";

export interface AccessGroup {
  id_access_group: string;
  name: string | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
  owner?: string | null;
  backup?: string | null;
}

/**
 * Lista todos os grupos de acesso.
 */
export async function getAllAccessGroups(): Promise<AccessGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Access_Group")
    .select("id_access_group, name, description, created_at, created_by, owner, backup")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AccessGroup[];
}

/**
 * Cria um novo grupo de acesso.
 */
export async function createAccessGroup(payload: { name: string; description?: string | null; created_by?: string | null; owner?: string | null; backup?: string | null; }): Promise<AccessGroup> {
  // Ensure server has service role key for safe server-side writes when needed
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Server missing Supabase keys: set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const toInsert: any = {
    name: payload.name,
    description: payload.description ?? null,
    created_by: payload.created_by ?? null,
  };

  if (typeof (payload as any).owner !== 'undefined') toInsert.owner = (payload as any).owner;
  if (typeof (payload as any).backup !== 'undefined') toInsert.backup = (payload as any).backup;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Access_Group")
    .insert(toInsert)
    .select("id_access_group, name, description, created_at, created_by, owner, backup")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AccessGroup;
}

/**
 * Atualiza um grupo existente.
 */
export async function updateAccessGroup(
  id: string,
  payload: { name?: string; description?: string | null; created_by?: string | null; owner?: string | null; backup?: string | null }
): Promise<AccessGroup> {
  const toUpdate: any = {};
  if (typeof payload.name !== "undefined") toUpdate.name = payload.name;
  if (typeof payload.description !== "undefined") toUpdate.description = payload.description;
  if (typeof payload.created_by !== "undefined") toUpdate.created_by = payload.created_by;
  if (typeof (payload as any).owner !== 'undefined') toUpdate.owner = (payload as any).owner;
  if (typeof (payload as any).backup !== 'undefined') toUpdate.backup = (payload as any).backup;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Access_Group")
    .update(toUpdate)
    .eq("id_access_group", id)
    .select("id_access_group, name, description, created_at, created_by, owner, backup")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AccessGroup;
}

/**
 * Exclui um grupo e remove seus vínculos com usuários.
 */
export async function deleteAccessGroup(id: string) {
  // Remove membros vinculados
  const supabase = await createClient();
  const { error: membersError } = await supabase
    .from("Access_Group_User")
    .delete()
    .eq("id_access_group", id);

  if (membersError) {
    throw new Error(`Falha ao remover membros do grupo: ${membersError.message}`);
  }

  // Remove o grupo
  const { error: groupError } = await supabase
    .from("Access_Group")
    .delete()
    .eq("id_access_group", id);

  if (groupError) {
    throw new Error(`Falha ao excluir grupo principal: ${groupError.message}`);
  }

  return { success: true };
}


export async function getAccessGroupById(id: string): Promise<AccessGroup | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Access_Group")
    .select("id_access_group, name, description, created_at, created_by, owner, backup")
    .eq("id_access_group", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AccessGroup;
}
