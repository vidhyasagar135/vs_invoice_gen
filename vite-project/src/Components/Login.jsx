import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
  // Change to email/password instead of username
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Update endpoint to match backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Server error, please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#00668c] hover:bg-[#004a66] text-white font-bold py-2 px-4 rounded w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setIsAuthenticated }) => {
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:5000/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         setIsAuthenticated(true);
//         navigate('/dashboard');
//       } else {
//         setError(data.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error('Error during login request:', err);
//       setError('Server error, please try again later.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//         <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
//         <form onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <div className="mb-4">
//             <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
//               Username
//             </label>
//             <input
//               type="text"
//               id="username"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Enter your username"
//               className="shadow border rounded w-full py-2 px-3 text-gray-700"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="shadow border rounded w-full py-2 px-3 text-gray-700"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-[#00668c] hover:bg-[#004a66] text-white font-bold py-2 px-4 rounded w-full"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setIsAuthenticated }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');  // Clear previous error messages

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         setIsAuthenticated(true);
//         navigate('/dashboard');
//       } else {
//         setError(data.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error('Error during login request:', err);
//       setError('Server error, please try again later.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//         <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
//         <form onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="shadow border rounded w-full py-2 px-3 text-gray-700"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="shadow border rounded w-full py-2 px-3 text-gray-700"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-[#00668c] hover:bg-[#004a66] text-white font-bold py-2 px-4 rounded w-full"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setIsAuthenticated }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         setIsAuthenticated(true);
//         navigate('/dashboard');
//       } else {
//         setError(data.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Server error, please try again later.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//         <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
//         <form onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="shadow border rounded w-full py-2 px-3 text-gray-700"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="shadow border rounded w-full py-2 px-3 text-gray-700"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-[#00668c] hover:bg-[#004a66] text-white font-bold py-2 px-4 rounded w-full"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// const Login = ({ setIsAuthenticated }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         setIsAuthenticated(true);
//         navigate('/dashboard');
//       } else {
//         setError(data.error || 'Login failed');
//       }
//     } catch (err) {
//       setError('Server error, please try again later.');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//         <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
//         <form onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//               required
//             />
//           </div>
//           <div className="flex items-center justify-between mb-4">
//             <a href="#forgot-password" className="text-sm text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//               Forgot Password?
//             </a>
//           </div>
//           <button
//             type="submit"
//             className="bg-[#00668c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#71c4ef] transition duration-300 w-full"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/signUp" className="text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   // Handle form data change
//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage('Successfully logged in!');
//         localStorage.setItem('token', data.token); // Save the JWT token in localStorage
//         navigate('/dashboard'); // Redirect to dashboard or another page
//       } else {
//         setError(data.error || 'Login failed');
//       }
//     } catch (err) {
//       setError('Server error, please try again later.');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//         <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
//         <form onSubmit={handleSubmit}>
//           {successMessage && (
//             <p className="text-green-500 mb-4">{successMessage}</p> // Display success message
//           )}
//           {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//               required
//             />
//           </div>
//           <div className="flex items-center justify-between mb-4">
//             <a href="#forgot-password" className="text-sm text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//               Forgot Password?
//             </a>
//           </div>
//           <button
//             type="submit"
//             className="bg-[#00668c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#71c4ef] transition duration-300 w-full"
//           >
//             Login
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link to="/SignUp" className="text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// ////final working
// import React from 'react';
// import { Link } from 'react-router-dom';

// const Login = () => {
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//             <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//                 <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
//                 <form>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             id="email"
//                             placeholder="Enter your email"
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             placeholder="Enter your password"
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//                         />
//                     </div>
//                     <div className="flex items-center justify-between mb-4">
//                         <a href="#forgot-password" className="text-sm text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//                             Forgot Password?
//                         </a>
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-[#00668c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#71c4ef] transition duration-300 w-full"
//                     >
//                         Login
//                     </button>
//                 </form>
//                 <div className="mt-4 text-center">
//                     <p className="text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <Link to="/SignUp" className="text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//                             Sign Up
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;
// import React from 'react';

// const Login = () => {
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//             <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//                 <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Login</h2>
//                 <form>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             id="email"
//                             placeholder="Enter your email"
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             placeholder="Enter your password"
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//                         />
//                     </div>
//                     <div className="flex items-center justify-between mb-4">
//                         <a href="#forgot-password" className="text-sm text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//                             Forgot Password?
//                         </a>
//                     </div>
//                     <button
//                         type="submit"
//                         className="bg-[#00668c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#71c4ef] transition duration-300 w-full"
//                     >
//                         Login
//                     </button>
//                 </form>
//                 <div className="mt-4 text-center">
//                     <p className="text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <a href="#signup" className="text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//                             Sign Up
//                         </a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;