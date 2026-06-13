'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './context/AuthContext';
import GuidedTour from './components/common/GuidedTour';
import { guidedTourSteps } from './components/common/GuidedTourConfig';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if the current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  const isHelpPage = pathname === '/help';
  // Don't show header and footer on admin routes
  const showHeaderFooter = !isAdminRoute && !isHelpPage;

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {showHeaderFooter && <Header />}
          <main className={showHeaderFooter ? "min-h-screen" : ""}>
            {children}
          <GuidedTour 
          steps={guidedTourSteps}
          storageKey="agripoa-nav-tour-v1"
          autoStart={true}
          onComplete={() => console.log('Tour completed!')}
          onSkip={() => console.log('Tour skipped')}
        />
          </main>
          {showHeaderFooter && <Footer />}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
