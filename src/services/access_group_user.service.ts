import { supabase } from "@/utils/supabase/client";

export interface GroupMember {
  id_access_group_user: string;
  id_user: string;
  id_access_group: string;
  admin: boolean;
  created_at: string;
}

export async function getMembersByGroup(groupId: string) {
  const { data, error } = await supabase
    .from("Access_Group_User")
    .select(`
      id_access_group_user,
      admin,
      created_at,
      id_user,
      User_Profile:User_Profile!Access_Group_User_id_user_fkey (
        id_user,
        first_name,
        last_name
      )
    `)
    .eq("id_access_group", groupId);

  if (error) throw new Error(error.message);

  return data;
}

export async function addUserToGroup(payload: {
  id_user: string;
  id_access_group: string;
  admin: boolean;
}) {
  const { data, error } = await supabase
    .from("Access_Group_User")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function removeUserFromGroup(id_access_group_user: string) {
  const { error } = await supabase
    .from("Access_Group_User")
    .delete()
    .eq("id_access_group_user", id_access_group_user);

  if (error) throw new Error(error.message);

  return { success: true };
}
