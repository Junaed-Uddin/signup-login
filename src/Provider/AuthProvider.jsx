import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // google sign in
  const googleSignIn = provider =>{
    return signInWithPopup(auth, provider);
  }
  // github sign in
  const githubSignIn = provider =>{
    return signInWithPopup(auth, provider);
  }

  // registration users
  const registrationUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // update Profile
  const updateProfileData = (updateData) => {
    setLoading(true);
    return updateProfile(auth.currentUser, updateData);
  };

  // verification mail
  const verificationByEmail = () => {
    setLoading(true);
    return sendEmailVerification(auth.currentUser);
  };

  // login
  const SignInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Password reset
  const passwordResetEmail = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  // sign out
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // get currently user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("current user", currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    googleSignIn,
    githubSignIn,
    registrationUser,
    SignInUser,
    updateProfileData,
    verificationByEmail,
    passwordResetEmail,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
