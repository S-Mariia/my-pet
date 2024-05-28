import React from 'react';
import Layout from '@/components/layouts/AuthLayout';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <Layout>
      {children}
    </Layout>

  );
}
