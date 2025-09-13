"use client";

import {Link} from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-gradient-to-r from-blue-500 to-purple-600 text-white fixed top-0 z-50 shadow-lg px-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/" className="text-gray-800">
                🏠 Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-gray-800">
                📊 Dashboard
              </Link>
            </li>
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
        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/login"
            className="btn btn-sm btn-ghost text-white hover:bg-white/20"
          >
            Đăng nhập
          </Link>
          <Link to="/register" className="btn btn-sm btn-primary">
            Đăng ký
          </Link>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 100 1.5.75.75 0 000-1.5zM12 12a.75.75 0 100 1.5A.75.75 0 0012 12zm5.25 0a.75.75 0 100 1.5.75.75 0 000-1.5z"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40 text-gray-800"
            >
              <li>
                <Link to="/login">Đăng nhập</Link>
              </li>
              <li>
                <Link to="/register">Đăng ký</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
