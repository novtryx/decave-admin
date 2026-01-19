
import React, { useState } from 'react';
import { AiOutlineMenu, AiOutlineBell, AiOutlineLogout } from 'react-icons/ai';
import { FaRegBell } from 'react-icons/fa6';
import { TbLogout } from 'react-icons/tb';
import { LogoutModal } from './LogOutModal';
import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/router';
import { useLoadingStore } from '@/store/LoadingState';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}


export const Header: React.FC<HeaderProps> = ({ onMenuClick, onLogout }) => {
  const [notificationCount] = useState(13);
  const [showLogout, setShowLogout] = useState<boolean>(false)
  const {startLoading, stopLoading} = useLoadingStore()

  const handleLogout = async() => {
    startLoading()
    const res = await logoutAction()
    
    window.location.href = "/"
    stopLoading()
  }
  return (
    <header className="h-23 bg-[#151515] flex items-center justify-between px-4 lg:px-6">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <AiOutlineMenu size={24} className="text-[#F4F4F5]" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#F4F4F5] rounded-lg transition-colors">
          <FaRegBell size={22} className="text-[#F4F4F5]" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-auto px-1 h-auto bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

         {/* vertical line */}
          <div className='h-8 w-[0.5px] bg-[#C9C9C9]'></div>

         <div className="flex items-center space-x-3 px-2">
              <div className="relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                AD
                <div className='absolute bg-[#23A149] h-2 w-2 rounded-full bottom-0 right-1'></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <div className="text-xs mt-1 text-[#cca33a] cursor-pointer">
                  View Profile
                </div>
              </div>
            </div>

          {/* vertical line */}
          <div className='h-8 w-[0.5px] bg-[#C9C9C9]'>

          </div>
        {/* Logout */}
        <button
          onClick={() => setShowLogout(true)}
          className="flex items-center space-x-2 px-4 py-2 hover:bg-[#F4F4F5] cursor-pointer rounded-lg transition-colors"
        >
          <text className="hidden sm:inline text-[#EF4444] font-medium">Logout</text>
          <TbLogout className='text-2xl text-[#ef4444]' />
        </button>
      </div>
       <LogoutModal
        isOpen={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

