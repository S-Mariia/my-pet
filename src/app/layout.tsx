'use client';

import React from 'react';
import StoreProvider from '@/redux/StoreProvider';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';
import { Noto_Sans } from 'next/font/google';
import Loader from "@/components/common/Loader/Loader";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const notoSans = Noto_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-[100dvh] ${notoSans.className}`}>
        <StoreProvider>
          <AuthProvider>
            <ToastContainer/>
            <Loader/>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>

  );
}
