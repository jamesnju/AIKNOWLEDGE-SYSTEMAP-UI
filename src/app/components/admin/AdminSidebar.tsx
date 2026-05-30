'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiFileText, FiPlus, FiList, FiLogOut, FiX, FiChevronLeft, FiStar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/admin/content/list', icon: FiList, label: 'All Content' },
    { href: '/admin/content/create', icon: FiPlus, label: 'Create Content' },
    { href: '/admin/features', icon: FiStar, label: 'Features' },

  ];

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('admin');
      logout();
      toast.success('Logged out successfully!', {
        duration: 2000,
        position: 'top-right',
      });
      router.push('/');
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Always visible on large screens */}
      <aside className={`
        hidden lg:flex lg:flex-col bg-gray-900 text-white transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'}
      `}>
        <div className="p-6 flex items-center justify-between">
          {isOpen ? (
            <>
              <Link href="/" className="block flex-1">
                <h1 className="text-2xl font-bold text-primary hover:text-primary-light transition-colors">
                  AgriPoa
                </h1>
                <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <FiChevronLeft size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="w-full flex justify-center p-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiChevronLeft size={20} className="rotate-180" />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } ${!isOpen && 'justify-center'}`}
                title={!isOpen ? item.label : ''}
              >
                <Icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full group ${
              !isOpen && 'justify-center'
            }`}
            title={!isOpen ? 'Logout' : ''}
          >
            <FiLogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar - Overlay (closed by default) */}
      <div className={`
        fixed inset-0 z-50 lg:hidden transition-all duration-300
        ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
      `}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`
          absolute left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-xl
          transition-transform duration-300 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 flex items-center justify-between border-b border-gray-800">
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold text-primary">AgriPoa</h1>
              <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { FiHome, FiFileText, FiPlus, FiList, FiLogOut } from 'react-icons/fi';
// import { useAuth } from '../../context/AuthContext';
// import toast from 'react-hot-toast';

// export default function AdminSidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { logout } = useAuth();

//   const menuItems = [
//     { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
//     { href: '/admin/content/list', icon: FiList, label: 'All Content' },
//     { href: '/admin/content/create', icon: FiPlus, label: 'Create Content' },
//   ];

//   const handleLogout = async () => {
//     // Show confirmation dialog
//     const confirmLogout = window.confirm('Are you sure you want to logout?');
    
//     if (confirmLogout) {
//       // Clear localStorage
//       localStorage.removeItem('token');
//       localStorage.removeItem('admin');
      
//       // Clear sessionStorage if used
//       sessionStorage.removeItem('token');
//       sessionStorage.removeItem('admin');
      
//       // Call the logout function from auth context
//       logout();
      
//       // Show success message
//       toast.success('Logged out successfully!', {
//         duration: 2000,
//         position: 'top-right',
//       });
      
//       // Redirect to home page
//       router.push('/');
      
//       // Optional: Force a hard refresh to clear any cached state
//       // setTimeout(() => {
//       //   window.location.href = '/';
//       // }, 100);
//     }
//   };

//   return (
//     <aside className="w-64 bg-gray-900 text-white flex flex-col">
//       <div className="p-6">
//         <Link href="/" className="block">
//           <h1 className="text-2xl font-bold text-primary hover:text-primary-light transition-colors">
//             AgriPoa
//           </h1>
//         </Link>
//         <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
//       </div>

//       <nav className="flex-1 px-4">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = pathname === item.href;
          
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
//                 isActive
//                   ? 'bg-primary text-white'
//                   : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//               }`}
//             >
//               <Icon size={20} />
//               <span>{item.label}</span>
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-gray-800">
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full group"
//         >
//           <FiLogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }
