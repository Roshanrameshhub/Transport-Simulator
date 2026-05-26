import React, { useState } from 'react';

const Navbar = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "User Input", page: "UserInput" },
    { name: "Route Plan", page: "RoutePlan" },
    { name: "Booking", page: "Booking" },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">Transport Planner</div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <div className={`md:flex md:items-center md:space-x-8 ${isOpen ? 'block' : 'hidden'} absolute md:relative top-full left-0 w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-700 md:bg-none p-4 md:p-0 z-10`}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href="#"
              onClick={() => { onNavigate(link.page); setIsOpen(false); }}
              className={`block text-white text-lg font-medium hover:text-blue-200 transition duration-300 ${currentPage === link.page ? 'border-b-2 border-blue-200' : ''} md:inline-block md:mt-0 mt-4`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
