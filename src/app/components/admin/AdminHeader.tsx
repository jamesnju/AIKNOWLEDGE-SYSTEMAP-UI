'use client';

import { useAuth } from '../../context/AuthContext';
import { FiUser, FiBell } from 'react-icons/fi';

export default function AdminHeader() {
  const { admin } = useAuth();

  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, {admin?.name}!
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-primary transition-colors">
            <FiBell size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{admin?.name}</p>
              <p className="text-xs text-gray-500">{admin?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}