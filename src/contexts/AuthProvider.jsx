import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, signOut, onAuthStateChanged, GithubAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';
import { AuthContext } from './AuthContext';

function normalizeUser(user) {
  if (!user) return null;
  const providerData = user.providerData && user.providerData[0] ? user.providerData[0] : {};
  user.email = user.email || providerData.email || null;
  user.displayName = user.displayName || providerData.displayName || 'Unknown';
  user.photoURL = user.photoURL || providerData.photoURL || null;
  return user;
}

const AuthProvider = ({ children }) => {

    const googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('email');
    const githubProvider = new GithubAuthProvider();


    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider);
    }

    const updateUserProfile = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData)
    }

    const logOut = () => {
        return signOut(auth)
    };

    const githubSignIn = () => {
        return signInWithPopup(auth, githubProvider);
    }





    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(normalizeUser(currentUser));
            setLoading(false)
        })
        return () => {
            unsubscribe();
        }
    }, [])

    useEffect(() => {
    //   console.log('AuthProvider user:', user);
      if (user) {
        // console.log('AuthProvider user.email:', user.email);
        if (user.providerData && user.providerData[0]) {
        //   console.log('AuthProvider providerData[0].email:', user.providerData[0].email);
        }
      }
    }, [user]);

    const authData = {
        user,
        setUser,
        createUser,
        loginUser,
        googleSignIn,
        logOut,
        loading,
        setLoading,
        updateUserProfile,
        githubSignIn,
    }

    return <AuthContext.Provider value={authData}>
        {children}
    </AuthContext.Provider>
};

export default AuthProvider;