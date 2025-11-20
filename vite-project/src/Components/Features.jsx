

import React from 'react';
import {
  FaFileInvoice,
  FaBolt,
  FaSearch,
  FaChartLine,
  FaShieldAlt,
  FaCloud,
} from 'react-icons/fa';

// Feature data array
const features = [
  {
    icon: <FaFileInvoice className="text-2xl text-indigo-600" />,
    title: 'Professional Invoices',
    desc: 'Create clean, professional invoices with multiple items, descriptions, and automatic calculations.',
  },
  {
    icon: <FaBolt className="text-2xl text-indigo-600" />,
    title: 'Fast & Secure Platform',
    desc: 'Built on MERN stack with JWT authentication and secure data management.',
  },
  {
    icon: <FaSearch className="text-2xl text-indigo-600" />,
    title: 'Smart Search & Filter',
    desc: 'Instantly search and filter invoices by customer, date, or number.',
  },
  {
    icon: <FaChartLine className="text-2xl text-indigo-600" />,
    title: 'Dashboard Analytics',
    desc: 'Visual summary of business activity with detailed reporting.',
  },
  {
    icon: <FaShieldAlt className="text-2xl text-indigo-600" />,
    title: 'Strong Security',
    desc: 'Enterprise-grade security with JWT authentication and encrypted data.',
  },
  {
    icon: <FaCloud className="text-2xl text-indigo-600" />,
    title: 'Cloud Storage',
    desc: 'Secure cloud storage for all your invoices and business data.',
  },
];

// Main Features component
export default function Features() {
  return (
    <section className="py-16 px-6 md:px-12 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose InvoiceGen?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {/* <div className="mt-20 bg-gray-900 text-white dark:bg-gray-800 rounded-xl text-center p-10 max-w-4xl mx-auto shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Ready to streamline your invoicing?</h3>
        <p className="text-gray-300 mb-6">
          Join thousands of businesses using InvoiceGen to manage their invoicing needs efficiently.
        </p>
        <button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition">
          Start Free Trial
        </button>
      </div> */}
    </section>
  );
}
