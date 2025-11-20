// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';

// const SignUp = ({ setIsAuthenticated }) => {
//   const [formData, setFormData] = useState({
//     businessName: '',
//     phone: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     address: '',
//     gstNo: '',
//   });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Optionally, auto-login user here or redirect to login page
//         navigate('/login');
//       } else {
//         setError(data.error || 'Signup failed');
//       }
//     } catch (err) {
//       setError('Server error, please try again later.');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
//         <h2 className="text-2xl font-bold text-center text-[#00668c] mb-6">Sign Up</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           {/* Add inputs for businessName, phone, email, password, confirmPassword, address, gstNo */}
//           {/* Example for businessName */}
//           <div className="mb-4">
//             <label htmlFor="businessName" className="block text-gray-700 text-sm font-bold mb-2">
//               Business Name
//             </label>
//             <input
//               type="text"
//               id="businessName"
//               value={formData.businessName}
//               onChange={handleChange}
//               placeholder="Enter your business name"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
//               required
//             />
//           </div>
//           {/* Repeat for other fields similarly */}
//           {/* ... */}
//           <button
//             type="submit"
//             className="bg-[#00668c] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#71c4ef] transition duration-300 w-full"
//           >
//             Sign Up
//           </button>
//         </form>
//         <div className="mt-4 text-center">
//           <p className="text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-[#00668c] hover:text-[#71c4ef] transition duration-300">
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
///export default SignUp;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated for React Router v6

