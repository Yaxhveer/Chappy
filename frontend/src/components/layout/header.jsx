import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggler from "./themeToggler";
import { app } from "../../config/firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

export default function Header() {
  
  const { logout, setError, currUser } = useAuth();
  const navigate = useNavigate();
  async function handleLogout(){
    try{
      setError('');
      await logout();
      navigate('/login');
    }
    catch{
      setError("Failed to Logout");
    }
  }

  return (
    <>
      <nav className="px-2 sm:px-4 py-2.5 bg-zinc-300 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 text-sm rounded border dark:text-white">
        <div className="flex flex-wrap items-center justify-between">
          <Link to="/" className="flex">
            <div className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none rounded-lg text-sm p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
          </Link>
          <div className="flex md:order-2">
            <ThemeToggler />

            {currUser && (
              <>
                <button
                  type="button"
                  className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none rounded-lg text-sm p-2.5"
                   onClick={handleLogout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8" viewBox="0 0 20 20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                </button>
                <Link
                  to="/profile"
                  className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currUser.photoURL}
                    alt=""
                  />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}