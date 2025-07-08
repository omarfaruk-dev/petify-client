import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { FaBars, FaTimes, FaUser, FaPaw, FaHome, FaListUl, FaPlus, FaRegUserCircle, FaDashcube, FaUserAlt } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../../components/ThemeToggle";
import PetifyLogo from "./PetifyLogo";
import Swal from "sweetalert2";
import { MdOutlineDashboard } from "react-icons/md";

const NavBar = () => {
  const { user, logOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef();

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14B8A6", // primary
      cancelButtonColor: "#F9A51A", // secondary
      confirmButtonText: "Yes, log out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            navigate("/");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message || "Logout failed!",
            });
          });
      }
    });
  };

  const links = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center gap-2 font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-secondary"} hover:text-primary`
        }
      >
        <FaHome /> Home
      </NavLink>
      <NavLink
        to="/pets"
        className={({ isActive }) =>
          `flex items-center gap-2 font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-secondary"} hover:text-primary`
        }
      >
        <FaPaw /> Pet Listing
      </NavLink>
      <NavLink
        to="/campaigns"
        className={({ isActive }) =>
          `flex items-center gap-2 font-medium transition-colors duration-200 ${isActive ? "text-primary" : "text-secondary"} hover:text-primary`
        }
      >
        <FaPlus /> Donation Campaigns
      </NavLink>
    </>
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 bg-base-100 border-b border-secondary/20 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center w-full">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <PetifyLogo />
            </Link>
          </div>
          {/* Navigation and Actions - right side */}
          <div className="flex items-center justify-end flex-1 space-x-4">
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {links}
              {!user && (
                <Link
                  to="/login"
                  className="hidden md:inline-flex btn btn-primary text-base-100 rounded transition"
                >
                  Login
                </Link>
              )}
              {user && (
                <>
                  <div className="relative">
                    <button
                      className="ml-2 bg-base-100 border border-primary text-primary rounded-full hover:bg-base-100 focus:outline-none flex items-center justify-center"
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          className="w-9 h-9 rounded-full"
                          alt="User"
                        />
                      ) : (
                        <FaUser className="w-9 h-9 p-1 text-secondary" />
                      )}
                    </button>
                    <div
                      className={`absolute -right-12 mt-2 w-56 bg-base-100 border border-secondary/20 rounded-lg shadow-lg z-50 transition-all duration-500 ease-in-out transform ${
                        userMenuOpen
                          ? "opacity-100 scale-100 pointer-events-auto visible"
                          : "opacity-0 scale-95 pointer-events-none invisible"
                      }`}
                      style={{ minWidth: "12rem" }}
                      aria-hidden={!userMenuOpen}
                    >
                      <div className="flex flex-col items-center justify-between px-4 py-2 border-b border-dashed border-secondary/20">
                        <img
                          src={user?.photoURL}
                          className="w-14 p-1 border-2 border-secondary/30 rounded-full"
                          alt="User"
                        />
                        <div
                          className="px-4 py-2 font-semibold text-secondary"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {user.displayName}
                        </div>
                      </div>
                      <NavLink
                        to="/profile"
                        className="flex items-center w-full px-4 py-2 text-secondary hover:text-primary hover:translate-x-2 duration-500"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <MdOutlineDashboard  className="mr-2" /> Dashboard
                      </NavLink>
                      <NavLink
                        to="/add-pet"
                        className="flex items-center w-full px-4 py-2 mb-2 text-secondary hover:text-primary hover:translate-x-2 duration-500"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaUserAlt className="mr-2" /> My Profile
                      </NavLink>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex border-t border-dashed border-secondary/20 items-center w-full px-4 py-2 text-secondary hover:text-primary hover:translate-x-2 duration-500"
                      >
                        <IoLogOutOutline size={20} className="mr-2" /> Log Out
                      </button>
                    </div>
                  </div>
                  {/* <button
                    onClick={handleLogout}
                    className="hidden md:inline-flex items-center justify-center btn btn-secondary text-base-100 rounded-3xl transition h-10 px-6 ml-2"
                  >
                    Log Out
                  </button> */}
                </>
              )}
            </div>
            {/* Theme Toggle at the right end */}
            <div className="ml-2 flex-shrink-0">
              <ThemeToggle />
            </div>
            {/* Hamburger */}
            {!menuOpen && (
              <button
                className="md:hidden ml-2 p-2 rounded focus:outline-none"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FaBars className="text-secondary" size={22} />
              </button>
            )}
            
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          menuOpen
            ? "translate-x-0 opacity-100 visible"
            : "-translate-x-full opacity-0 invisible"
        }`}
        style={{ pointerEvents: menuOpen ? "auto" : "none" }}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Sidebar */}
        <div
          className={`fixed bg-base-100 border-r border-secondary/20 w-64 h-full px-4 pb-4 pt-6 shadow-lg transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <PetifyLogo />
            </div>
            <button
              className="p-2 rounded focus:outline-none"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes className="text-secondary" size={22} />
            </button>
          </div>
          <ul className="flex flex-col gap-4">
            {React.Children.map(links.props.children, (link, idx) => (
              <li
                className="hover:translate-x-2 duration-500 hover:text-primary text-secondary"
                key={idx}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </li>
            ))}
          </ul>
          <div className="flex flex-col flex-1 justify-end pb-6">
            {user ? (
              <>
                <div className="flex flex-col items-center gap-3 mb-4 mt-6 px-2">
                  <img
                    src={user?.photoURL}
                    className="w-14 h-14 p-1 border-2 border-secondary/30 rounded-full object-cover"
                    alt="User"
                  />
                  <div className="font-semibold text-secondary text-center">{user.displayName}</div>
                  <div className="w-full border-b border-dashed border-secondary/20 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center btn btn-secondary text-white px-4 py-1 rounded-full gap-x-1 transition h-10 w-full"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center btn btn-secondary rounded text-white px-4 py-1 font-medium transition h-10"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;