const SignUp = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    gstNo: '',
    logo: null,
  });

  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState(''); // For message color
  const navigate = useNavigate(); // useNavigate for React Router v6

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageColor('text-red-600'); // Red color for error
      return;
    }

    const submitData = new FormData();
    for (const key in formData) {
      submitData.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', res); // Log response for debugging
      setMessage(res.data.message || 'Signup successful!');
      setMessageColor('text-green-600'); // Green color for success

      // After a short delay, redirect to the login page
      setTimeout(() => {
        navigate('/login'); // Use navigate for redirect
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Signup error:', error); // Log error for debugging
      setMessage(error.response?.data?.error || 'Signup failed!');
      setMessageColor('text-red-600'); // Red color for error
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#fffefb] shadow-md rounded-md p-8 mt-10">
      <h2 className="text-2xl font-bold text-[#00668c] mb-6">Create Your Account</h2>
      {message && (
        <p className={`mb-4 text-center text-lg ${messageColor} font-bold`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <label className="block text-[#313d44] font-medium mb-1">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
          />
        </div>

        <div>
          <label className="block text-[#313d44] font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
          />
        </div>

        <div>
          <label className="block text-[#313d44] font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
          />
        </div>

        <div>
          <label className="block text-[#313d44] font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
          />
        </div>

        <div>
          <label className="block text-[#313d44] font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
          />
        </div>

        <div>
          <label className="block text-[#313d44] font-medium mb-1">Address of Business</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
          ></textarea>
        </div>

        <div>
          <label className="block text-[#313d44] font-medium mb-1">GST Number</label>
          <input
            type="text"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
          />
        </div>

        <div>
          <label className="block text-[#313d44] font-medium mb-1">Logo Upload</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-[#313d44] border border-[#cccbc8] rounded py-2 px-3 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#71c4ef] file:text-[#fffefb] hover:file:bg-[#00668c]"
          />
        </div>

        <button
          type="submit"
          className="bg-[#71c4ef] hover:bg-[#00668c] text-[#fffefb] px-6 py-2 rounded transition duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;

// import React, { useState } from 'react';
// import axios from 'axios';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     businessName: '',
//     phone: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     address: '',
//     gstNo: '',
//     logo: null,
//   });

//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       setMessage('Passwords do not match');
//       return;
//     }

//     const submitData = new FormData();
//     for (const key in formData) {
//       submitData.append(key, formData[key]);
//     }

//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/signup', submitData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setMessage(res.data.message || 'Signup successful!');
//     } catch (error) {
//       console.error('Signup error:', error);
//       setMessage(error.response?.data?.error || 'Signup failed!');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-[#fffefb] shadow-md rounded-md p-8 mt-10">
//       <h2 className="text-2xl font-bold text-[#00668c] mb-6">Create Your Account</h2>
//       {message && <p className="mb-4 text-center text-sm text-red-600">{message}</p>}
//       <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Business Name</label>
//           <input
//             type="text"
//             name="businessName"
//             value={formData.businessName}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Phone</label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Confirm Password</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Address of Business</label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">GST Number</label>
//           <input
//             type="text"
//             name="gstNo"
//             value={formData.gstNo}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Logo Upload</label>
//           <input
//             type="file"
//             name="logo"
//             accept="image/*"
//             onChange={handleChange}
//             className="block w-full text-[#313d44] border border-[#cccbc8] rounded py-2 px-3 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#71c4ef] file:text-[#fffefb] hover:file:bg-[#00668c]"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-[#71c4ef] hover:bg-[#00668c] text-[#fffefb] px-6 py-2 rounded transition duration-300"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;
// import React, { useState } from 'react';
// import axios from 'axios';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     businessName: '',
//     phone: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     address: '',
//     gstNo: '',
//     logo: null,
//   });

//   const [message, setMessage] = useState('');

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const submitData = new FormData();
//       for (const key in formData) {
//         submitData.append(key, formData[key]);
//       }

//       const res = await axios.post('http://localhost:5000/api/auth/signup', submitData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setMessage(res.data.message || 'Signup successful!');
//     } catch (error) {
//       console.error('Signup error:', error);
//       setMessage(error.response?.data?.error || 'Signup failed!');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-[#fffefb] shadow-md rounded-md p-8 mt-10">
//       <h2 className="text-2xl font-bold text-[#00668c] mb-6">Create Your Account</h2>
//       {message && <p className="mb-4 text-center text-sm text-red-600">{message}</p>}
//       <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Business Name</label>
//           <input
//             type="text"
//             name="businessName"
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Phone</label>
//           <input
//             type="tel"
//             name="phone"
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Password</label>
//           <input
//             type="password"
//             name="password"
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Confirm Password</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Address of Business</label>
//           <textarea
//             name="address"
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">GST Number</label>
//           <input
//             type="text"
//             name="gstNo"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Logo Upload</label>
//           <input
//             type="file"
//             name="logo"
//             accept="image/*"
//             onChange={handleChange}
//             className="block w-full text-[#313d44] border border-[#cccbc8] rounded py-2 px-3 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#71c4ef] file:text-[#fffefb] hover:file:bg-[#00668c]"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-[#71c4ef] hover:bg-[#00668c] text-[#fffefb] px-6 py-2 rounded transition duration-300"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;

// import React, { useState } from 'react';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     businessName: '',
//     phone: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     address: '',
//     gstNo: '',
//     logo: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log(formData); // handle form submission
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-[#fffefb] shadow-md rounded-md p-8 mt-10">
//       <h2 className="text-2xl font-bold text-[#00668c] mb-6">Create Your Account</h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Business Name</label>
//           <input
//             type="text"
//             name="businessName"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Phone</label>
//           <input
//             type="tel"
//             name="phone"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Password</label>
//           <input
//             type="password"
//             name="password"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Confirm Password</label>
//           <input
//             type="password"
//             name="confirmPassword"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Address of Business</label>
//           <textarea
//             name="address"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           ></textarea>
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">GST Number</label>
//           <input
//             type="text"
//             name="gstNo"
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-[#cccbc8] rounded focus:outline-none focus:ring-2 focus:ring-[#71c4ef]"
//           />
//         </div>

//         <div>
//           <label className="block text-[#313d44] font-medium mb-1">Logo Upload</label>
//           <input
//             type="file"
//             name="logo"
//             accept="image/*"
//             onChange={handleChange}
//             className="block w-full text-[#313d44] border border-[#cccbc8] rounded py-2 px-3 file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-[#71c4ef] file:text-[#fffefb] hover:file:bg-[#00668c]"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-[#71c4ef] hover:bg-[#00668c] text-[#fffefb] px-6 py-2 rounded transition duration-300"
//         >
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;
