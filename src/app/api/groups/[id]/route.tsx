import { NextResponse } from "next/server";
import {
  deleteAccessGroup,
  updateAccessGroup,
  getAccessGroupById,
} from "@/services/access_group.service";

// =========================================
// GET → Buscar grupo por ID (necessário para Tela 2)
// =========================================
export async function GET(req: Request, context: any) {
  try {
    const { params } = await context;
    const group = await getAccessGroupById(params.id);

    if (!group) {
      return NextResponse.json(
        { success: false, error: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: group });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

// =========================================
// PATCH → Atualizar nome do grupo
// =========================================
export async function PATCH(req: Request, context: any) {
  try {
    const { params } = await context;
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Group name is required" },
        { status: 400 }
      );
    }

    const updated = await updateAccessGroup(params.id, {
      name: body.name,
      description: typeof body.description !== 'undefined' ? body.description : undefined,
      created_by: typeof body.created_by !== 'undefined' ? body.created_by : undefined,
      owner: typeof body.owner !== 'undefined' ? body.owner : undefined,
      backup: typeof body.backup !== 'undefined' ? body.backup : undefined,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

// =========================================
// DELETE → Excluir grupo
// =========================================
export async function DELETE(req: Request, context: any) {
  try {
    const { params } = await context;
    await deleteAccessGroup(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
