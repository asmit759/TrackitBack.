import React, { useState } from 'react';
import Logo from "../assets/mainlogo.png";
import { useNavigate, Link } from 'react-router-dom';
import handleLogout from './logout'; 
import { RiLogoutCircleRLine, RiMenu3Line, RiCloseLine } from "react-icons/ri";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <nav className='m-0 p-4 px-6 bg-black flex items-center justify-between overflow-x-hidden'>
      {/* Logo */}
      <div className='hover:shadow-yellow-glow flex items-center'>
        <img
          src={Logo}
          alt="Logo"
          className='h-10 sm:h-14 rounded-2xl cursor-pointer'
          onClick={() => navigate("/home")}
        />
      </div>
      
      {/* Hamburger for mobile */}
      <button
        className='md:hidden text-yellow-400 text-3xl ml-4'
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <RiCloseLine /> : <RiMenu3Line />}
      </button>

      {/* Menu */}
      <div className={`
        flex-col md:flex-row md:static absolute top-20 left-0 w-full md:w-auto bg-black gap-5
        transition-all duration-300 z-20 px-8 md:px-0
        ${menuOpen ? 'flex' : 'hidden'} md:flex
      `}>
        <Link 
          to='/home'
          onClick={()=>handleLinkClick('/home')}
          className='py-2 md:py-0  text-xl text-yellow-400 hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'
        >Home</Link>
        <Link 
          to='/post-item'
          onClick={()=>handleLinkClick('/post-item')}
          className='py-2 md:py-0 text-xl text-yellow-400 hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'
        >Post item</Link>
        <Link 
          to='/dashboard'
          onClick={()=>handleLinkClick('/dashboard')}
          className='py-2 md:py-0 text-xl text-yellow-400 hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'
        >Find item</Link>
        <Link 
          to='/your-post'
          onClick={()=>handleLinkClick('/your-post')}
          className='py-2 md:py-0 text-xl text-yellow-400 hover:text-yellow-200 hover:border-b-2 hover:border-yellow-200 cursor-pointer'
        >My Post</Link>
        <RiLogoutCircleRLine 
          onClick={()=>{ setMenuOpen(false); handleLogout(); }} 
          className='text-2xl m-1 text-yellow-400 cursor-pointer hover:text-red-400'
          title="Logout"
        />
      </div>
    </nav>
  );
};

export default Navbar;
