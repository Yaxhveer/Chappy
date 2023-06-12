import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { generateAvatar } from "../../utils/generateAvatar";

export default function Profile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [loading, setLoading] = useState(false);

  const { currUser, updateUserProfile, setError, deleteCurrUser } = useAuth();

  const fetchData = async () => {
    const res = generateAvatar();
    setSelectedAvatar(null);
    setAvatars(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedAvatar === undefined) {
      return setError("Please select an avatar");
    }

    try {
      setError("");
      setLoading(true);
      const user = currUser;
      const profile = {
        displayName: username,
        photoURL: avatars[selectedAvatar],
      };
      await updateUserProfile(user, profile);
      navigate("/");
    } catch (e) {
      setError("Failed to update profile");
    }

    setLoading(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try{
      setError('');
      setLoading(true);
      const user = currUser;
      await deleteCurrUser(user);
      // navigate('/login');
    } catch {
      setError('Failed to Delete Account');
    }
    setLoading(false);
  }

  return (
    <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-4 text-3xl text-center tracking-tight font-light dark:text-white">
            Profile
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div className="rounded-md shadow-sm -space-y-px flex justify-center ">

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="appearance-none rounded-none relative block max-w-xl px-3 py-2 placeholder-zinc-500 rounded-t-md bg-zinc-200 border border-zinc-400 text-zinc-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter a Display Name"
              defaultValue={currUser.displayName}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <button
                  type="button"
                  className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={fetchData}
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            </button>

          </div>
          <div className="flex flex-wrap gap-4 ss:gap-8 -m-1 md:-m-2 justify-center">
            {avatars?.map((avatar, index) => (
              <div key={index} className="flex flex-wrap justify-center">
                <div className="p-1 md:p-2">
                  <img
                    alt="gallery"
                    className={
                      index === selectedAvatar
                        ? "border-4 border-blue-700 dark:border-blue-700 block object-cover object-center w-12 h-12 ss:w-24 ss:h-24 rounded-full"
                        : "cursor-pointer hover:border-4 hover:border-blue-700 block object-cover object-center w-12 h-12 ss:w-24 ss:h-24 rounded-full"
                    }
                    src={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-x-8 xs:gap-x-16 ss:gap-x-32">
            <button
              type="submit"
              disabled={loading}
              className="xs:max-w-sm ss:max-w-lg sm:max-w-xl items-center py-2 px-4 border border-transparent text-xs md:text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Update Profile
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="max-w-sm ss:max-w-lg sm:max-w-xl items-center py-2 px-4 border border-transparent text-xs md:text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
