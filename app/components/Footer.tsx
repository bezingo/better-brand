"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Better Brand</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Premium products for a better lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="hover:text-gray-600 dark:hover:text-gray-300" size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="hover:text-gray-600 dark:hover:text-gray-300" size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="hover:text-gray-600 dark:hover:text-gray-300" size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-gray-600 dark:hover:text-gray-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-600 dark:hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="hover:text-gray-600 dark:hover:text-gray-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gray-600 dark:hover:text-gray-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>123 Main Street, City, Country</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>info@betterbrand.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 pb-4">
          <div className="flex flex-wrap justify-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">We accept:</span>
            <span className="text-sm">Visa</span>
            <span className="text-sm">Mastercard</span>
            <span className="text-sm">American Express</span>
            <span className="text-sm">PayPal</span>
            <span className="text-sm">Apple Pay</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {currentYear} Better Brand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}