export interface AccessGroup {
  id_access_group: string;
  name: string;
  created_at: string;
  created_by: string | null;
}

export interface AccessGroupUser {
  id_access_group_user: string;
  id_user: string;
  admin: boolean;
  created_at: string;
  created_by: string | null;

  first_name: string | null;
  last_name: string | null;
}
