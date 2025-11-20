//fine working
import React from "react";
import { Link } from "react-router-dom";
import {
  FaBolt,
  FaEdit,
  FaShieldAlt,
  FaRegClipboard,
  FaCrown,
  FaLock,
  FaGem,
  FaUnlock,
  FaFileInvoice,
  FaSearch,
  FaChartLine,
  FaCloud,
} from "react-icons/fa";

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Create Professional Invoices
          <br />
          Effortlessly
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Generate beautiful, customized invoices in minutes with our intuitive
          platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-800 transition"
          >
            Get Started Free
          </Link>
          <button className="border border-black text-black px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Choose Your Plan</h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {/* Free Trial */}
          <div className="border rounded-xl p-6 shadow-sm text-center transition transform hover:scale-105">
            <FaUnlock className="text-4xl text-gray-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Free Trial</h3>
            <p className="text-gray-600 mb-4">Perfect to get started</p>
            <p className="text-2xl font-bold mb-4">
              ₹0<span className="text-base font-normal">/month</span>
            </p>
            <ul className="text-gray-600 mb-6 space-y-2">
              <li>✔️ 100 Invoices</li>
              <li>✔️ Basic templates</li>
              <li>✔️ Email support</li>
            </ul>
            <button
              className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300"
              onClick={() => (window.location.href = "/SignUp")}
            >
              Start Free
            </button>
            {/* <button className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300" >
              Start Free
            </button> */}
          </div>

          {/* Pro Plan */}
          <div className="border rounded-xl p-6 shadow-lg text-center bg-black text-white transition transform hover:scale-105">
            <FaCrown className="text-4xl mb-4" />
            <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
            <p className="text-gray-300 mb-4">Most popular choice</p>
            <p className="text-2xl font-bold mb-4">
              ₹500<span className="text-base font-normal">/month</span>
            </p>
            <ul className="text-white mb-6 space-y-2">
              <li>✔️ Unlimited invoices</li>
              <li>✔️ Premium templates</li>
              <li>✔️ Priority support</li>
            </ul>

            <Link
              to="/SignUp"
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Choose Pro
            </Link>

            {/* <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-100" >
              Choose Pro
            </button> */}
          </div>

          {/* Pro Plus Plan */}
          <div className="border rounded-xl p-6 shadow-sm text-center transition transform hover:scale-105">
            <FaGem className="text-4xl text-gray-700 mb-4" />
            <h3 className="text-xl font-bold mb-2">Pro Plus Plan</h3>
            <p className="text-gray-600 mb-4">Best value for money</p>
            <p className="text-2xl font-bold mb-4">
              ₹5000<span className="text-base font-normal">/year</span>
            </p>
            <ul className="text-gray-600 mb-6 space-y-2">
              <li>✔️ Unlimited invoices</li>
              <li>✔️ Custom branding</li>
              <li>✔️ 24/7 support</li>
            </ul>


            <Link
              to="/SignUp"
              className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300" 
            >
              Choose Pro Plus
            </Link>
           

            {/* <button className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300"   >
              Choose Pro Plus
            </button> */}
          </div>
        </div>
      </section>

      {/* Why Choose (Mini - Original) */}
      {/* <section className="bg-gray-50 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Why Choose InvoiceGen?</h2>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <FaBolt className="text-3xl text-black mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Create and send professional invoices in under 60 seconds.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <FaEdit className="text-3xl text-black mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customizable</h3>
            <p className="text-gray-600">Brand your invoices with your logo, colors, and custom fields.</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <FaShieldAlt className="text-3xl text-black mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">Bank-level security to protect your business data.</p>
          </div>
        </div>
      </section> */}

      {/* Why Choose (Full Grid) */}
      <section className="bg-white py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose InvoiceGen?
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            {
              icon: <FaFileInvoice className="text-2xl text-indigo-600" />,
              title: "Professional Invoices",
              desc: "Create clean, professional invoices with multiple items, descriptions, and automatic calculations.",
            },
            {
              icon: <FaBolt className="text-2xl text-indigo-600" />,
              title: "Fast & Secure Platform",
              desc: "Built on MERN stack with JWT authentication and secure data management.",
            },
            {
              icon: <FaSearch className="text-2xl text-indigo-600" />,
              title: "Smart Search & Filter",
              desc: "Instantly search and filter invoices by customer, date, or number.",
            },
            {
              icon: <FaChartLine className="text-2xl text-indigo-600" />,
              title: "Dashboard Analytics",
              desc: "Visual summary of business activity with detailed reporting.",
            },
            {
              icon: <FaShieldAlt className="text-2xl text-indigo-600" />,
              title: "Strong Security",
              desc: "Enterprise-grade security with JWT authentication and encrypted data.",
            },
            {
              icon: <FaCloud className="text-2xl text-indigo-600" />,
              title: "Cloud Storage",
              desc: "Secure cloud storage for all your invoices and business data.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-2xl font-bold mb-4">
            Ready to streamline your invoicing?
          </h3>
          <p className="text-gray-300 mb-6">
            Join thousands of businesses using InvoiceGen to manage their
            invoicing needs efficiently.
          </p>
          <button className="bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

////___________________________________________________________________________________
// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   FaBolt,
//   FaEdit,
//   FaShieldAlt,
//   FaRegClipboard,
//   FaCrown,
//   FaLock,
//   FaGem,
//   FaUnlock
// } from "react-icons/fa";

// const LandingPage = () => {
//   return (
//     <div className="bg-white min-h-screen flex flex-col">
//       <section className="flex flex-col items-center justify-center text-center py-20 px-6">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
//           Create Professional Invoices
//           <br />
//           Effortlessly
//         </h1>
//         <p className="text-lg md:text-xl text-gray-600 mb-8">
//           Generate beautiful, customized invoices in minutes with our intuitive
//           platform.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <Link
//             to="/signup"
//             className="bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-800 transition"
//           >
//             Get Started Free
//           </Link>
//           <button className="border border-black text-black px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition">
//             Watch Demo
//           </button>
//         </div>
//       </section>

//       {/* Pricing Plans Section */}
//       <section className="py-16 bg-white">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-800">Choose Your Plan</h2>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
//           {/* Free Trial */}
//           <div className="border rounded-xl p-6 shadow-sm text-center transition transform hover:scale-105">
//             <FaUnlock className="text-4xl text-gray-700 mb-4" />
//             <h3 className="text-xl font-bold mb-2">Free Trial</h3>
//             <p className="text-gray-600 mb-4">Perfect to get started</p>
//             <p className="text-2xl font-bold mb-4">
//               ₹0<span className="text-base font-normal">/month</span>
//             </p>
//             <ul className="text-gray-600 mb-6 space-y-2">
//               <li>✔️ 100 Invoices</li>
//               <li>✔️ Basic templates</li>
//               <li>✔️ Email support</li>
//             </ul>
//             <button className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300">
//               Start Free
//             </button>
//           </div>
//           {/* Pro Plan */}
//           <div className="border rounded-xl p-6 shadow-lg text-center bg-black text-white transition transform hover:scale-105">
//             <FaCrown className="text-4xl mb-4" />
//             <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
//             <p className="text-gray-300 mb-4">Most popular choice</p>
//             <p className="text-2xl font-bold mb-4">
//               ₹500<span className="text-base font-normal">/month</span>
//             </p>
//             <ul className="text-white mb-6 space-y-2">
//               <li>✔️ Unlimited invoices</li>
//               <li>✔️ Premium templates</li>
//               <li>✔️ Priority support</li>
//             </ul>
//             <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-100">
//               Choose Pro
//             </button>
//           </div>
//           {/* Pro Plus Plan */}

//           <div className="border rounded-xl p-6 shadow-sm text-center transition transform hover:scale-105">
//             <FaGem className="text-4xl text-gray-700 mb-4" />{" "}
//             Update this line if needed
//           <h3 className="text-xl font-bold mb-2">Pro Plus Plan</h3>
//             <p className="text-gray-600 mb-4">Best value for money</p>
//             <p className="text-2xl font-bold mb-4">
//               ₹5000<span className="text-base font-normal">/year</span>
//             </p>
//             <ul className="text-gray-600 mb-6 space-y-2">
//               <li>✔️ Unlimited invoices</li>
//               <li>✔️ Custom branding</li>
//               <li>✔️ 24/7 support</li>
//             </ul>
//             <button className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300">
//               Choose Pro Plus
//             </button>
//           </div>

//           {/* <div className="border rounded-xl p-6 shadow-sm text-center transition transform hover:scale-105">
//             <FaLock className="text-4xl text-gray-700 mb-4" />
//             <h3 className="text-xl font-bold mb-2">Pro Plus Plan</h3>
//             <p className="text-gray-600 mb-4">Best value for money</p>
//             <p className="text-2xl font-bold mb-4">₹5000<span className="text-base font-normal">/year</span></p>
//             <ul className="text-gray-600 mb-6 space-y-2">
//               <li>✔️ Unlimited invoices</li>
//               <li>✔️ Custom branding</li>
//               <li>✔️ 24/7 support</li>
//             </ul>
//             <button className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300">Choose Pro Plus</button>
//           </div> */}
//         </div>
//       </section>
//       <section className="bg-gray-50 py-16">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-800">
//             Why Choose InvoiceGen?
//           </h2>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
//           {/* Card 1 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaBolt className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
//             <p className="text-gray-600">
//               Create and send professional invoices in under 60 seconds.
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaEdit className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Customizable</h3>
//             <p className="text-gray-600">
//               Brand your invoices with your logo, colors, and custom fields.
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaShieldAlt className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Secure</h3>
//             <p className="text-gray-600">
//               Bank-level security to protect your business data.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Section */}
//       {/* ... */}
//     </div>
//   );
// };

// export default LandingPage;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaBolt, FaEdit, FaShieldAlt } from 'react-icons/fa';

// const LandingPage = () => {
//   return (
//     <div className="bg-white min-h-screen flex flex-col">

//       {/* Hero Section */}
//       <section className="flex flex-col items-center justify-center text-center py-20 px-6">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
//           Create Professional Invoices<br />Effortlessly
//         </h1>
//         <p className="text-lg md:text-xl text-gray-600 mb-8">
//           Generate beautiful, customized invoices in minutes with our intuitive platform.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <Link
//             to="/signup"
//             className="bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-800 transition"
//           >
//             Get Started Free
//           </Link>
//           <button
//             className="border border-black text-black px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition"
//           >
//             Watch Demo
//           </button>
//         </div>
//       </section>

//       {/* Pricing Plans Section */}
//       <section className="py-16 bg-white">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-800">Choose Your Plan</h2>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

//           {/* Free Trial */}
//           <div className="border rounded-xl p-6 shadow-sm text-center">
//             <h3 className="text-xl font-bold mb-2">Free Trial</h3>
//             <p className="text-gray-600 mb-4">Perfect to get started</p>
//             <p className="text-2xl font-bold mb-4">₹0<span className="text-base font-normal">/month</span></p>
//             <ul className="text-gray-600 mb-6 space-y-2">
//               <li>✔️ 100 Invoices</li>
//               <li>✔️ Basic templates</li>
//               <li>✔️ Email support</li>
//             </ul>
//             <button className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300">Start Free</button>
//           </div>

//           {/* Pro Plan */}
//           <div className="border rounded-xl p-6 shadow-lg text-center bg-black text-white">
//             <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
//             <p className="text-gray-300 mb-4">Most popular choice</p>
//             <p className="text-2xl font-bold mb-4">₹500<span className="text-base font-normal">/month</span></p>
//             <ul className="text-white mb-6 space-y-2">
//               <li>✔️ Unlimited invoices</li>
//               <li>✔️ Premium templates</li>
//               <li>✔️ Priority support</li>
//             </ul>
//             <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-100">Choose Pro</button>
//           </div>

//           {/* Pro Plus Plan */}
//           <div className="border rounded-xl p-6 shadow-sm text-center">
//             <h3 className="text-xl font-bold mb-2">Pro Plus Plan</h3>
//             <p className="text-gray-600 mb-4">Best value for money</p>
//             <p className="text-2xl font-bold mb-4">₹5000<span className="text-base font-normal">/year</span></p>
//             <ul className="text-gray-600 mb-6 space-y-2">
//               <li>✔️ Unlimited invoices</li>
//               <li>✔️ Custom branding</li>
//               <li>✔️ 24/7 support</li>
//             </ul>
//             <button className="bg-gray-200 px-6 py-2 rounded font-semibold hover:bg-gray-300">Choose Pro Plus</button>
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Section */}
//       <section className="bg-gray-50 py-16">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-800">Why Choose InvoiceGen?</h2>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
//           {/* Card 1 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaBolt className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
//             <p className="text-gray-600">
//               Create and send professional invoices in under 60 seconds.
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaEdit className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Customizable</h3>
//             <p className="text-gray-600">
//               Brand your invoices with your logo, colors, and custom fields.
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaShieldAlt className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Secure</h3>
//             <p className="text-gray-600">
//               Bank-level security to protect your business data.
//             </p>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// };

