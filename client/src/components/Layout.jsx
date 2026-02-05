import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from "react-icons/fi";

export default function Layout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen
      bg-gradient-to-br from-sand-100 via-sand-50 to-white
      dark:from-primary-900 dark:via-primary-800 dark:to-secondary-900
    ">
      <header className="
        bg-white/90 backdrop-blur border-b border-sand-200 shadow-sm sticky top-0 z-10
        dark:bg-primary-900/60 dark:border-primary-700
      ">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 flex items-center justify-between h-20">
          <h1 className="text-2xl font-bold text-primary-600 tracking-tight flex items-center gap-3 dark:text-sand-50">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-white text-base shadow-card dark:bg-primary-700">
              ✔
            </span>
            TaskFlow
          </h1>

          <div className="flex items-center gap-3">
            <button
  onClick={toggleTheme}
  className="
    inline-flex items-center gap-2 px-3 py-2 rounded-lg border
    border-sand-300 bg-white/70 text-secondary-700 hover:bg-sand-100 transition
    dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:hover:bg-primary-800/60
  "
  title="Toggle theme"
  type="button"
>
  {isDark ? (
    <FiSun className="w-[18px] h-[18px] text-accent-400" />
  ) : (
    <FiMoon className="w-[18px] h-[18px] text-primary-600" />
  )}

  <span className="text-sm font-medium hidden sm:inline">
    {isDark ? "Light" : "Dark"}
  </span>
</button>

            <span className="text-base text-secondary-600 hidden sm:inline dark:text-secondary-200">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="
                text-sm md:text-base font-medium text-primary-600 hover:text-primary-700 px-4 py-2 rounded-lg hover:bg-sand-100 transition
                dark:text-sand-50 dark:hover:bg-primary-800/60
              "
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-10 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
}
