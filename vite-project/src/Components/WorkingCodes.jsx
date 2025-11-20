// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BillHistory = () => {
//   const [filterType, setFilterType] = useState('Name');
//   const [filterValue, setFilterValue] = useState('');
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchSales = async (e) => {
//     e.preventDefault();
//     if (!filterValue.trim()) {
//       setError('Please enter a search value');
//       return;
//     }

//     try {
//       setError('');
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const { data } = await axios.get('/api/invoice/search', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { filterType, filterValue }
//       });

//       setSalesData(data.sales || []);
//       if (data.sales?.length === 0) {
//         setError('No matching records found');
//       }
//     } catch (err) {
//       setError('Failed to fetch data. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-8">Bill History</h1>

//       {/* Search Section */}
//       <form onSubmit={fetchSales} className="flex flex-col md:flex-row items-center gap-4 mb-8">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="Name">Name</option>
//           <option value="Date">Date</option>
//           <option value="Mobile">Mobile Number</option>
//         </select>

//         <input
//           type={filterType === 'Date' ? 'date' : 'text'}
//           placeholder={
//             filterType === 'Name' ? 'Enter customer name...' :
//             filterType === 'Mobile' ? 'Enter mobile number...' :
//             'Select date'
//           }
//           value={filterValue}
//           onChange={(e) => setFilterValue(e.target.value)}
//           className="p-3 rounded-xl border border-gray-300 shadow-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {/* Error Messages */}
//       {error && <p className="mb-4 text-red-600">{error}</p>}

//       {/* Results Section */}
//       <div className="bg-white rounded-2xl shadow-md p-6">
//         {salesData.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-200 text-gray-700">
//                   <th className="py-3 px-6 text-left">Invoice #</th>
//                   <th className="py-3 px-6 text-left">Client</th>
//                   <th className="py-3 px-6 text-left">Mobile</th>
//                   <th className="py-3 px-6 text-left">Amount</th>
//                   <th className="py-3 px-6 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {salesData.map((sale) => (
//                   <tr key={sale._id} className="border-b hover:bg-gray-50">
//                     <td className="py-3 px-6">{sale.invoiceNumber}</td>
//                     <td className="py-3 px-6">{sale.clientName}</td>
//                     <td className="py-3 px-6">{sale.clientMobile}</td>
//                     <td className="py-3 px-6">₹{sale.totalAmount.toFixed(2)}</td>
//                     <td className="py-3 px-6">
//                       {new Date(sale.date).toLocaleDateString('en-IN', {
//                         day: '2-digit',
//                         month: 'short',
//                         year: 'numeric'
//                       })}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           !loading && <p className="text-gray-500">No records to display</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BillHistory;













///server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/businessApp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Mongoose Schemas
// const BusinessSchema = new mongoose.Schema({
//   businessName: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   address: { type: String },
//   gstNo: { type: String },
//   logo: { type: String },
// }, { timestamps: true });

// const Business = mongoose.model('Business', BusinessSchema);

// // Invoice Schema
// const InvoiceSchema = new mongoose.Schema({
//   customerName: { type: String, required: true },
//   customerMobile: { type: String, required: true },
//   items: [{
//     description: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true }
//   }],
//   totalAmount: { type: Number, required: true },
//   date: { type: String, required: true },
//   businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
// }, { timestamps: true });

// const Invoice = mongoose.model('Invoice', InvoiceSchema);

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // JWT secret
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// // Authentication Middleware
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(403).json({ error: 'Authorization required' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// // Signup Route
// app.post('/api/auth/signup', upload.single('logo'), async (req, res) => {
//   try {
//     const { businessName, phone, email, password, confirmPassword, address, gstNo } = req.body;

//     if (!businessName || !phone || !email || !password || !confirmPassword) {
//       return res.status(400).json({ error: 'Please fill all required fields.' });
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match.' });
//     }

//     const existingBusiness = await Business.findOne({ email });
//     if (existingBusiness) {
//       return res.status(400).json({ error: 'Business already registered with this email.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const business = new Business({
//       businessName,
//       phone,
//       email,
//       password: hashedPassword,
//       address,
//       gstNo,
//       logo: req.file ? `/uploads/${req.file.filename}` : null,
//     });

//     await business.save();
//     res.status(201).json({ message: 'Business registered successfully.' });
//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ error: 'Server error during signup.' });
//   }
// });

// // Login Route
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required' });
//     }

//     const business = await Business.findOne({ email });
//     if (!business) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, business.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: business._id }, JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

// // Business Profile Route
// app.get('/api/auth/profile', authenticateJWT, async (req, res) => {
//   try {
//     const business = await Business.findById(req.user.userId);
//     if (!business) return res.status(404).json({ error: 'Business not found' });
//     res.json(business);
//   } catch (err) {
//     console.error('Profile error:', err);
//     res.status(500).json({ error: 'Server error during fetching profile' });
//   }
// });

// // Save Invoice Route
// app.post('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const { customerName, customerMobile, items, totalAmount, date } = req.body;

//     if (!customerName || !customerMobile || !items.length || totalAmount === undefined || !date) {
//       return res.status(400).json({ error: 'Missing required invoice fields.' });
//     }

//     const newInvoice = new Invoice({
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date,
//       businessId: req.user.userId,
//     });

//     await newInvoice.save();
//     res.status(201).json({ message: 'Invoice saved successfully.' });
//   } catch (err) {
//     console.error('Save invoice error:', err);
//     res.status(500).json({ error: 'Server error while saving invoice.' });
//   }
// });

// // Get Invoices Route
// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(invoices);
//   } catch (err) {
//     console.error('Fetch invoices error:', err);
//     res.status(500).json({ error: 'Server error while fetching invoices.' });
//   }
// });

// // Server Start
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));














///login.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ setIsAuthenticated }) => {
//   // Change to email/password instead of username
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
//       // Update endpoint to match backend
//       const response = await fetch('http://localhost:5000/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || 'Login failed');
//       }

//       localStorage.setItem('token', data.token);
//       setIsAuthenticated(true);
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.message || 'Server error, please try again later.');
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










// import React from 'react';
// import { FaFileInvoice, FaHistory, FaCog, FaUserEdit, FaPhoneAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

// const Dashboard = () => {
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold text-center text-[#00668c] mb-8">Dashboard</h1>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Generate Invoice Card */}
//         <Link
//           to="/generate-invoice"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaFileInvoice className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Generate Invoice</p>
//         </Link>

//         {/* Bill History Card */}
//         <Link
//           to="/bill-history"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaHistory className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Bills History</p>
//         </Link>

//         {/* Settings Card */}
//         <Link
//           to="/settings"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaCog className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Settings</p>
//         </Link>

//         {/* Edit Business Profile Card */}
//         <Link
//           to="/edit-business-profile"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaUserEdit className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Edit Profile</p>
//         </Link>

//         {/* Contact Customer Care Card */}
//         <Link
//           to="/contact-customer-care"
//           className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out text-center"
//         >
//           <FaPhoneAlt className="text-4xl text-[#00668c] mb-4" />
//           <p className="font-semibold text-lg text-[#333]">Contact Customer Care</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


////fine working
// import React, { useEffect, useState } from 'react';

// const GenerateBills = () => {
//   const [businessDetails, setBusinessDetails] = useState({});
//   const [customerName, setCustomerName] = useState('');
//   const [customerMobile, setCustomerMobile] = useState('');
//   const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const fetchBusinessDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok) setBusinessDetails(data);
//         else console.error('Failed to fetch business details');
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchBusinessDetails();
//   }, []);

//   const handleItemChange = (index, event) => {
//     const { name, value } = event.target;
//     const newItems = [...items];
//     newItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, { description: '', quantity: 1, price: 0 }]);
//   };

//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//     calculateTotal(newItems);
//   };

//   const calculateTotal = (items) => {
//     const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotalAmount(total);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const billData = {
//       businessDetails,
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: new Date().toLocaleString(),
//     };

//     console.log('Bill generated:', billData);

//     // Open printable invoice
//     const invoiceWindow = window.open('', 'PRINT', 'height=800,width=600');
//     invoiceWindow.document.write(`
//       <html>
//         <head>
//           <title>Invoice</title>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h1, h2, h3 { color: #00668c; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             table, th, td { border: 1px solid black; }
//             th, td { padding: 10px; text-align: left; }
//             .total { text-align: right; font-weight: bold; }
//             .logo { max-width: 150px; max-height: 150px; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           ${billData.businessDetails.logo ? `
//             <img src="http://localhost:5000${billData.businessDetails.logo}" alt="Business Logo" class="logo"/>
//           ` : ''}
//           <h1>${billData.businessDetails.businessName || ''}</h1>
//           <p>${billData.businessDetails.address || ''}</p>
//           <p>Phone: ${billData.businessDetails.phone || ''}</p>
//           <p>Email: ${billData.businessDetails.email || ''}</p>
//           <p>GST No: ${billData.businessDetails.gstNo || ''}</p>
//           <hr/>
//           <h2>Invoice</h2>
//           <p><strong>Date:</strong> ${billData.date}</p>
//           <p><strong>Customer Name:</strong> ${billData.customerName}</p>
//           <p><strong>Customer Mobile:</strong> ${billData.customerMobile}</p>

//           <table>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Description</th>
//                 <th>Quantity</th>
//                 <th>Price (₹)</th>
//                 <th>Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${billData.items.map((item, index) => `
//                 <tr>
//                   <td>${index + 1}</td>
//                   <td>${item.description}</td>
//                   <td>${item.quantity}</td>
//                   <td>${item.price.toFixed(2)}</td>
//                   <td>${(item.price * item.quantity).toFixed(2)}</td>
//                 </tr>
//               `).join('')}
//             </tbody>
//           </table>

//           <h3 class="total">Grand Total: ₹${billData.totalAmount.toFixed(2)}</h3>

//           <script>
//             window.onload = function() {
//               window.print();
//               window.onafterprint = function() {
//                 window.close();
//               }
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     invoiceWindow.document.close();
//     invoiceWindow.focus();

//     // Save to database
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       const response = await fetch('http://localhost:5000/api/invoices', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           customerName: billData.customerName,
//           customerMobile: billData.customerMobile,
//           items: billData.items,
//           totalAmount: billData.totalAmount,
//           date: billData.date,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         console.log('Invoice saved to database:', result.message);
//         setSuccessMessage('Successfully saved to database');
//         setTimeout(() => setSuccessMessage(''), 3000);
//       } else {
//         console.error('Failed to save invoice:', result.error);
//         setSuccessMessage('');
//       }
//     } catch (err) {
//       console.error('Error saving invoice:', err);
//       setSuccessMessage('');
//     }

//     // Reset form
//     setCustomerName('');
//     setCustomerMobile('');
//     setItems([{ description: '', quantity: 1, price: 0 }]);
//     setTotalAmount(0);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Business Details */}
//       <div className="flex items-center mb-8 space-x-6 bg-white p-6 rounded-lg shadow-md">
//         {businessDetails.logo && (
//           <img
//             src={`http://localhost:5000${businessDetails.logo}`}
//             alt="Business Logo"
//             className="w-24 h-24 object-contain rounded"
//           />
//         )}
//         <div>
//           <h1 className="text-3xl font-bold text-[#00668c]">{businessDetails.businessName}</h1>
//           <p className="text-gray-700">{businessDetails.address}</p>
//           <p className="text-gray-700">Phone: {businessDetails.phone}</p>
//           <p className="text-gray-700">Email: {businessDetails.email}</p>
//           <p className="text-gray-700">GST No: {businessDetails.gstNo}</p>
//         </div>
//       </div>

//       {/* Form */}
//       <h2 className="text-3xl font-bold text-center text-[#00668c] mb-8">Generate Bill</h2>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//         {/* Customer Info */}
//         <div className="mb-4">
//           <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
//           <input
//             type="text"
//             id="customerName"
//             value={customerName}
//             onChange={(e) => setCustomerName(e.target.value)}
//             placeholder="Enter customer name"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="customerMobile" className="block text-sm font-bold text-gray-700 mb-2">Customer Mobile Number</label>
//           <input
//             type="tel"
//             id="customerMobile"
//             value={customerMobile}
//             onChange={(e) => setCustomerMobile(e.target.value)}
//             placeholder="Enter customer mobile number"
//             pattern="^\+?[0-9\s\-]{7,15}$"
//             title="Enter a valid phone number"
//             className="border rounded w-full py-2 px-3 shadow text-gray-700"
//             required
//           />
//         </div>

//         {/* Items */}
//         <h3 className="text-xl font-bold mb-4">Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="flex mb-4">
//             <input
//               type="text"
//               name="description"
//               value={item.description}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Item Description"
//               className="border rounded w-1/2 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="quantity"
//               value={item.quantity}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Quantity"
//               min="1"
//               className="border rounded w-1/4 py-2 px-3 mr-2 text-gray-700 shadow"
//               required
//             />
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(index, e)}
//               placeholder="Price"
//               min="0"
//               step="0.01"
//               className="border rounded w-1/4 py-2 px-3 text-gray-700 shadow"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => removeItem(index)}
//               className="ml-2 bg-red-500 text-white px-4 rounded"
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* Add Item */}
//         <button
//           type="button"
//           onClick={addItem}
//           className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
//         >
//           Add Item
//         </button>

//         {/* Total */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold">Total Amount: ₹{totalAmount.toFixed(2)}</h3>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="bg-green-500 text-white rounded px-6 py-2 hover:bg-green-600"
//         >
//           Generate Bill
//         </button>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="text-green-600 font-semibold mt-4">
//             {successMessage}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// };

// export default GenerateBills;






