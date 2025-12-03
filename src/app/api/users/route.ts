// Lista usuários reais do sistema (User_Profile)

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();

    // Buscar usuários da tabela de perfil
    const { data: profiles, error } = await supabase
        .from("User_Profile")
        .select("id_user, first_name, last_name")
        .order("first_name", { ascending: true });

    if (error) {
        // Erro ao consultar o banco
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }

        // Only attempt to fetch auth emails if we have the service role key available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
            const authList: any = await supabase.auth.admin.listUsers();

            // authList may contain { data: { users: [...] } } or { data, error }
            let authUsers: any[] = [];
            if (authList?.data && Array.isArray(authList.data.users)) {
                authUsers = authList.data.users;
            } else if (authList?.data && Array.isArray(authList.data)) {
                authUsers = authList.data;
            } else if (Array.isArray(authList)) {
                authUsers = authList;
            }

            const emailMap = new Map<string, string>();
            authUsers.forEach((u: any) => {
                if (u?.id && u?.email) emailMap.set(u.id, u.email as string);
            });

            const merged = (profiles || []).map((p: any) => ({
                id_user: p.id_user,
                first_name: p.first_name,
                last_name: p.last_name,
                email: emailMap.get(p.id_user) || null,
            }));

            return NextResponse.json({ success: true, data: merged }, { status: 200 });
        } catch (e: any) {
            // If admin listUsers fails unexpectedly, fallback to returning profiles without email
            return NextResponse.json({ success: true, data: profiles }, { status: 200 });
        }
    }

    // If no service key, just return profiles (no email)
    return NextResponse.json({ success: true, data: profiles }, { status: 200 });
}