// export default LandingPage;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaBolt, FaEdit, FaShieldAlt } from 'react-icons/fa';

// const LandingPage = () => {
//   return (
//     <div className="bg-white min-h-screen flex flex-col">

//       {/* Hero Section */}
//       <section className="flex flex-col items-center justify-center text-center py-20 px-6">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
//           Create Professional Invoices<br />Effortlessly
//         </h1>
//         <p className="text-lg md:text-xl text-gray-600 mb-8">
//           Generate beautiful, customized invoices in minutes with our intuitive platform.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <Link
//             to="/signup"
//             className="bg-black text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-800 transition"
//           >
//             Get Started Free
//           </Link>
//           <button
//             className="border border-black text-black px-6 py-3 rounded-md font-semibold text-lg hover:bg-gray-100 transition"
//           >
//             Watch Demo
//           </button>
//         </div>
//       </section>

//       {/* Why Choose Section */}
//       <section className="bg-gray-50 py-16">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-gray-800">Why Choose InvoiceGen?</h2>
//         </div>

//         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

//           {/* Card 1 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaBolt className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
//             <p className="text-gray-600">
//               Create and send professional invoices in under 60 seconds.
//             </p>
//           </div>

//           {/* Card 2 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaEdit className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Customizable</h3>
//             <p className="text-gray-600">
//               Brand your invoices with your logo, colors, and custom fields.
//             </p>
//           </div>

