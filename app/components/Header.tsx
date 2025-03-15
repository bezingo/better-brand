"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, ShoppingCart, User, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Better Brand
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">
              Home
            </Link>
            <Link href="/shop" className="hover:text-gray-600 dark:hover:text-gray-300">
              Shop
            </Link>
            <Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Account */}
            <Link 
              href={user ? "/account" : "/login"} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Account"
            >
              <User size={20} />
            </Link>

            {/* Shopping Cart */}
            <Link 
              href="/cart" 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4 flex flex-col">
            <Link 
              href="/" 
              className="hover:text-gray-600 dark:hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="hover:text-gray-600 dark:hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className="hover:text-gray-600 dark:hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="hover:text-gray-600 dark:hover:text-gray-300 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}