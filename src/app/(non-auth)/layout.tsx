import React from 'react';

import Layout from '@/components/layouts/NonAuthLayout';

export default function NonAuthLayout({
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
