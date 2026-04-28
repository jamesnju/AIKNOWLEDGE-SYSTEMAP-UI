'use client';

import { AuthProvider } from '../context/AuthContext';
import AdminLayoutWrapper from '../components/admin/AdminLayoutWrapper';
import AdminGuard from '../components/admin/AdminGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      </AdminGuard>
    </AuthProvider>
  );
}