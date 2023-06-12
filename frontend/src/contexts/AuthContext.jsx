import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../config/firebase"
import { createContext, useContext } from "react";
import { useState, useEffect } from "react";
import { updateProfile, signOut, deleteUser } from "firebase/auth";

// gives auth instance
const auth = getAuth(app);

const AuthContext = createContext();

// creating hook for auth
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currUser, setCurrUser] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")

  const value = { currUser, login, register, error, setError, updateUserProfile, logout, deleteCurrUser};

  function register(email, password){
    return createUserWithEmailAndPassword(auth, email, password);
  };

  function login(email, password){
    return signInWithEmailAndPassword(auth, email, password);
  };

  function updateUserProfile(user, profile){
    return updateProfile(user, profile)
  };

  function logout() {
    return signOut(auth);
  }

  function deleteCurrUser(user){
    return deleteUser(user);
  }

  onAuthStateChanged(auth, (user) => {
    setCurrUser(user);
    setLoading(false);
  })
  
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  );
}