import { createClient } from "@/utils/supabase/server";

export interface GroupMember {
  id_access_group_user: string;
  id_user: string;
  id_access_group: string;
  admin: boolean;
  created_at: string;
}

export async function getMembersByGroup(groupId: string) {
  const supabase = await createClient();
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
  created_by?: string | null;
}) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Server missing Supabase keys: set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const toInsert: any = {
    id_user: payload.id_user,
    id_access_group: payload.id_access_group,
    admin: payload.admin,
  };

  if (typeof payload.created_by !== 'undefined') toInsert.created_by = payload.created_by;

  const supabase = await createClient();

  // Validate that id_user exists in User_Profile to avoid FK error
  const { data: userExists } = await supabase
    .from('User_Profile')
    .select('id_user')
    .eq('id_user', payload.id_user)
    .limit(1)
    .maybeSingle();

  if (!userExists) {
    // If profile is missing, create a minimal stub profile to satisfy FK
    console.warn(`User profile for ${payload.id_user} missing, creating stub profile.`);
    const { data: insertProfile, error: insertErr } = await supabase
      .from('User_Profile')
      .insert({ id_user: payload.id_user, first_name: null, last_name: null });

    if (insertErr) {
      console.error('Failed to create stub User_Profile for', payload.id_user, insertErr);
      throw new Error(`User with id ${payload.id_user} not found and stub creation failed`);
    }
  }

  // If created_by is provided, validate it exists as well
  if (typeof payload.created_by !== 'undefined' && payload.created_by) {
    const { data: creatorExists } = await supabase
      .from('User_Profile')
      .select('id_user')
      .eq('id_user', payload.created_by)
      .limit(1)
      .maybeSingle();

    if (!creatorExists) {
      // Create stub creator profile if it doesn't exist
      console.warn(`Creator profile for ${payload.created_by} missing, creating stub profile.`);
      const { data: cInsert, error: cErr } = await supabase
        .from('User_Profile')
        .insert({ id_user: payload.created_by, first_name: null, last_name: null });

      if (cErr) {
        console.error('Failed to create stub creator User_Profile for', payload.created_by, cErr);
        throw new Error(`Creator with id ${payload.created_by} not found and stub creation failed`);
      }
    }
  }
  const { data, error } = await supabase
    .from("Access_Group_User")
    .insert(toInsert)
    .select()
    .single();

  if (error) {
    console.error("Supabase insert Access_Group_User error:", error, "payload:", toInsert);
    throw new Error(error.message || String(error));
  }

  return data;
}

export async function removeUserFromGroup(id_access_group_user: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("Access_Group_User")
    .delete()
    .eq("id_access_group_user", id_access_group_user);

  if (error) throw new Error(error.message);

  return { success: true };
}
