"use client";
import { useState } from "react";

export default function historyPage() {
  const [autoUpdate, setAutoUpdate] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Barra lateral (ESSA PARTE SUBSTITUIR PELO COMPONENTE QUANDO SUBIR) */}
      <aside className="w-20 bg-gray-200 flex flex-col items-center py-4">
        <div className="w-10 h-10 rounded-full bg-gray-600 mb-6"></div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white text-lg font-semibold"></div>
          <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white text-lg font-semibold"></div>
          <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white text-lg font-semibold"></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col px-8 py-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <button className="text-2xl font-semibold">{`←`}</button>
          <h1 className="text-2xl font-semibold">ID DA APLICAÇÃO</h1>
        </div>

        <div className="flex flex-1 gap-8">
          {/* Coluna principal */}
          <div className="flex-1 flex flex-col">
            {/* Nome da Aplicação */}
            <div className="bg-gray-200 rounded-md p-4 mb-6">
              <div className="bg-gray-400 text-white text-lg font-medium rounded-md px-4 py-3 w-1/2">
                APLICAÇÃO GENÉRICA
              </div>
            </div>

            {/* Campos */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Campo 1 - Nome de Usuário */}
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <label className="block text-sm text-gray-700 mb-1">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  placeholder="ex: joaosilva"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Campo 2 - Email */}
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="ex: mail@empresa.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Campo 3 - Senha de Acesso  */}
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-gray-700">
                    Senha de Acesso
                  </label>

                  {/* true/false */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Atualização automática</span>
                    <button
                      onClick={() => setAutoUpdate(!autoUpdate)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        autoUpdate ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          autoUpdate ? "translate-x-5" : ""
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>

                {/* campo da senha*/}
                {autoUpdate ? (
                  <div className="w-full border border-dashed border-gray-400 rounded-md px-3 py-2 text-sm text-gray-500 bg-gray-100">
                    Atualização automática
                  </div>
                ) : (
                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                )}
              </div>
            </div>

            {/* Botões delerte e edit */}
            <div className="flex gap-4">
              <button className="px-8 py-2 bg-red-100 border border-red-500 text-red-700 font-semibold rounded-md hover:bg-red-200 transition">
                DELETAR
              </button>
              <button className="px-8 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
                EDITAR
              </button>
            </div>
          </div>

          {/* Histórico */}
          <div className="w-1/3 border-l border-gray-300 pl-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">HISTÓRICO</h2>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center"></div>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center"></div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {/* msg 1 */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mt-1"></div>
                  <div className="w-px flex-1 bg-gray-400"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold">05/03/2025 08:30:00</p>
                  <p className="text-sm text-gray-700">
                    Senha alterada por - SISTEMA - <br />
                    MOTIVO: Atualização automática
                  </p>
                </div>
              </div>

              {/* msg 2 */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mt-1"></div>
                  <div className="w-px flex-1 bg-gray-400"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold">18/08/2025 09:45:12</p>
                  <p className="text-sm text-gray-700">
                    Senha alterada por - NOME RESPONSÁVEL - <br />
                    MOTIVO: Prazo expirado
                  </p>
                </div>
              </div>

              {/* msg 3 */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500 mt-1"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold">26/10/2025 10:10:45</p>
                  <p className="text-sm text-gray-700">
                    Senha alterada por - SISTEMA - <br />
                    MOTIVO: Atualização automática
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
