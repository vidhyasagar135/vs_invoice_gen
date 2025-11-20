import React from 'react';
import { FaFileInvoice } from 'react-icons/fa'; // Invoice icon

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Company Logo + Tagline */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <FaFileInvoice className="text-2xl text-black" />
            <span className="text-xl font-bold text-gray-800">InvoiceGen</span>
          </div>
          <p className="text-gray-600 text-sm">
            Making invoicing simple for businesses worldwide.
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Product</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Features</a></li>
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Pricing</a></li>
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Templates</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">About</a></li>
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Contact</a></li>
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Blog</a></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Privacy</a></li>
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Terms</a></li>
            <li><a href="#" className="text-gray-600 hover:text-black text-sm">Security</a></li>
          </ul>
        </div>

      </div>

      {/* Divider Line */}
      <div className="border-t border-gray-200 mt-10 pt-6 text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2025 InvoiceGen. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
