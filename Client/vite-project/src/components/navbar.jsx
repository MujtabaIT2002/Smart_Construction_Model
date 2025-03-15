// src/components/Navbar.js

import { useAuth } from "./authcontext"; // Import the Auth context
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Menu, ChevronDown, User as UserIcon } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link as ScrollLink } from 'react-scroll';
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, userRole, logout } = useAuth(); // Get context values and functions

  if (userRole === 'ADMIN') {
    // Admin Navbar
    return (
      <nav className="bg-neutral-100 text-neutral-800 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg">Admin Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Signed in as Admin</span>
          <Button variant="default" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </nav>
    );
  }

  // User Navbar
  return (
    <nav className="bg-neutral-100 text-neutral-800 p-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-10S17.52 2 12 2zm0 18c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zM7 11h10v2H7v-2z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-bold text-lg">Residential Society</span>
      </div>

      {/* Menu for desktop */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/" className="hover:text-neutral-600">
          Home
        </Link>
        <ScrollLink to="about-section" smooth={true} duration={500} className="hover:text-neutral-600 cursor-pointer">
          About
        </ScrollLink>
        <Link to="/contact" className="hover:text-neutral-600">
          Contact
        </Link>
        <div className="relative group">
          <div className="inline-block">
            <button className="flex items-center hover:text-neutral-600">
              Tools <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          </div>
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:block">
            <Link to="/cost-estimator" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-200">
              Cost Estimator
            </Link>
            <Link to="/search" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-200">
              Societies Finder
            </Link>
            <Link to="/price-predictor" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-200">
              House Prices Predictor
            </Link>
            <Link to="/society-recommender" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-200">
              Society Recommender
            </Link>
          </div>
        </div>
      </div>

      {/* Authenticated User Menu or Sign In/Sign Up */}
      <div className="hidden md:flex space-x-4">
        {isAuthenticated ? (
          <div className="relative group">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="bg-black text-white border-2 border-white">
                <AvatarImage 
                  src={user?.avatar || ''} 
                  alt="User Avatar" 
                  className="grayscale"
                />
                <AvatarFallback className="bg-black text-white">
                  <UserIcon className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4" />
            </div>
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link to="/history" className="block px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-200">
                History
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="default">Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      {/* Hamburger menu for mobile */}
      <div className="md:hidden">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            <Dialog.Content
              className="fixed left-0 top-0 h-full bg-neutral-100 p-6 shadow-lg"
              style={{ width: "250px" }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Menu</span>
                <Dialog.Close asChild>
                  <Button variant="outline" size="icon">
                    <X className="w-5 h-5" />
                  </Button>
                </Dialog.Close>
              </div>
              <div className="flex flex-col space-y-4">
                <Link to="/" className="hover:text-neutral-600">
                  Home
                </Link>
                <ScrollLink to="about-section" smooth={true} duration={500} className="hover:text-neutral-600 cursor-pointer">
                  About
                </ScrollLink>
                <Link to="/contact" className="hover:text-neutral-600">
                  Contact
                </Link>
                <div className="flex flex-col mt-6 space-y-4">
                  <Link to="/cost-estimator" className="hover:text-neutral-600">
                    Cost Estimator
                  </Link>
                  <Link to="/search" className="hover:text-neutral-600">
                    Societies Finder
                  </Link>
                  <Link to="/price-predictor" className="hover:text-neutral-600">
                    House Prices Predictor
                  </Link>
                  <Link to="/society-recommender" className="hover:text-neutral-600">
                    Society Recommender
                  </Link>
                </div>
              </div>
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col mt-6 space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/history">
                      <Button variant="outline">History</Button>
                    </Link>
                    <button onClick={logout}>
                      <Button variant="default">Sign Out</Button>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signin">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="default">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </nav>
  );
};

export default Navbar;
