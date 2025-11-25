// Lista usuários reais do sistema (User_Profile)

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient();

    // Buscar usuários da tabela de perfil
    const { data, error } = await supabase
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

    // Retorno bem-sucedido
    return NextResponse.json(
        { success: true, data },
        { status: 200 }
    );
}
