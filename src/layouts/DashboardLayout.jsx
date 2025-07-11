

// import useUserRole from '../hooks/useUserRole';
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { FaHome, FaUserEdit, FaCat, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { GrPowerCycle } from "react-icons/gr";

import PetifyLogo from '../pages/Shared/PetifyLogo';
import LogoSmall from '../pages/Shared/LogoSmall';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import ThemeToggle from '../components/ThemeToggle';
import { MdOutlinePets } from 'react-icons/md';

const menuLinks = [
  { to: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
  { to: '/dashboard/add-pet', icon: <FaCat />, label: 'Add a Pet' },
  { to: '/dashboard/my-added-pets', icon: <MdOutlinePets />, label: 'My Added Pets' },
  { to: '/dashboard/adoption-requests', icon: <GrPowerCycle   />, label: 'Adoption Requests' },
  { to: '/dashboard/my-profile', icon: <FaUserEdit color='black' />, label: 'My Profile' },
];

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const navigate = useNavigate();

  // Sidebar width
  const sidebarWidth = sidebarOpen ? 'w-64' : 'w-20';

  // Logout logic
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#14B8A6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logOut();
        navigate('/');
      }
    });
  };

  return (
    <div className="flex h-screen bg-base-100">
      <div className='max-w-[1540px] mx-auto w-full'>
        {/* Sidebar */}
        {/* Desktop Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-base-100 border-r border-primary/20 z-40 shadow-lg transition-all duration-300 ${sidebarWidth} hidden md:flex flex-col`}
        >
          {/* Logo and Hamburger */}
          {sidebarOpen ? (
            <div className="flex items-center justify-between px-4 py-4 border-b border-base-200">
              <Link to="/">
                <PetifyLogo />
              </Link>
              <button
                className="ml-2 p-2 rounded focus:outline-none"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Toggle sidebar"
              >
                <FaBars size={22} className='text-primary hover:text-secondary' />
              </button>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-between px-2 py-4 border-b border-base-200">
              <Link to="/">
                <LogoSmall />
              </Link>
              <button
                className="p-2 rounded focus:outline-none"
                onClick={() => setSidebarOpen(true)}
                aria-label="Toggle sidebar"
              >
                <FaBars size={22} className='text-primary hover:text-secondary' />
              </button>
            </div>
          )}
          {/* Menu */}
          <nav className={`flex-1 flex flex-col gap-2 mt-4 ${!sidebarOpen ? 'items-center' : ''}`}>
            {menuLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors duration-200 font-semibold
                ${sidebarOpen
                    ? 'flex items-center gap-4 px-4 py-2 rounded mx-2 my-1'
                    : 'flex flex-col items-center justify-center w-10 h-10 rounded my-1'}
                ${isActive ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/80 hover:text-white'}`
                }
                title={item.label}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </NavLink>
            ))}
          </nav>
          {/* User avatar and logout at the bottom */}
          <div className="mt-auto mb-4 flex flex-col items-center gap-2">
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-primary" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-secondary font-bold">
                {user?.displayName?.[0] || 'U'}
              </div>
            )}
            {sidebarOpen && (
              <span className="mt-2 text-xs text-secondary font-semibold text-center max-w-[120px] truncate">
                {user?.displayName || 'User'}
              </span>
            )}
          </div>
          <div className="mb-6 flex flex-col items-center mx-2 my-1">
            <button
              className={`flex items-center gap-2 rounded btn btn-error ${sidebarOpen ? 'w-full justify-center' : 'justify-center'}`}
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-secondary transition-opacity duration-300 md:hidden ${mobileSidebar ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          onClick={() => setMobileSidebar(false)}
          style={{ pointerEvents: mobileSidebar ? 'auto' : 'none' }}
        />
        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white border-r border-base-300 z-50 shadow-lg transition-transform duration-300 w-64 flex flex-col md:hidden ${mobileSidebar ? 'translate-x-0' : '-translate-x-full'
            }`}
          style={{ height: '100vh' }}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-base-200">
            <Link to="/">
              {sidebarOpen ? <PetifyLogo /> : <LogoSmall />}
            </Link>
            <button
              className="ml-2 p-2 rounded focus:outline-none hover:bg-primary"
              onClick={() => setMobileSidebar(false)}
              aria-label="Close sidebar"
            >
              <FaBars size={22} className='text-primary' />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2 mt-4">
            {menuLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-2 rounded mx-2 my-1 font-semibold transition-colors duration-200
                ${isActive ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/80 hover:text-white'}`
                }
                title={item.label}
                onClick={() => setMobileSidebar(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto mb-4 flex flex-col items-center gap-2">
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-primary" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-secondary font-bold">
                {user?.displayName?.[0] || 'U'}
              </div>
            )}
            <span className="mt-2 text-xs text-secondary font-semibold text-center max-w-[120px] truncate">
              {user?.displayName || 'User'}
            </span>
          </div>
          <div className="mb-6 flex flex-col items-center">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded text-white bg-error hover:bg-error/80 transition-colors duration-200 w-full justify-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}>
          {/* Top Navbar - full width, fixed */}
          <header className="fixed left-0 right-0 top-0 h-16 bg-base-100 border-b border-primary/20 flex items-center px-4 md:px-8 z-30 shadow-sm w-full">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden mr-2 p-2 rounded focus:outline-none hover:bg-base-200"
              onClick={() => setMobileSidebar(true)}
              aria-label="Open sidebar"
            >
              <FaBars size={22} />
            </button>
            {/* Theme toggle */}
            <button className=" mr-4 ml-auto" title="Theme Toggle">
              <ThemeToggle />
            </button>
            {/* User name */}
            <div className="flex items-center gap-2">
              {user && user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border-2 border-primary" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-secondary font-bold">
                  {user?.displayName?.[0] || 'U'}
                </div>
              )}
              <span className="font-semibold text-secondary hidden sm:inline-block">{user?.displayName || 'User'}</span>
            </div>
          </header>
          {/* Main content below navbar */}
          <main className="mt-16 p-4 md:p-8 bg-base-100 min-h-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;