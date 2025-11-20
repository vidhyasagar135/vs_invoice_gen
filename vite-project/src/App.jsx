import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import LandingPage from './Components/LandingPage';
import GenerateBills from './Components/GenerateBills';
import BillHistory from './Components/BillHistory';
import Footer from './Components/Footer';
import EditProfile from './Components/EditProfile';
import Features from './Components/Features'; // Add this import
import Pricing from './Components/Pricing';
import CustomerCare from './Components/CustomerCare';
import Settings from './Components/Settings';
//import Sales from './Components/Sales';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <LandingPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/features"
              element={
                <>
                  <Features />
                  
                </>
              }
            />
             <Route
              path="/pricing"
              element={
                <>
                  <Pricing />
                  
                </>
              }
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/signUp"
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/generate-invoice"
              element={isAuthenticated ? <GenerateBills /> : <Navigate to="/login" />}
            />
            <Route
              path="/bill-history"
              element={isAuthenticated ? <BillHistory /> : <Navigate to="/login" />}
            />
            <Route
              path="/edit-profile"
              element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />}
            />
            <Route
            path="/CustomerCare"
            element={isAuthenticated ? <CustomerCare /> : <Navigate to="/login" />}
          />
          <Route
            path="/Settings"
            element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
          />
          {/* <Route
            path="/Sales"
            element={isAuthenticated ? <Sales /> : <Navigate to="/login" />}
          /> */}

            <Route path="*" element={<div className="p-8 text-center text-xl">Page Not Found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';
// import GenerateBills from './Components/GenerateBills';
// import BillHistory from './Components/BillHistory';
// import Footer from './Components/Footer';
// import EditProfile from './Components/EditProfile';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         {/* Navbar at the top */}
//         <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

//         {/* Main content */}
//         <div className="flex-grow">
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <>
//                   <LandingPage />
//                   <Footer /> {/* Footer only for Landing Page */}
//                 </>
//               }
//             />
//             <Route
//               path="/login"
//               element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
//             />
//             <Route
//               path="/signUp"
//               element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
//             />
//             <Route
//               path="/dashboard"
//               element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/generate-invoice"
//               element={isAuthenticated ? <GenerateBills /> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/bill-history"
//               element={isAuthenticated ? <BillHistory /> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/edit-profile"
//               element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />}
//             />

//             <Route path="*" element={<div className="p-8 text-center text-xl">Page Not Found</div>} />
//           </Routes>
//         </div>

//         {/* No global Footer here anymore */}
//       </div>
//     </Router>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';
// import GenerateBills from './Components/GenerateBills';
// import BillHistory from './Components/BillHistory';
// import Footer from './Components/Footer';
// import EditProfile from './Components/EditProfile';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         {/* Navbar at the top */}
//         <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

//         {/* Main content */}
//         <div className="flex-grow">
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <>
//                   <LandingPage />
//                   <Footer /> {/* Footer only for Landing Page */}
//                 </>
//               }
//             />
//             <Route
//               path="/login"
//               element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
//             />
//             <Route
//               path="/signUp"
//               element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
//             />
//             <Route
//               path="/dashboard"
//               element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/generate-invoice"
//               element={isAuthenticated ? <GenerateBills /> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/bill-history"
//               element={isAuthenticated ? <BillHistory /> : <Navigate to="/login" />}
//             />
//             <Route
//               path="/Edit Profile"
//               element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" />}
//             />

//             <Route path="*" element={<div className="p-8 text-center text-xl">Page Not Found</div>} />
//           </Routes>
//         </div>

//         {/* No global Footer here anymore */}
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';
// import GenerateBills from './Components/GenerateBills';
// import BillHistory from './Components/BillHistory'; // Correct import
// import Footer from './Components/Footer';
// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

//       <Routes>
//         <Route path="/" element={<LandingPage />} />

//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/signUp"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/dashboard"
//           element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//         />

//         {/* New route for GenerateBills page */}
//         <Route
//           path="/generate-invoice"
//           element={isAuthenticated ? <GenerateBills /> : <Navigate to="/login" />}
//         />

//         {/* ✅ New route for BillHistory page */}
//         <Route
//           path="/bill-history"
//           element={isAuthenticated ? <BillHistory /> : <Navigate to="/login" />}
//         />

//         {/* 404 Route */}
//         <Route path="*" element={<div className="p-8 text-center text-xl">Page Not Found</div>} />
//       </Routes>
      
//     </Router>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';
// import GenerateBills from './Components/GenerateBills'; // Import new component// Import BillHistory component
// import BillHistory from './Components/BillHistory';
// function App() {
//   // Track authentication state
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   // Sync auth state across tabs/windows
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

//       <Routes>
//         <Route path="/" element={<LandingPage />} />

//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/signUp"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/dashboard"
//           element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//         />

//         {/* New route for GenerateBills page */}
//         <Route
//           path="/generate-invoice"
//           element={isAuthenticated ? <GenerateBills /> : <Navigate to="/login" />}
//         />

//         {/* New route for Bill History page */}
        

//         <Route path="*" element={<div className="p-8 text-center text-xl">Page Not Found</div>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

////fine working 

// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';
// import GenerateBills from './Components/GenerateBills'; // Import new component

// function App() {
//   // Track authentication state
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   // Sync auth state across tabs/windows
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

//       <Routes>
//         <Route path="/" element={<LandingPage />} />

//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/signUp"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/dashboard"
//           element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//         />

//         {/* New route for GenerateBills page */}
//         <Route
//           path="/generate-invoice"
//           element={isAuthenticated ? <GenerateBills /> : <Navigate to="/login" />}
//         />

//         {/* Add other protected routes here if needed */}

//         <Route path="*" element={<div className="p-8 text-center text-xl">Page Not Found</div>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';

// function App() {
//   // Track authentication state
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   // Sync auth state across tabs/windows
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

//       <Routes>
//         <Route path="/" element={<LandingPage />} />

//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/signUp"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/dashboard"
//           element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//         />

//         {/* Add other protected routes here if needed */}

//         <Route path="*" element={<div className="p-8 text-center text-xl">Page Not Found</div>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';

// function App() {
//   // State to track authentication status
//   const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

//   // Optional: listen to storage events to sync auth across tabs
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem('token'));
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   return (
//     <Router>
//       {/* Pass isAuthenticated and setter to Navbar so it can update on logout */}
//       <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

//       <Routes>
//         <Route path="/" element={<LandingPage />} />

//         <Route
//           path="/login"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/signUp"
//           element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp setIsAuthenticated={setIsAuthenticated} />}
//         />

//         <Route
//           path="/dashboard"
//           element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
//         />

//         <Route path="*" element={<div>Page Not Found</div>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './index.css';
// import Navbar from './Components/Navbar';
// import Login from './Components/Login';
//  // Assuming you have a Home component
// import SignUp from './Components/SignUp';
// import Dashboard from './Components/Dashboard';
// import LandingPage from './Components/LandingPage';
// function App() {
//   return (
//     <Router>
//       <Navbar />
      
//       <Routes>
//          {/* Home component for the main page */}
//         <Route path="/login" element={<Login />} /> {/* Login component for the login page */}
//         <Route path="/SignUp" element={<SignUp />} /> 

//       </Routes>
//       <Dashboard />
//     </Router>
//   );
// }

// export default App;
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './index.css'
// import Navbar from './Components/Navbar'
// import Login from './Components/Login'
// import LandingPage from './Components/LandingPage';
// function App() {
 
//   return (
//     <>
//       <Navbar />
//       <Login/>
//       <LandingPage />
//     </>
//   )
// }

// export default App