//           {/* Card 3 */}
//           <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
//             <FaShieldAlt className="text-3xl text-black mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">Secure</h3>
//             <p className="text-gray-600">
//               Bank-level security to protect your business data.
//             </p>
//           </div>

//         </div>
//       </section>

//       {/* Footer */}

//     </div>
//   );
// };

// export default LandingPage;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import landingPageImage from '../assets/landingpage_image.png'; // Your image path

// const TypingEffect = ({ text, speed = 150, pause = 1000 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [forward, setForward] = useState(true);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     let timeout;

//     if (forward) {
//       if (index <= text.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index + 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(false), pause);
//       }
//     } else {
//       if (index >= 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index - 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(true), pause);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [index, forward, text, speed, pause]);

//   return (
//     <span className="border-r-2 border-gray-800 pr-1 animate-caret">{displayedText}</span>
//   );
// };

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col justify-between bg-white">

//       {/* Hero Section */}
//       <div className="w-full h-auto flex flex-col md:flex-row items-center justify-between bg-white px-8 md:px-16 py-10">

//         {/* Left Side */}
//         <div className="max-w-xl mb-10 md:mb-0">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
//             Create Professional Invoices
//           </h1>

//           <h2 className="text-2xl md:text-3xl font-light text-gray-600 mt-6">
//             <TypingEffect text="Simply and Easily" speed={120} pause={1200} />
//           </h2>

//           <div className="mt-8">
//             <Link
//               to="/login"
//               className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-300"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>

//         {/* Right Side Image */}
//         <div className="w-full md:w-1/2 flex justify-center">
//           <img
//             src={landingPageImage}
//             alt="Landing Page Illustration"
//             className="w-48 md:w-64 hover:scale-105 hover:rotate-2 transition-transform duration-500 ease-in-out"
//           />
//         </div>
//       </div>

//       {/* Why Choose Section */}
//       <div className="bg-gray-50 w-full py-16">
//         <div className="max-w-3xl mx-auto text-center space-y-6 px-6">
//           <h2 className="text-3xl font-bold text-gray-800">Why Choose InvoiceGen?</h2>
//           <p className="text-lg text-gray-600">
//             Generate invoices in minutes with our intuitive interface. Whether you're a freelancer, small business, or enterprise, InvoiceGen makes it easy to customize, brand, and send professional invoices — ensuring you get paid on time, every time.
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 w-full py-6">
//         <div className="text-center text-gray-500 text-sm">
//           &copy; 2025 InvoiceGen. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import landingPageImage from '../assets/landingpage_image.png'; // Make sure the path is correct

// // Typing Effect Component
// const TypingEffect = ({ text, speed = 150, pause = 1000 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [forward, setForward] = useState(true);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     let timeout;

//     if (forward) {
//       if (index <= text.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index + 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(false), pause);
//       }
//     } else {
//       if (index >= 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index - 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(true), pause);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [index, forward, text, speed, pause]);

//   return (
//     <span className="border-r-2 border-gray-800 pr-1 animate-caret">{displayedText}</span>
//   );
// };

// // Main Landing Page Component
// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col justify-between bg-white">

//       {/* Hero Section */}
//       <div className="w-full h-[450px] flex flex-col md:flex-row items-center justify-between bg-white px-8 md:px-16">
//         {/* Left Side Content */}
//         <div className="max-w-2xl mb-10 md:mb-0">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
//             Create Professional Invoices
//           </h1>

//           <h2 className="text-3xl md:text-4xl font-light text-gray-600 mt-6">
//             <TypingEffect text="Simply and Easily" speed={120} pause={1200} />
//           </h2>

//           <div className="mt-10">
//             <Link
//               to="/login"
//               className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-300"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>

//         {/* Right Side Image */}
//         <div className="w-full md:w-1/2 flex justify-center">
//           <img
//             src={landingPageImage}
//             alt="Landing Page Illustration"
//             className="w-60 md:w-72 transition-transform duration-500 ease-in-out hover:scale-105 hover:rotate-1 hover:shadow-2xl animate-float"
//           />
//         </div>
//       </div>

//       {/* Why Choose Section */}
//       <div className="bg-gray-50 w-full py-16">
//         <div className="max-w-3xl mx-auto text-center space-y-6 px-6">
//           <h2 className="text-3xl font-bold text-gray-800">Why Choose InvoiceGen?</h2>
//           <p className="text-lg text-gray-600">
//             Generate invoices in minutes with our intuitive interface. Whether you're a freelancer, small business, or enterprise, InvoiceGen makes it easy to customize, brand, and send professional invoices — ensuring you get paid on time, every time.
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 w-full py-6">
//         <div className="text-center text-gray-500 text-sm">
//           &copy; 2025 InvoiceGen. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import landingPageImage from '../assets/landingpage_image.png'; // <-- Import your image

// const TypingEffect = ({ text, speed = 150, pause = 1000 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [forward, setForward] = useState(true);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     let timeout;

//     if (forward) {
//       if (index <= text.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index + 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(false), pause);
//       }
//     } else {
//       if (index >= 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index - 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(true), pause);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [index, forward, text, speed, pause]);

//   return (
//     <span className="border-r-2 border-gray-800 pr-1 animate-caret">{displayedText}</span>
//   );
// };

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col justify-between bg-white">

//       {/* Hero Section */}
//       <div className="w-full h-[500px] flex flex-col md:flex-row items-center justify-between bg-white px-8 md:px-16">
//         {/* Left Side Content */}
//         <div className="max-w-2xl mb-10 md:mb-0">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
//             Create Professional Invoices
//           </h1>

//           <h2 className="text-3xl md:text-4xl font-light text-gray-600 mt-6">
//             <TypingEffect text="Simply and Easily" speed={120} pause={1200} />
//           </h2>

//           <div className="mt-10">
//             <Link
//               to="/login"
//               className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-300"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>

//         {/* Right Side Image */}
//         <div className="w-full md:w-1/2 flex justify-center">
//           <img
//             src={landingPageImage}
//             alt="Landing Page Illustration"
//             className="w-80 md:w-96 animate-float"
//           />
//         </div>
//       </div>

//       {/* Why Choose Section */}
//       <div className="bg-gray-50 w-full py-16">
//         <div className="max-w-3xl mx-auto text-center space-y-6 px-6">
//           <h2 className="text-3xl font-bold text-gray-800">Why Choose InvoiceGen?</h2>
//           <p className="text-lg text-gray-600">
//             Generate invoices in minutes with our intuitive interface. Whether you're a freelancer, small business, or enterprise, InvoiceGen makes it easy to customize, brand, and send professional invoices — ensuring you get paid on time, every time.
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 w-full py-6">
//         <div className="text-center text-gray-500 text-sm">
//           &copy; 2025 InvoiceGen. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const TypingEffect = ({ text, speed = 150, pause = 1000 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [forward, setForward] = useState(true);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     let timeout;

//     if (forward) {
//       if (index <= text.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index + 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(false), pause);
//       }
//     } else {
//       if (index >= 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index - 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(true), pause);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [index, forward, text, speed, pause]);

//   return (
//     <span className="border-r-2 border-gray-800 pr-1 animate-caret">{displayedText}</span>
//   );
// };

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col justify-between bg-white">

//       {/* Hero Section */}
//       <div className="w-full h-[400px] flex items-center bg-white px-8 md:px-16">
//         <div className="max-w-2xl">
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
//             Create Professional Invoices
//           </h1>

//           <h2 className="text-3xl md:text-4xl font-light text-gray-600 mt-6">
//             <TypingEffect text="Simply and Easily" speed={120} pause={1200} />
//           </h2>

//           <div className="mt-10">
//             <Link
//               to="/login"
//               className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-300"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Why Choose Section */}
//       <div className="bg-gray-50 w-full py-16">
//         <div className="max-w-3xl mx-auto text-center space-y-6 px-6">
//           <h2 className="text-3xl font-bold text-gray-800">Why Choose InvoiceGen?</h2>
//           <p className="text-lg text-gray-600">
//             Generate invoices in minutes with our intuitive interface. Whether you're a freelancer, small business, or enterprise, InvoiceGen makes it easy to customize, brand, and send professional invoices — ensuring you get paid on time, every time.
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 w-full py-6">
//         <div className="text-center text-gray-500 text-sm">
//           &copy; 2025 InvoiceGen. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const TypingEffect = ({ text, speed = 150, pause = 1000 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [forward, setForward] = useState(true);
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     let timeout;

//     if (forward) {
//       if (index <= text.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index + 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(false), pause);
//       }
//     } else {
//       if (index >= 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index - 1);
//         }, speed);
//       } else {
//         timeout = setTimeout(() => setForward(true), pause);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [index, forward, text, speed, pause]);

//   return (
//     <span className="border-r-2 border-white pr-1 animate-caret">{displayedText}</span>
//   );
// };

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col justify-between bg-white">
//       {/* Hero Section */}
//       <div className="bg-[#006fff] w-full h-[400px] flex items-center text-white shadow-lg px-8 md:px-16">
//         {/* Left aligned content container */}
//         <div className="max-w-xl">
//           {/* Static Big Heading */}
//           <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
//             Create professional invoice&apos;s
//           </h1>

//           {/* Typing Effect Line */}
//           <h2 className="text-3xl md:text-4xl font-light tracking-wide mt-6">
//             <TypingEffect text="Simply and Easily" speed={120} pause={1200} />
//           </h2>

//           {/* Get Started Button */}
//           <div className="mt-10">
//             <Link
//               to="/login"
//               className="bg-white text-[#006fff] px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-[#0051cc] hover:text-white border border-white hover:border-white transition duration-300"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Why Choose Section */}
//       <div className="bg-white w-full py-16">
//         <div className="max-w-2xl mx-auto text-center space-y-6">
//           <h2 className="text-3xl font-bold text-[#006fff]">Why Choose InvoiceGen?</h2>
//           <p className="text-lg text-gray-700">
//             Generate invoices in minutes with our intuitive interface. Whether you're a freelancer, small business, or enterprise, InvoiceGen makes it easy to customize, brand, and send professional invoices-ensuring you get paid on time, every time.
//           </p>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <footer className="bg-[#006fff] w-full py-6 mt-8 shadow-inner">
//         <div className="text-center text-white text-sm tracking-wide">
//           &copy; 2025 InvoiceGen. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const TypingEffect = ({ text, speed = 150, pause = 1000 }) => {
//   const [displayedText, setDisplayedText] = useState('');
//   const [forward, setForward] = useState(true); // typing forward or deleting
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     let timeout;

