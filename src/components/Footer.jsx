import React from 'react';
import { CiMail } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import {Link} from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-[#FCE694]/35 backdrop-blur-xs flex flex-col items-center justify-center gap-2 rounded-t-[4.5rem] px-4 py-6 sm:px-8 md:py-10 lg:rounded-t-[9rem]">
      {/* Icons with responsive size and gap */}
      <div className="flex gap-4 sm:gap-6 mt-2">
          <Link to="mailto:your@email.com" target="_blank" rel="noopener noreferrer">
            <CiMail
              className="text-2xl sm:text-3xl md:text-4xl bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition-colors cursor-pointer"
              aria-label="email"
            />
          </Link>

          <Link to="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FaInstagram
              className="text-2xl sm:text-3xl md:text-4xl bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition-colors cursor-pointer"
              aria-label="instagram"
            />
          </Link>

          <Link to="#" target="_blank" rel="noopener noreferrer">
            <RiTeamLine
              className="text-2xl sm:text-3xl md:text-4xl bg-yellow-400 p-2 rounded-full hover:bg-yellow-500 transition-colors cursor-pointer"
              aria-label="meet the team"
            />
          </Link>

      </div>

      {/* Copyright text */}
      <p className="text-sm sm:text-base md:text-lg text-amber-300 mt-2 mb-1 sm:mb-0 text-center select-none">
        © 2025 Trackit Back. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
