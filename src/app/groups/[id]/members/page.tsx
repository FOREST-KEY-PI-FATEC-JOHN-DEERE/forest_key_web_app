"use client";

import MainLayout from "@/components/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import GroupMembersManager from "@/components/groups/GroupMembersManager";

export default function GroupMembersPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  const groupId = params.id;

  return (
    <MainLayout pageTitle="Membros do Grupo">
      <div className="space-y-6">

        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/groups")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[var(--color-foreground)]" />
          </button>

          <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
            Gerenciar Membros do Grupo
          </h1>
        </div>

        {/* Gerenciador de membros */}
        <GroupMembersManager groupId={groupId} />
      </div>
    </MainLayout>
  );
}
