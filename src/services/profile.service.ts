import { supabase } from "@/utils/supabase/client";

export interface IProfile {
  first_name: string;
  last_name: string;
}

export async function updateProfile(
  id: string,
  payload: { firstName: string; lastName: string }
) {

  const { data, error } = await supabase
    .from('User_Profile')
    .update({
      first_name: payload.firstName,
      last_name: payload.lastName,
    })
    .eq("id_user", id)
    .select("*");

  console.log("UPDATE RESULT:", { data, error });

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No user found to update");

  return data[0];
}
