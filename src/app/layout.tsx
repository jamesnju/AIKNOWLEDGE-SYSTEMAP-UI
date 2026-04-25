'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if the current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // Don't show header and footer on admin routes
  const showHeaderFooter = !isAdminRoute;

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {showHeaderFooter && <Header />}
          <main className={showHeaderFooter ? "min-h-screen" : ""}>
            {children}
          </main>
          {showHeaderFooter && <Footer />}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import Header from './components/common/Header';
// import Footer from './components/common/Footer';
// import { Toaster } from 'react-hot-toast';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'AgriPoa - Empowering African Farmers',
//   description: 'Access expert agricultural knowledge, farming techniques, and pest management solutions',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Header />
//         <main className="min-h-screen">{children}</main>
//         <Footer />
//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }