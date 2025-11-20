
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFileInvoice } from 'react-icons/fa';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-md transition duration-300">
      <div className="container mx-auto flex justify-between items-center py-4 px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <FaFileInvoice className="text-black dark:text-white text-2xl" />
          <span className="text-black dark:text-white font-bold text-xl">InvoiceGen</span>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/features" 
            className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            Pricing
          </Link>
          {/* <Link 
            to="/templates" 
            className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            Templates
          </Link> */}
          <Link 
            to="/CustomerCare" 
            className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            Support
          </Link>
        </div>

        {/* Right buttons */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-black dark:text-white text-xl focus:outline-none"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-black dark:bg-white text-white dark:text-black font-medium px-5 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition"
              >
                Get Started
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaFileInvoice } from 'react-icons/fa';
// import { FaSun, FaMoon } from 'react-icons/fa';

// const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
//   const navigate = useNavigate();
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem('theme') === 'dark'
//   );

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [darkMode]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-md transition duration-300">
//       <div className="container mx-auto flex justify-between items-center py-4 px-8">
//         {/* Logo */}
//         <Link to="/" className="flex items-center space-x-2">
//           <FaFileInvoice className="text-black dark:text-white text-2xl" />
//           <span className="text-black dark:text-white font-bold text-xl">InvoiceGen</span>
//         </Link>

//         {/* Center links */}
//         <div className="hidden md:flex items-center space-x-8">
//           <Link to="/features" className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition">
//             Features
//           </Link>
//           <Link to="/pricing" className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition">
//             Pricing
//           </Link>
//           <Link to="/templates" className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition">
//             Templates
//           </Link>
//           <Link to="/support" className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition">
//             Support
//           </Link>
//         </div>

//         {/* Right buttons */}
//         <div className="flex items-center space-x-4">
//           {/* Theme toggle */}
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="text-black dark:text-white text-xl focus:outline-none"
//             title="Toggle Theme"
//           >
//             {darkMode ? <FaSun /> : <FaMoon />}
//           </button>

//           {!isAuthenticated ? (
//             <>
//               <Link to="/login" className="text-black dark:text-white font-medium hover:text-gray-600 dark:hover:text-gray-300 transition">
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-black dark:bg-white text-white dark:text-black font-medium px-5 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition"
//               >
//                 Get Started
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaFileInvoice } from 'react-icons/fa'; // Using an invoice icon

// const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="container mx-auto flex justify-between items-center py-4 px-8">
//         {/* Logo */}
//         <Link to="/" className="flex items-center space-x-2">
//           <FaFileInvoice className="text-black text-2xl" />
//           <span className="text-black font-bold text-xl">InvoiceGen</span>
//         </Link>

//         {/* Center links */}
//         <div className="hidden md:flex items-center space-x-8">
//           <Link to="/features" className="text-black font-medium hover:text-gray-600 transition">
//             Features
//           </Link>
//           <Link to="/pricing" className="text-black font-medium hover:text-gray-600 transition">
//             Pricing
//           </Link>
//           <Link to="/templates" className="text-black font-medium hover:text-gray-600 transition">
//             Templates
//           </Link>
//           <Link to="/support" className="text-black font-medium hover:text-gray-600 transition">
//             Support
//           </Link>
//         </div>

//         {/* Right buttons */}
//         <div className="flex items-center space-x-4">
//           {!isAuthenticated ? (
//             <>
//               <Link to="/login" className="text-black font-medium hover:text-gray-600 transition">
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-black text-white font-medium px-5 py-2 rounded-md hover:bg-gray-800 transition"
//               >
//                 Get Started
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="container mx-auto flex justify-between items-center py-4 px-6">
//         <Link to="/" className="text-gray-800 text-2xl font-bold tracking-tight hover:text-gray-600 transition">
//           InvoiceGen
//         </Link>
//         <div className="flex items-center space-x-4">
//           {!isAuthenticated ? (
//             <>
//               <Link
//                 to="/login"
//                 className="text-gray-700 border border-gray-300 hover:bg-gray-100 px-5 py-2 rounded-md font-medium transition duration-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signUp"
//                 className="bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-md font-medium transition duration-200"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white hover:bg-red-600 px-5 py-2 rounded-md font-medium transition duration-200"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="container mx-auto flex justify-between items-center py-4 px-6">
//         <Link to="/" className="text-[#006fff] text-2xl font-bold tracking-wide hover:text-[#004fcc] transition">
//           InvoiceGen
//         </Link>
//         <div className="flex items-center space-x-4">
//           {!isAuthenticated ? (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-[#006fff] text-white border border-[#006fff] hover:bg-white hover:text-[#006fff] px-5 py-2 rounded-full font-medium transition duration-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signUp"
//                 className="bg-white text-[#006fff] border border-[#006fff] hover:bg-[#006fff] hover:text-white px-5 py-2 rounded-full font-medium transition duration-200"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-[#006fff] text-white border border-[#006fff] hover:bg-red-500 hover:text-white px-5 py-2 rounded-full font-medium transition duration-200"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="container mx-auto flex justify-between items-center py-4 px-6">
//         <Link
//           to="/"
//           className="text-[#006fff] text-2xl font-bold tracking-wide hover:text-[#004fcc] transition"
//         >
//           InvoiceGen
//         </Link>
//         <div className="flex items-center space-x-4">
//           {!isAuthenticated ? (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-[#006fff] text-white border border-[#006fff] hover:bg-white hover:text-[#006fff] px-5 py-2 rounded-full font-medium transition duration-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signUp"
//                 className="bg-white text-[#006fff] border border-[#006fff] hover:bg-[#006fff] hover:text-white px-5 py-2 rounded-full font-medium transition duration-200"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-[#006fff] text-white border border-[#006fff] hover:bg-red-500 hover:text-white px-5 py-2 rounded-full font-medium transition duration-200"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = localStorage.getItem('token');

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-[#006fff] shadow-lg">
//       <div className="container mx-auto flex justify-between items-center py-4 px-6">
//         <Link to="/" className="text-white text-2xl font-bold tracking-wide hover:text-white transition">
//           InvoiceGen
//         </Link>
//         <div className="flex items-center space-x-4">
//           {!isAuthenticated ? (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-white text-[#006fff] border border-[#006fff] hover:bg-[#006fff] hover:text-white px-5 py-2 rounded-full font-medium transition duration-200"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signUp"
//                 className="bg-[#006fff] text-white border border-white hover:bg-white hover:text-[#006fff] px-5 py-2 rounded-full font-medium transition duration-200"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-white text-[#006fff] border border-[#006fff] hover:bg-red-500 hover:text-white px-5 py-2 rounded-full font-medium transition duration-200"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const isAuthenticated = localStorage.getItem('token'); // Check if user is authenticated

//   const handleLogout = () => {
//     localStorage.removeItem('token'); // Remove token from localStorage on logout
//     navigate('/login'); // Redirect to login page after logging out
//   };

//   return (
//     <nav className="bg-[#00668c] shadow-md">
//       <div className="container mx-auto flex justify-between items-center p-4">
//         <h1 className="text-[#fffefb] text-2xl font-bold">InvoiceGen</h1>
//         <ul className="flex space-x-6"></ul>
//         <div className="flex space-x-4">
//           {/* Conditionally render Login/Signup or Logout button */}
//           {!isAuthenticated ? (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-[#d4eaf7] text-[#00668c] hover:bg-[#71c4ef] hover:text-[#fffefb] px-4 py-2 rounded transition duration-300"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signUp"
//                 className="bg-[#71c4ef] text-[#fffefb] hover:bg-[#00668c] px-4 py-2 rounded transition duration-300"
//               >
//                 Sign Up
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-[#ff4d4d] text-[#fffefb] hover:bg-[#ff1f1f] px-4 py-2 rounded transition duration-300"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Navbar = () => {
//     return (
//         <nav className="bg-[#00668c] shadow-md">
//             <div className="container mx-auto flex justify-between items-center p-4">
//                 <h1 className="text-[#fffefb] text-2xl font-bold">InvoiceGen</h1>
//                 <ul className="flex space-x-6"></ul>
//                 <div className="flex space-x-4">
//                     <Link
//                         to="/login"
//                         className="bg-[#d4eaf7] text-[#00668c] hover:bg-[#71c4ef] hover:text-[#fffefb] px-4 py-2 rounded transition duration-300"
//                     >
//                         Login
//                     </Link>
//                     <Link
//                         to="/signup"
//                         className="bg-[#71c4ef] text-[#fffefb] hover:bg-[#00668c] px-4 py-2 rounded transition duration-300"
//                     >
//                         Sign Up
//                     </Link>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
// import React from 'react';

// const Navbar = () => {
//     return (
//         <nav className="bg-[#00668c] shadow-md">
//             <div className="container mx-auto flex justify-between items-center p-4">
//                 <h1 className="text-[#fffefb] text-2xl font-bold">InvoiceGen</h1>
//                 <ul className="flex space-x-6">
                    
//                 </ul>
//                 <div className="flex space-x-4">
//                     <a href="#login" className="bg-[#d4eaf7] text-[#00668c] hover:bg-[#71c4ef] hover:text-[#fffefb] px-4 py-2 rounded transition duration-300">Login</a>
//                     <a href="#signup" className="bg-[#71c4ef] text-[#fffefb] hover:bg-[#00668c] px-4 py-2 rounded transition duration-300">Sign Up</a>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


// <li>
//                         <a href="#home" className="text-[#fffefb] hover:bg-[#71c4ef] hover:text-[#00668c] px-3 py-2 rounded transition duration-300">Home</a>
//                     </li>
//                     <li>
//                         <a href="#business-details" className="text-[#fffefb] hover:bg-[#71c4ef] hover:text-[#00668c] px-3 py-2 rounded transition duration-300">Business Details</a>
//                     </li>
//                     <li>
//                         <a href="#generate-invoice" className="text-[#fffefb] hover:bg-[#71c4ef] hover:text-[#00668c] px-3 py-2 rounded transition duration-300">Generate Invoice</a>
//                     </li>
//                     <li>
//                         <a href="#invoices" className="text-[#fffefb] hover:bg-[#71c4ef] hover:text-[#00668c] px-3 py-2 rounded transition duration-300">My Invoices</a>
//                     </li>
//                     <li>
//                         <a href="#dashboard" className="text-[#fffefb] hover:bg-[#71c4ef] hover:text-[#00668c] px-3 py-2 rounded transition duration-300">Dashboard</a>
//                     </li>
//                     <li>
//                         <a href="#contact" className="text-[#fffefb] hover:bg-[#71c4ef] hover:text-[#00668c] px-3 py-2 rounded transition duration-300">Contact Us</a>
//                     </li>