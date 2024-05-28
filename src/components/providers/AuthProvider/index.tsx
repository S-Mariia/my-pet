'use client';

import React, { ReactNode, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/utils/firebase';
import {useAppDispatch} from '@/redux/hooks';
import { setUser } from '@/redux/slices/userAuth/userAuthSlice';
import {setLoading} from "@/redux/slices/loading/loadingSlice";
import {setTheme} from "@/redux/slices/Theme/themeSlice";
import {useRouter} from "next/navigation";

type AuthProviderProps = {
  children: ReactNode
};
function AuthProvider({ children }:AuthProviderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();


  useEffect(() => {
    const initialTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (initialTheme) {
      dispatch(setTheme(initialTheme));
      dispatch(setLoading(false))
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem('user', 'true')
        const {
          displayName, email, phoneNumber, photoURL, uid, emailVerified,
        } = currentUser;
        dispatch(setUser({
          displayName, email, phoneNumber, photoURL, uid, emailVerified,
        }));
      } else {
        router.push('/sign-in');
        dispatch(setUser(null));
      }
    });
    dispatch(setLoading(false))
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <main className="h-full">
      {children}
    </main>
  );
}
export default AuthProvider;
