import { supabase } from "@/utils/supabase/client";

export interface IProfile {
  first_name: string;
  last_name: string;
}

export async function updateProfile(
  id: string,
  payload: { firstName: string; lastName: string }
) {
  console.log("Updating user id:", id);
  console.log("Payload:", payload);

  const { data, error } = await supabase
    .from("User") // check table name
    .update({
      first_name: payload.firstName,
      last_name: payload.lastName,
    })
    .eq("id_user", id)
    .select(); // do NOT use .single() until you confirm data exists

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No user found to update");

  console.log("Updated data:", data);

  return data[0];
}
