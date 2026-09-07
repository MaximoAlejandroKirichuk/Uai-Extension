import { Pressable } from "../components/Pressable";
import { useAuth } from "../../hooks/useAuth";

export const Login = () => {

  const {
    formData,
    loading,
    error,
    guestLoading,
    guestError,
    onSubmit,
    onGuestSignIn,
    onInputChange,
  } = useAuth();
  const authPending = loading || guestLoading;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">extensión</h2>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <Pressable
            type="submit"
            disabled={authPending}
            label={loading ? "Ingresando..." : "Login"}
          />
        </form>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={onGuestSignIn}
            disabled={authPending}
            className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guestLoading ? "Ingresando como invitado..." : "Continuar como invitado"}
          </button>
          
          {guestError && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {guestError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
