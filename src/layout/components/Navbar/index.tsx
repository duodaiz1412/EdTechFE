"use client";

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-gradient-to-r from-blue-500 to-purple-600 text-white fixed top-0 z-50 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"></path>
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/" className="text-gray-800">🏠 Home</Link></li>
            <li><Link to="/dashboard" className="text-gray-800">📊 Dashboard</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          OrderManager
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link 
              to="/" 
              className="text-white hover:bg-white/20 rounded-full px-5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              🏠 Home
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className="text-white hover:bg-white/20 rounded-full px-5 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              📊 Dashboard
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {/* Add any additional navbar items here */}
      </div>
    </div>
  );
}