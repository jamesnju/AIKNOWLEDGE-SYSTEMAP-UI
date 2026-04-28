'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiBell, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';

interface AdminHeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export default function AdminHeader({ onMenuClick, isSidebarOpen }: AdminHeaderProps) {
  const { admin, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden">
              <h1 className="text-xl font-bold text-primary">AgriPoa</h1>
            </Link>
          </div>

          {/* Welcome Text - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:block">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Welcome back, <span className="text-primary">{admin?.name}!</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage your agricultural content
            </p>
          </div>

          {/* Mobile Welcome Text - Smaller version */}
          <div className="sm:hidden">
            <h2 className="text-sm font-semibold text-gray-800">
              Hi, <span className="text-primary">{admin?.name?.split(' ')[0]}</span>
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {admin?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{admin?.email}</p>
                </div>
                <FiChevronDown 
                  size={16} 
                  className={`hidden sm:block text-gray-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                      <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
                    </div>
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <FiUser size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiUser size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


// 'use client';

// import { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { FiUser, FiBell, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
// import Link from 'next/link';

// export default function AdminHeader() {
//   const { admin, logout } = useAuth();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

//   return (
//     <>
//       <header className="bg-white shadow-md sticky top-0 z-40">
//         <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
//           <div className="flex justify-between items-center">
//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="lg:hidden text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
//             >
//               {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//             </button>

//             {/* Welcome Text - Hidden on mobile, shown on larger screens */}
//             <div className="hidden sm:block">
//               <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
//                 Welcome back, <span className="text-primary">{admin?.name}!</span>
//               </h2>
//               <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
//                 Manage your agricultural content
//               </p>
//             </div>

//             {/* Mobile Welcome Text - Smaller version */}
//             <div className="sm:hidden">
//               <h2 className="text-sm font-semibold text-gray-800">
//                 Hi, <span className="text-primary">{admin?.name?.split(' ')[0]}</span>
//               </h2>
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center gap-2 sm:gap-4">
//               {/* Notification Bell */}
//               <button className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-100">
//                 <FiBell size={20} />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
//               </button>

//               {/* Profile Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                   className="flex items-center gap-2 sm:gap-3 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold shadow-md">
//                     {admin?.name?.charAt(0).toUpperCase() || 'A'}
//                   </div>
//                   <div className="hidden sm:block text-left">
//                     <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
//                     <p className="text-xs text-gray-500 truncate max-w-[150px]">{admin?.email}</p>
//                   </div>
//                   <FiChevronDown 
//                     size={16} 
//                     className={`hidden sm:block text-gray-400 transition-transform duration-200 ${
//                       isProfileMenuOpen ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isProfileMenuOpen && (
//                   <>
//                     {/* Backdrop for mobile */}
//                     <div 
//                       className="fixed inset-0 z-40 lg:hidden"
//                       onClick={() => setIsProfileMenuOpen(false)}
//                     />
//                     <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-fade-in">
//                       <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
//                         <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
//                         <p className="text-xs text-gray-500 truncate">{admin?.email}</p>
//                       </div>
//                       <Link
//                         href="/admin/dashboard"
//                         className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                         onClick={() => setIsProfileMenuOpen(false)}
//                       >
//                         <FiUser size={16} />
//                         Dashboard
//                       </Link>
//                       <button
//                         onClick={() => {
//                           logout();
//                           setIsProfileMenuOpen(false);
//                         }}
//                         className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                       >
//                         <FiUser size={16} />
//                         Logout
//                       </button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Mobile Stats Bar */}
//           <div className="lg:hidden mt-3 pt-3 border-t border-gray-100">
//             <div className="grid grid-cols-3 gap-2 text-center">
//               <div className="bg-gray-50 rounded-lg p-2">
//                 <p className="text-xs text-gray-500">Role</p>
//                 <p className="text-sm font-semibold text-primary">{admin?.role || 'Admin'}</p>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-2">
//                 <p className="text-xs text-gray-500">Status</p>
//                 <p className="text-sm font-semibold text-green-600">Active</p>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-2">
//                 <p className="text-xs text-gray-500">Content</p>
//                 <p className="text-sm font-semibold text-primary">Manage</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Sidebar Menu (for small screens) */}
//       {isMobileMenuOpen && (
//         <>
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//           <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:hidden">
//             <div className="p-4 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
//                   {admin?.name?.charAt(0).toUpperCase() || 'A'}
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900">{admin?.name}</p>
//                   <p className="text-xs text-gray-500">{admin?.email}</p>
//                 </div>
//               </div>
//             </div>
//             <nav className="p-4">
//               <Link
//                 href="/admin/dashboard"
//                 className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <FiUser size={18} />
//                 Dashboard
//               </Link>
//               <Link
//                 href="/admin/content/create"
//                 className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <FiUser size={18} />
//                 Create Content
//               </Link>
//               <Link
//                 href="/admin/content/list"
//                 className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 <FiUser size={18} />
//                 All Content
//               </Link>
//               <button
//                 onClick={() => {
//                   logout();
//                   setIsMobileMenuOpen(false);
//                 }}
//                 className="w-full flex items-center gap-3 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-4"
//               >
//                 <FiUser size={18} />
//                 Logout
//               </button>
//             </nav>
//           </div>
//         </>
//       )}
//     </>
//   );
// }
