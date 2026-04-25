'use client';

import { AuthProvider } from '../context/AuthContext';
import AdminLayoutWrapper from '../components/admin/AdminLayoutWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AuthProvider>
  );
}