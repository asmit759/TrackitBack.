import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/mainlogo.png";
import handleLogout from "./logout";
import { CgSearch } from "react-icons/cg";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";

const NavSch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed === "") {
      setSearchTerm("");
      if (location.pathname !== "/dashboard") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      navigate(`/dashboard?search=${encodeURIComponent(trimmed)}`);
    }
    setIsMenuOpen(false); // Hide menu after search (optional)
  };

  return (
    <nav className="w-full px-4 sm:px-8 py-3 bg-black flex items-center justify-between relative z-20">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={Logo}
          alt="Main Logo"
          className="h-12 md:h-16 rounded-2xl cursor-pointer"
          onClick={() => navigate("/home")}
        />
      </div>

      {/* Search Item*/}
      <div className="hidden md:flex relative items-center mx-4 w-[20rem] lg:w-[30rem]">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border-white/65 focus:bg-white focus:text-black text-white placeholder-white p-2 md:p-3 rounded-3xl w-full bg-white/10 backdrop-blur-md transition-all pr-10"
        />
        <CgSearch
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white cursor-pointer hover:text-yellow-300"
          size={22}
        />
      </div>


      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-6 text-lg text-yellow-400">
        <a href="/home" className="hover:text-yellow-200 hover:border-b-2 border-yellow-200 transition-all">
          Home
        </a>
        <a href="/post-item" className="hover:text-yellow-200 hover:border-b-2 border-yellow-200 transition-all">
          Post Item
        </a>
        <a href="/dashboard" className="hover:text-yellow-200 hover:border-b-2 border-yellow-200 transition-all">
          Find Item
        </a>
        <a href="/your-post" className="hover:text-yellow-200 hover:border-b-2 border-yellow-200 transition-all">
          My Items
        </a>
        <RiLogoutCircleRLine
          onClick={handleLogout}
          className="text-2xl cursor-pointer hover:text-red-400"
        />
      </div>

      {/* Hamburger Icon - mobile only */}
      <div className="md:hidden flex items-center z-30">
        <button
          onClick={() => setIsMenuOpen((x) => !x)}
          aria-label="Open menu"
          className="p-2 focus:outline-none text-yellow-300"
        >
          {isMenuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 flex flex-col justify-start items-start p-6 gap-6 text-yellow-400 top-0 left-0 z-40 md:hidden animate-slide-in">
          <div className="flex items-center w-full justify-between mb-8">
            <img
              src={Logo}
              alt="Main Logo"
              className="h-12 rounded-2xl cursor-pointer"
              onClick={() => { navigate("/home"); setIsMenuOpen(false); }}
            />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 focus:outline-none text-yellow-200"
              aria-label="Close menu"
            >
              <HiX size={28} />
            </button>
          </div>
          {/* Mobile search bar */}
          <div className="w-full relative mb-6">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="border-white/65 focus:bg-white focus:text-black text-white placeholder-white p-2 rounded-3xl w-full bg-white/10 backdrop-blur-md transition-all"
            />
            <CgSearch
              onClick={handleSearch}
              className="text-white absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer hover:text-yellow-300"
              size={22}
            />
          </div>
          <a href="/home" className="hover:text-yellow-200 text-xl" onClick={() => setIsMenuOpen(false)}>
            Home
          </a>
          <a href="/post-item" className="hover:text-yellow-200 text-xl" onClick={() => setIsMenuOpen(false)}>
            Post Item
          </a>
          <a href="/dashboard" className="hover:text-yellow-200 text-xl" onClick={() => setIsMenuOpen(false)}>
            Find Item
          </a>
          <a href="/your-post" className="hover:text-yellow-200 text-xl" onClick={() => setIsMenuOpen(false)}>
            My Items
          </a>
          <button onClick={handleLogout} className="mt-4 text-2xl text-red-400 hover:text-red-200 flex items-center gap-2">
            <RiLogoutCircleRLine />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavSch;