//     if (forward) {
//       if (index <= text.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index + 1);
//         }, speed);
//       } else {
//         // Pause at full text, then start deleting
//         timeout = setTimeout(() => setForward(false), pause);
//       }
//     } else {
//       if (index >= 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText(text.slice(0, index));
//           setIndex(index - 1);
//         }, speed);
//       } else {
//         // Pause at empty text, then start typing
//         timeout = setTimeout(() => setForward(true), pause);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [index, forward, text, speed, pause]);

//   return (
//     <span className="border-r-2 border-white pr-1 animate-caret">{displayedText}</span>
//   );
// };

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col justify-between items-center bg-white">
//       {/* Hero Section */}
//       <div className="bg-[#006fff] w-full h-[400px] flex flex-col justify-center items-center text-center text-white space-y-8 shadow-lg px-4">
//         {/* Static Big Heading */}
//         <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
//           Create professional invoice&apos;s
//         </h1>

//         {/* Typing Effect Line */}
//         <h2 className="text-3xl md:text-4xl font-light tracking-wide">
//           <TypingEffect text="Simply and Easily" speed={120} pause={1200} />
//         </h2>

//         {/* Get Started Button */}
//         <div className="mt-8">
//           <Link
//             to="/login"
//             className="bg-white text-[#006fff] px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:bg-[#0051cc] hover:text-white border border-white hover:border-white transition duration-300"
//           >
//             Get Started
//           </Link>
//         </div>
//       </div>

//       {/* Why Choose Section */}
//       <div className="bg-white w-full py-16">
//         <div className="max-w-2xl mx-auto text-center space-y-6">
//           <h2 className="text-3xl font-bold text-[#006fff]">Why Choose InvoiceGen?</h2>
//           <p className="text-lg text-gray-700">
//             Generate invoices in minutes with our intuitive interface. Whether you're a freelancer, small business, or enterprise, InvoiceGen makes it easy to customize, brand, and send professional invoices-ensuring you get paid on time, every time.
//           </p>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <footer className="bg-[#006fff] w-full py-6 mt-8 shadow-inner">
//         <div className="text-center text-white text-sm tracking-wide">
//           &copy; 2025 InvoiceGen. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import Typing from 'react-typing-animation';

// const LandingPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-[#f7f7f7]">
//       {/* Hero Section */}
//       <div className="bg-[#00668c] w-full h-[350px] flex flex-col justify-center items-center text-center text-[#fffefb] space-y-6">
//         {/* Typing animation */}
//         <Typing loop speed={100} className="space-y-4">
//           <h1 className="text-6xl font-bold">Create Professional Invoices</h1>
//           <h2 className="text-4xl">Quickly and Easily</h2>
//         </Typing>

//         {/* Call to action button */}
//         <div className="mt-6">
//           <Link
//             to="/login"
//             className="bg-[#71c4ef] text-[#00668c] px-6 py-3 rounded-md font-semibold text-lg transition duration-300 hover:bg-[#00668c] hover:text-[#fffefb]"
//           >
//             Get Started
//           </Link>
//         </div>
//       </div>

//       {/* Why Choose Section */}
//       <div className="bg-[#d4eaf7] w-full py-12">
//         <div className="text-center text-[#313d44] space-y-4">
//           <h2 className="text-3xl font-semibold">Why Choose Invoice Generator?</h2>
//           <p className="text-lg max-w-xl mx-auto text-[#cccbc8]">
//             Generate invoices in minutes with an easy-to-use interface. Whether you're a freelancer, small business, or enterprise, our tool has you covered. Customize invoices, add logos, and ensure timely payment.
//           </p>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <div className="bg-[#313d44] w-full py-6 mt-8">
//         <div className="text-center text-[#fffefb]">
//           <p>&copy; 2025 InvoiceGen. All rights reserved.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;
