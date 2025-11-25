import { NextResponse } from "next/server";
import {
  deleteAccessGroup,
  updateAccessGroup,
  getAccessGroupById,
} from "@/services/access_group.service";

interface Params {
  params: { id: string };
}

// =========================================
// GET → Buscar grupo por ID (necessário para Tela 2)
// =========================================
export async function GET(req: Request, { params }: Params) {
  try {
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
export async function PATCH(req: Request, { params }: Params) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: "Group name is required" },
        { status: 400 }
      );
    }

    const updated = await updateAccessGroup(params.id, { name: body.name });

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
export async function DELETE(req: Request, { params }: Params) {
  try {
    await deleteAccessGroup(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
