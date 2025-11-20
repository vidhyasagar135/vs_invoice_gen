import React from "react";
import { FaUnlock, FaCrown, FaGem } from "react-icons/fa";

const Pricing = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Choose Your Plan
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Free Trial */}
        <div className="border rounded-xl p-6 shadow-sm text-center transition transform hover:scale-105 dark:border-gray-700 h-full flex flex-col">
          <FaUnlock className="text-4xl text-gray-700 dark:text-gray-300 mb-4 mx-auto" />
          <h3 className="text-xl font-bold mb-2 dark:text-white">Free Trial</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Perfect to get started
          </p>
          <p className="text-2xl font-bold mb-4 dark:text-white">
            ₹0<span className="text-base font-normal">/month</span>
          </p>
          <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2 flex-grow">
            <li>✔️ 100 Invoices</li>
            <li>✔️ Basic templates</li>
            <li>✔️ Email support</li>
            <li>✔️ Basic analytics</li>
            <li>✔️ 1 user account</li>
          </ul>
          <button className="bg-gray-200 dark:bg-gray-700 dark:text-white px-6 py-3 rounded font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Start Free
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-xl p-6 shadow-lg text-center bg-black dark:bg-gray-800 text-white transition transform hover:scale-105 h-full flex flex-col">
          <FaCrown className="text-4xl mb-4 mx-auto" />
          <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
          <p className="text-gray-300 mb-4">Most popular choice</p>
          <p className="text-2xl font-bold mb-4">
            ₹500<span className="text-base font-normal">/month</span>
          </p>
          <ul className="text-white mb-6 space-y-2 flex-grow">
            <li>✔️ Unlimited invoices</li>
            <li>✔️ Premium templates</li>
            <li>✔️ Priority support</li>
            <li>✔️ Advanced analytics</li>
            <li>✔️ 3 user accounts</li>
          </ul>
          <button className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors">
            Choose Pro
          </button>
        </div>

        {/* Pro Plus Plan */}
        <div className="border rounded-xl p-6 shadow-sm text-center transition transform hover:scale-105 dark:border-gray-700 h-full flex flex-col">
          <FaGem className="text-4xl text-gray-700 dark:text-gray-300 mb-4 mx-auto" />
          <h3 className="text-xl font-bold mb-2 dark:text-white">
            Pro Plus Plan
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Best value for money
          </p>
          <p className="text-2xl font-bold mb-4 dark:text-white">
            ₹5000<span className="text-base font-normal">/year</span>
          </p>
          <ul className="text-gray-600 dark:text-gray-300 mb-6 space-y-2 flex-grow">
            <li>✔️ Unlimited invoices</li>
            <li>✔️ Custom branding</li>
            <li>✔️ 24/7 support</li>
            <li>✔️ Enterprise analytics</li>
            <li>✔️ 10 user accounts</li>
          </ul>
          
          <button className="bg-gray-200 dark:bg-gray-700 dark:text-white px-6 py-3 rounded font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Choose Pro Plus
          </button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
