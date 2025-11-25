// src/services/access_group.service.ts
import { supabase } from "@/utils/supabase/client";

export interface AccessGroup {
  id_access_group: string;
  name: string | null;
  created_at: string;
  created_by: string | null;
}

/**
 * Lista todos os grupos de acesso.
 */
export async function getAllAccessGroups(): Promise<AccessGroup[]> {
  const { data, error } = await supabase
    .from("Access_Group")
    .select("id_access_group, name, created_at, created_by")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as AccessGroup[];
}

/**
 * Cria um novo grupo de acesso.
 */
export async function createAccessGroup(payload: { name: string }): Promise<AccessGroup> {
  const { data, error } = await supabase
    .from("Access_Group")
    .insert({
      name: payload.name,
      created_by: null,
    })
    .select("id_access_group, name, created_at, created_by")
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
  payload: { name: string }
): Promise<AccessGroup> {
  const { data, error } = await supabase
    .from("Access_Group")
    .update({ name: payload.name })
    .eq("id_access_group", id)
    .select("id_access_group, name, created_at, created_by")
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
  const { data, error } = await supabase
    .from("Access_Group")
    .select("id_access_group, name, created_at, created_by")
    .eq("id_access_group", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AccessGroup;
}
