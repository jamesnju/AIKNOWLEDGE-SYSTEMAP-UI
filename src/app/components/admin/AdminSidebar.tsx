'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFileText, FiPlus, FiList, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { href: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
    { href: '/admin/content/list', icon: FiList, label: 'All Content' },
    { href: '/admin/content/create', icon: FiPlus, label: 'Create Content' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">AgriPoa</h1>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
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
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors w-full"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}