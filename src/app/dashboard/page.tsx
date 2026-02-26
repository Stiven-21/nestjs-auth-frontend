"use client";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { clearAllCookies } from "@/action/cookie";
import { me, Oauth, UserMe } from "@/services/user/user-get.service";
import { ApiError } from "@/interfaces/api.interface";
import { API_URL } from "@/common/constants/api.constant";
import { logout, unLinkProvider } from "@/services/auth/auth-post.service";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setError(null);
      try {
        const data = await me(session?.accessToken as string);
        setUserData(data.data);
        setLoading(false);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        }
      }
    };

    if (!session?.accessToken) return;
    fetchUserData();
  }, [session?.accessToken]);

  const handleLink = async (provider: string) => {
    if (!session?.accessToken) return;
    // Redirección directa al endpoint de vinculación del backend
    // Se suele enviar el token de sesión actual en la URL o header para saber a qué usuario vincular
    window.location.href = `${API_URL}/auth/link/${provider}?token=${session.accessToken}`;
    // window.location.href = `${API_URL}/auth/link/${provider}`;
  };

  const handleLogout = async () => {
    await logout(session?.accessToken as string);
    clearAllCookies();
    signOut({ callbackUrl: "/" });
  };

  const handleUnlink = async (provider: string) => {
    if (!session?.accessToken) return;
    try {
      await unLinkProvider(provider, session.accessToken);
      const data = await me(session.accessToken);
      setUserData(data.data);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="animate-pulse text-xl font-medium text-gray-600 dark:text-zinc-400">
          Cargando dashboard...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Panel de Control
            </h1>
            <p className="mt-2 text-gray-500 dark:text-zinc-400">
              Gestiona tu perfil y cuentas vinculadas
            </p>
          </div>
          <button
            onClick={() => handleLogout()}
            className="bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <section className="bg-white dark:bg-zinc-900 p-8 shadow-xl rounded-2xl border border-gray-200 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                Perfil
              </h2>

              {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase font-bold text-gray-400 dark:text-zinc-500">
                      Nombre
                    </label>
                    <p className="text-lg font-medium dark:text-white">
                      {userData?.name + " " + userData?.lastname}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-gray-400 dark:text-zinc-500">
                      Email
                    </label>
                    <p className="text-lg font-medium dark:text-white">
                      {userData?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-gray-400 dark:text-zinc-500">
                      Rol
                    </label>
                    <p className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                      {userData?.role.name || "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Social Accounts Card */}
          <div className="lg:col-span-2">
            <section className="bg-white dark:bg-zinc-900 p-8 shadow-xl rounded-2xl border border-gray-200 dark:border-zinc-800 h-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
                Cuentas Vinculadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["google", "github", "facebook"].map((provider) => {
                  const identity = userData?.oauth?.find(
                    (p: Oauth) => p.provider === provider,
                  );
                  const isLinked = !!identity;
                  return (
                    <div
                      key={provider}
                      className={`p-5 border rounded-2xl transition-all ${isLinked ? "border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-950/20" : "border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30"}`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-bold text-lg dark:text-white">
                            {provider}
                          </span>
                          {isLinked && (
                            <span className="flex h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-100 dark:ring-green-900/30"></span>
                          )}
                        </div>
                        {isLinked ? (
                          <div className="space-y-3">
                            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                              ID: {identity.providerId}
                            </p>
                            <button
                              onClick={() => handleUnlink(provider)}
                              className="w-full text-sm font-bold text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
                            >
                              Desvincular
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleLink(provider)}
                            className="w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-white font-bold py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all text-sm"
                          >
                            Vincular Cuenta
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
