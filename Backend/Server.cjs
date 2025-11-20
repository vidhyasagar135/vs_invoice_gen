
//nice working
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/businessApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const BusinessSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  gstNo: { type: String },
  logo: { type: String },
}, { timestamps: true });

const Business = mongoose.model('Business', BusinessSchema);

const InvoiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  date: { type: String, required: true },  // Format: "dd/mm/yyyy, hh:mm:ss AM/PM"
  invoiceNumber: { type: String },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', InvoiceSchema);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// JWT Auth middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Authorization required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ========== AUTH ROUTES ==========

// Signup
app.post('/api/auth/signup', upload.single('logo'), async (req, res) => {
  try {
    const { businessName, phone, email, password, confirmPassword, address, gstNo } = req.body;

    if (!businessName || !phone || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const existingBusiness = await Business.findOne({ email });
    if (existingBusiness) {
      return res.status(400).json({ error: 'Business already registered with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const business = new Business({
      businessName,
      phone,
      email,
      password: hashedPassword,
      address,
      gstNo,
      logo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await business.save();
    res.status(201).json({ message: 'Business registered successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const business = await Business.findOne({ email });
    if (!business) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: business._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get profile
app.get('/api/auth/profile', authenticateJWT, async (req, res) => {
  try {
    const business = await Business.findById(req.user.userId);
    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json(business);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Server error during fetching profile' });
  }
});

// Update profile
app.put('/api/auth/profile', authenticateJWT, upload.single('logo'), async (req, res) => {
  try {
    const { businessName, phone, address, gstNo } = req.body;
    const updateData = { businessName, phone, address, gstNo };

    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }

    const business = await Business.findByIdAndUpdate(
      req.user.userId,
      { $set: updateData },
      { new: true }
    );

    if (!business) return res.status(404).json({ error: 'Business not found' });
    res.json({ message: 'Profile updated successfully', business });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error during profile update.' });
  }
});

// Change password
app.put('/api/auth/change-password', authenticateJWT, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const business = await Business.findById(req.user.userId);
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const isMatch = await bcrypt.compare(currentPassword, business.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    business.password = hashedPassword;
    await business.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Server error during password change.' });
  }
});

// Deactivate account
app.delete('/api/auth/deactivate', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.userId;
    await Invoice.deleteMany({ businessId: userId });
    await Business.findByIdAndDelete(userId);
    res.json({ message: 'Account and related invoices deleted successfully.' });
  } catch (err) {
    console.error('Deactivate error:', err);
    res.status(500).json({ error: 'Server error during account deactivation.' });
  }
});

// ========== INVOICE ROUTES ==========

// Create invoice
app.post('/api/invoices', authenticateJWT, async (req, res) => {
  try {
    const { customerName, customerMobile, items, totalAmount, date, invoiceNumber } = req.body;

    if (!customerName || !customerMobile || !items.length || totalAmount === undefined || !date) {
      return res.status(400).json({ error: 'Missing required invoice fields.' });
    }

    const newInvoice = new Invoice({
      customerName,
      customerMobile,
      items,
      totalAmount,
      date,
      invoiceNumber,
      businessId: req.user.userId,
    });

    await newInvoice.save();
    res.status(201).json({ message: 'Invoice saved successfully.' });
  } catch (err) {
    console.error('Save invoice error:', err);
    res.status(500).json({ error: 'Server error while saving invoice.' });
  }
});

// Get all invoices
app.get('/api/invoices', authenticateJWT, async (req, res) => {
  try {
    const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error('Fetch invoices error:', err);
    res.status(500).json({ error: 'Server error while fetching invoices.' });
  }
});

// Search invoices
app.get('/api/invoice/search', authenticateJWT, async (req, res) => {
  try {
    const { filterType, filterValue } = req.query;
    const businessId = req.user.userId;

    let query = { businessId };

    if (filterType === 'Name') {
      query.customerName = { $regex: new RegExp(filterValue, 'i') };
    } else if (filterType === 'Mobile') {
      query.customerMobile = { $regex: new RegExp(filterValue, 'i') };
    } else if (filterType === 'Date') {
      query.date = { $regex: new RegExp(filterValue, 'i') }; // e.g., "2024-04-30"
    }

    const sales = await Invoice.find(query).sort({ createdAt: -1 });
    res.json({ sales });
  } catch (err) {
    console.error('Invoice search error:', err);
    res.status(500).json({ error: 'Server error during invoice search.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Schemas
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
//   invoiceNumber: { type: String },
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

// // JWT middleware
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(403).json({ error: 'Authorization required' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// // ---------------- AUTH ROUTES ----------------
// app.post('/api/auth/signup', upload.single('logo'), async (req, res) => {
//   try {
//     const { businessName, phone, email, password, confirmPassword, address, gstNo } = req.body;
//     if (!businessName || !phone || !email || !password || !confirmPassword)
//       return res.status(400).json({ error: 'Please fill all required fields.' });
//     if (password !== confirmPassword)
//       return res.status(400).json({ error: 'Passwords do not match.' });

//     const existingBusiness = await Business.findOne({ email });
//     if (existingBusiness)
//       return res.status(400).json({ error: 'Business already registered with this email.' });

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

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password)
//       return res.status(400).json({ error: 'Email and password are required' });

//     const business = await Business.findOne({ email });
//     if (!business || !(await bcrypt.compare(password, business.password)))
//       return res.status(401).json({ error: 'Invalid credentials' });

//     const token = jwt.sign({ userId: business._id }, JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

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

// app.put('/api/auth/profile', authenticateJWT, upload.single('logo'), async (req, res) => {
//   try {
//     const { businessName, phone, address, gstNo } = req.body;
//     const updateData = { businessName, phone, address, gstNo };

//     if (req.file) updateData.logo = `/uploads/${req.file.filename}`;

//     const business = await Business.findByIdAndUpdate(
//       req.user.userId,
//       { $set: updateData },
//       { new: true }
//     );

//     if (!business) return res.status(404).json({ error: 'Business not found' });
//     res.json({ message: 'Profile updated successfully', business });
//   } catch (err) {
//     console.error('Update profile error:', err);
//     res.status(500).json({ error: 'Server error during profile update.' });
//   }
// });

// app.put('/api/auth/change-password', authenticateJWT, async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;
//     if (!currentPassword || !newPassword || !confirmPassword)
//       return res.status(400).json({ error: 'All fields are required.' });

//     if (newPassword !== confirmPassword)
//       return res.status(400).json({ error: 'Passwords do not match.' });

//     const business = await Business.findById(req.user.userId);
//     if (!business) return res.status(404).json({ error: 'Business not found' });

//     const isMatch = await bcrypt.compare(currentPassword, business.password);
//     if (!isMatch)
//       return res.status(401).json({ error: 'Current password is incorrect.' });

//     business.password = await bcrypt.hash(newPassword, 10);
//     await business.save();

//     res.json({ message: 'Password changed successfully.' });
//   } catch (err) {
//     console.error('Change password error:', err);
//     res.status(500).json({ error: 'Server error during password change.' });
//   }
// });

// app.delete('/api/auth/deactivate', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     await Invoice.deleteMany({ businessId: userId });
//     await Business.findByIdAndDelete(userId);
//     res.json({ message: 'Account and related invoices deleted successfully.' });
//   } catch (err) {
//     console.error('Deactivate error:', err);
//     res.status(500).json({ error: 'Server error during account deactivation.' });
//   }
// });

// // ---------------- INVOICE ROUTES ----------------
// app.post('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const { customerName, customerMobile, items, totalAmount, date, invoiceNumber } = req.body;
//     if (!customerName || !customerMobile || !items.length || totalAmount === undefined || !date)
//       return res.status(400).json({ error: 'Missing required invoice fields.' });

//     const newInvoice = new Invoice({
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date,
//       invoiceNumber,
//       businessId: req.user.userId,
//     });

//     await newInvoice.save();
//     res.status(201).json({ message: 'Invoice saved successfully.' });
//   } catch (err) {
//     console.error('Save invoice error:', err);
//     res.status(500).json({ error: 'Server error while saving invoice.' });
//   }
// });

// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(invoices);
//   } catch (err) {
//     console.error('Fetch invoices error:', err);
//     res.status(500).json({ error: 'Server error while fetching invoices.' });
//   }
// });

// // ---------------- SALES ROUTES ----------------
// app.get('/api/sales/total-invoices', authenticateJWT, async (req, res) => {
//   const { date } = req.query;
//   try {
//     const total = await Invoice.countDocuments({ businessId: req.user.userId, date });
//     res.json({ total });
//   } catch (err) {
//     console.error('Total invoices error:', err);
//     res.status(500).json({ error: 'Failed to get total invoices.' });
//   }
// });

// app.get('/api/sales/one-day', authenticateJWT, async (req, res) => {
//   const { date } = req.query;
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId, date });
//     const totalSales = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
//     res.json({ totalSales });
//   } catch (err) {
//     console.error('One day sales error:', err);
//     res.status(500).json({ error: 'Failed to get one day sales.' });
//   }
// });

// app.get('/api/sales/monthly', authenticateJWT, async (req, res) => {
//   const { month, year } = req.query;
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId });
//     const totalSales = invoices.reduce((sum, inv) => {
//       const [invYear, invMonth] = inv.date.split('-');
//       return invMonth === month && invYear === year ? sum + inv.totalAmount : sum;
//     }, 0);
//     res.json({ totalSales });
//   } catch (err) {
//     console.error('Monthly sales error:', err);
//     res.status(500).json({ error: 'Failed to get monthly sales.' });
//   }
// });

// app.get('/api/sales/yearly', authenticateJWT, async (req, res) => {
//   const { year } = req.query;
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId });
//     const totalSales = invoices.reduce((sum, inv) => {
//       const [invYear] = inv.date.split('-');
//       return invYear === year ? sum + inv.totalAmount : sum;
//     }, 0);
//     res.json({ totalSales });
//   } catch (err) {
//     console.error('Yearly sales error:', err);
//     res.status(500).json({ error: 'Failed to get yearly sales.' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Schemas
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
//   invoiceNumber: { type: String },
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

// // JWT Auth middleware
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(403).json({ error: 'Authorization required' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// // Routes

// // Signup
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

// // Login
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

// // Get profile
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

// // Search invoices based on filters
// app.get('/api/invoice/search', authenticateJWT, async (req, res) => {
//   try {
//     const { filterType, filterValue } = req.query;

//     let filter = {};
//     if (filterType === 'Name') {
//       filter.customerName = { $regex: filterValue, $options: 'i' }; // Case-insensitive search
//     } else if (filterType === 'Mobile') {
//       filter.customerMobile = filterValue;
//     } else if (filterType === 'Date') {
//       const date = new Date(filterValue);
//       filter.date = { $gte: date.toISOString(), $lte: new Date(date.setHours(23, 59, 59, 999)).toISOString() };
//     }

//     const invoices = await Invoice.find({ businessId: req.user.userId, ...filter }).sort({ createdAt: -1 });
//     res.json({ sales: invoices });
//   } catch (err) {
//     console.error('Search invoices error:', err);
//     res.status(500).json({ error: 'Failed to fetch data. Please try again.' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });



// //wokring -> fine
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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Schemas
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
//   invoiceNumber: { type: String },
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

// // JWT Auth middleware
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(403).json({ error: 'Authorization required' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// // Routes

// // Signup
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

// // Login
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

// // Get profile
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

// // Update profile
// app.put('/api/auth/profile', authenticateJWT, upload.single('logo'), async (req, res) => {
//   try {
//     const { businessName, phone, address, gstNo } = req.body;
//     const updateData = { businessName, phone, address, gstNo };

//     if (req.file) {
//       updateData.logo = `/uploads/${req.file.filename}`;
//     }

//     const business = await Business.findByIdAndUpdate(
//       req.user.userId,
//       { $set: updateData },
//       { new: true }
//     );

//     if (!business) return res.status(404).json({ error: 'Business not found' });
//     res.json({ message: 'Profile updated successfully', business });
//   } catch (err) {
//     console.error('Update profile error:', err);
//     res.status(500).json({ error: 'Server error during profile update.' });
//   }
// });

// // Change password
// app.put('/api/auth/change-password', authenticateJWT, async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match.' });
//     }

//     const business = await Business.findById(req.user.userId);
//     if (!business) return res.status(404).json({ error: 'Business not found' });

//     const isMatch = await bcrypt.compare(currentPassword, business.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Current password is incorrect.' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     business.password = hashedPassword;
//     await business.save();

//     res.json({ message: 'Password changed successfully.' });
//   } catch (err) {
//     console.error('Change password error:', err);
//     res.status(500).json({ error: 'Server error during password change.' });
//   }
// });

// // Deactivate account (delete business + invoices)
// app.delete('/api/auth/deactivate', authenticateJWT, async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     // Delete all invoices by this business
//     await Invoice.deleteMany({ businessId: userId });

//     // Delete the business
//     await Business.findByIdAndDelete(userId);

//     res.json({ message: 'Account and related invoices deleted successfully.' });
//   } catch (err) {
//     console.error('Deactivate error:', err);
//     res.status(500).json({ error: 'Server error during account deactivation.' });
//   }
// });

// // Create invoice
// app.post('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const { customerName, customerMobile, items, totalAmount, date, invoiceNumber } = req.body;

//     if (!customerName || !customerMobile || !items.length || totalAmount === undefined || !date) {
//       return res.status(400).json({ error: 'Missing required invoice fields.' });
//     }

//     const newInvoice = new Invoice({
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date,
//       invoiceNumber,
//       businessId: req.user.userId,
//     });

//     await newInvoice.save();
//     res.status(201).json({ message: 'Invoice saved successfully.' });
//   } catch (err) {
//     console.error('Save invoice error:', err);
//     res.status(500).json({ error: 'Server error while saving invoice.' });
//   }
// });

// // Get invoices
// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(invoices);
//   } catch (err) {
//     console.error('Fetch invoices error:', err);
//     res.status(500).json({ error: 'Server error while fetching invoices.' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Schemas
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
//   invoiceNumber: { type: String },
//   businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
// }, { timestamps: true });

// InvoiceSchema.index({ customerName: 1, businessId: 1 });
// InvoiceSchema.index({ customerMobile: 1, businessId: 1 });
// InvoiceSchema.index({ date: 1, businessId: 1 });

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

// // Auth middleware
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1];
//   if (!token) return res.status(403).json({ error: 'Authorization required' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// // Routes

// // Signup
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

// // Login
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

// // Get profile
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

// // Update profile
// app.put('/api/auth/profile', authenticateJWT, upload.single('logo'), async (req, res) => {
//   try {
//     const { businessName, phone, address, gstNo } = req.body;
//     const updateData = { businessName, phone, address, gstNo };

//     if (req.file) {
//       updateData.logo = `/uploads/${req.file.filename}`;
//     }

//     const business = await Business.findByIdAndUpdate(
//       req.user.userId,
//       { $set: updateData },
//       { new: true }
//     );

//     if (!business) return res.status(404).json({ error: 'Business not found' });
//     res.json({ message: 'Profile updated successfully', business });
//   } catch (err) {
//     console.error('Update profile error:', err);
//     res.status(500).json({ error: 'Server error during profile update.' });
//   }
// });

// // Change password
// app.put('/api/auth/change-password', authenticateJWT, async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match.' });
//     }

//     const business = await Business.findById(req.user.userId);
//     if (!business) return res.status(404).json({ error: 'Business not found' });

//     const isMatch = await bcrypt.compare(currentPassword, business.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Current password is incorrect.' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     business.password = hashedPassword;
//     await business.save();

//     res.json({ message: 'Password changed successfully.' });
//   } catch (err) {
//     console.error('Change password error:', err);
//     res.status(500).json({ error: 'Server error during password change.' });
//   }
// });

// // Create invoice
// app.post('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const { customerName, customerMobile, items, totalAmount, date, invoiceNumber } = req.body;

//     if (!customerName || !customerMobile || !items.length || totalAmount === undefined || !date) {
//       return res.status(400).json({ error: 'Missing required invoice fields.' });
//     }

//     const newInvoice = new Invoice({
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date,
//       invoiceNumber,
//       businessId: req.user.userId,
//     });

//     await newInvoice.save();
//     res.status(201).json({ message: 'Invoice saved successfully.' });
//   } catch (err) {
//     console.error('Save invoice error:', err);
//     res.status(500).json({ error: 'Server error while saving invoice.' });
//   }
// });

// // Get invoices
// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(invoices);
//   } catch (err) {
//     console.error('Fetch invoices error:', err);
//     res.status(500).json({ error: 'Server error while fetching invoices.' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

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
//   invoiceNumber: { type: String }, // <-- ADDED for invoice number support
//   businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
// }, { timestamps: true });

// InvoiceSchema.index({ customerName: 1, businessId: 1 });
// InvoiceSchema.index({ customerMobile: 1, businessId: 1 });
// InvoiceSchema.index({ date: 1, businessId: 1 });

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

// // Routes
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

// // ----------- EDIT PROFILE ENDPOINT (PUT) -----------
// app.put('/api/auth/profile', authenticateJWT, upload.single('logo'), async (req, res) => {
//   try {
//     const { businessName, phone, address, gstNo } = req.body;
//     const updateData = { businessName, phone, address, gstNo };

//     if (req.file) {
//       updateData.logo = `/uploads/${req.file.filename}`;
//     }

//     const business = await Business.findByIdAndUpdate(
//       req.user.userId,
//       { $set: updateData },
//       { new: true }
//     );

//     if (!business) return res.status(404).json({ error: 'Business not found' });
//     res.json({ message: 'Profile updated successfully', business });
//   } catch (err) {
//     console.error('Update profile error:', err);
//     res.status(500).json({ error: 'Server error during profile update.' });
//   }
// });
// // ---------------------------------------------------

// app.post('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const { customerName, customerMobile, items, totalAmount, date, invoiceNumber } = req.body;

//     if (!customerName || !customerMobile || !items.length || totalAmount === undefined || !date) {
//       return res.status(400).json({ error: 'Missing required invoice fields.' });
//     }

//     const newInvoice = new Invoice({
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date,
//       invoiceNumber, // <-- Save invoice number if provided
//       businessId: req.user.userId,
//     });

//     await newInvoice.save();
//     res.status(201).json({ message: 'Invoice saved successfully.' });
//   } catch (err) {
//     console.error('Save invoice error:', err);
//     res.status(500).json({ error: 'Server error while saving invoice.' });
//   }
// });

// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(invoices);
//   } catch (err) {
//     console.error('Fetch invoices error:', err);
//     res.status(500).json({ error: 'Server error while fetching invoices.' });
//   }
// });

// app.get('/api/invoice/search', authenticateJWT, async (req, res) => {
//   try {
//     const { filterType, filterValue } = req.query;
//     const businessId = req.user.userId;
    
//     let query = { businessId };

//     if (filterValue) {
//       switch(filterType) {
//         case 'Name':
//           query.customerName = { $regex: filterValue, $options: 'i' };
//           break;
//         case 'Mobile':
//           query.customerMobile = { $regex: filterValue, $options: 'i' };
//           break;
//         case 'Date':
//           query.date = filterValue;
//           break;
//         default:
//           break;
//       }
//     }

//     const sales = await Invoice.find(query).sort({ createdAt: -1 });
//     res.json({ sales });
//   } catch (err) {
//     console.error('Search error:', err);
//     res.status(500).json({ error: 'Server error during search' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

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

// InvoiceSchema.index({ customerName: 1, businessId: 1 });
// InvoiceSchema.index({ customerMobile: 1, businessId: 1 });
// InvoiceSchema.index({ date: 1, businessId: 1 });

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

// // Routes
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

// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ createdAt: -1 });
//     res.json(invoices);
//   } catch (err) {
//     console.error('Fetch invoices error:', err);
//     res.status(500).json({ error: 'Server error while fetching invoices.' });
//   }
// });

// app.get('/api/invoice/search', authenticateJWT, async (req, res) => {
//   try {
//     const { filterType, filterValue } = req.query;
//     const businessId = req.user.userId;
    
//     let query = { businessId };

//     if (filterValue) {
//       switch(filterType) {
//         case 'Name':
//           query.customerName = { $regex: filterValue, $options: 'i' };
//           break;
//         case 'Mobile':
//           query.customerMobile = { $regex: filterValue, $options: 'i' };
//           break;
//         case 'Date':
//           query.date = filterValue;
//           break;
//         default:
//           break;
//       }
//     }

//     const sales = await Invoice.find(query).sort({ createdAt: -1 });
//     res.json({ sales });
//   } catch (err) {
//     console.error('Search error:', err);
//     res.status(500).json({ error: 'Server error during search' });
//   }
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
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

/////------------------------------------------------------------------------------
// const express = require('express');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/invoice-generator', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Define User Schema
// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   businessName: String,
//   businessAddress: String,
//   businessMobile: String,
// });

// const User = mongoose.model('User', userSchema);

// // Define Invoice Schema
// const invoiceSchema = new mongoose.Schema({
//   customerName: { type: String, required: true },
//   customerMobile: { type: String, required: true },
//   items: [
//     {
//       itemName: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//     }
//   ],
//   totalAmount: { type: Number, required: true },
//   date: { type: Date, required: true },
//   businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
// });

// const Invoice = mongoose.model('Invoice', invoiceSchema);

// // JWT Secret Key
// const JWT_SECRET = 'your_secret_key';

// // JWT Authentication Middleware
// function authenticateJWT(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: 'Authorization header missing' });
//   }

//   const token = authHeader.split(' ')[1];

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       console.error('JWT error:', err);
//       return res.status(403).json({ error: 'Invalid token' });
//     }
//     req.user = user;
//     next();
//   });
// }

// // API Routes

// // User Signup
// app.post('/api/signup', async (req, res) => {
//   try {
//     const { username, password, businessName, businessAddress, businessMobile } = req.body;

//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Username already exists' });
//     }

//     const newUser = new User({
//       username,
//       password,
//       businessName,
//       businessAddress,
//       businessMobile,
//     });

//     await newUser.save();

//     const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
//     res.status(201).json({ token });
//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ error: 'Server error during signup' });
//   }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username, password });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error during login' });
//   }
// });

// // Save Invoice
// app.post('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const { customerName, customerMobile, items, totalAmount, date } = req.body;

//     if (!customerName || !customerMobile || !Array.isArray(items) || items.length === 0 || totalAmount === undefined || !date) {
//       return res.status(400).json({ error: 'Missing required invoice fields.' });
//     }

//     // Validate date
//     const parsedDate = new Date(date);
//     if (isNaN(parsedDate.getTime())) {
//       return res.status(400).json({ error: 'Invalid date format.' });
//     }

//     // Validate items
//     for (let item of items) {
//       if (!item.itemName || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
//         return res.status(400).json({ error: 'Invalid item data.' });
//       }
//     }

//     const newInvoice = new Invoice({
//       customerName,
//       customerMobile,
//       items,
//       totalAmount,
//       date: parsedDate,
//       businessId: req.user.userId,
//     });

//     await newInvoice.save();
//     res.status(201).json({ message: 'Invoice saved successfully.' });
//   } catch (err) {
//     console.error('Save invoice error:', err);
//     res.status(500).json({ error: 'Server error while saving invoice.' });
//   }
// });

// // Get Business Details
// app.get('/api/business-details', authenticateJWT, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('businessName businessAddress businessMobile');
//     if (!user) {
//       return res.status(404).json({ error: 'Business details not found' });
//     }
//     res.json(user);
//   } catch (err) {
//     console.error('Fetch business details error:', err);
//     res.status(500).json({ error: 'Server error fetching business details' });
//   }
// });

// // Get All Invoices
// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ businessId: req.user.userId }).sort({ date: -1 });
//     res.json(invoices);
//   } catch (err) {
//     console.error('Fetch invoices error:', err);
//     res.status(500).json({ error: 'Server error fetching invoices' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

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

// const InvoiceSchema = new mongoose.Schema({
//   customerName: { type: String, required: true },
//   customerMobile: { type: String, required: true },
//   items: [{
//     description: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true },
//   }],
//   totalAmount: { type: Number, required: true },
//   date: { type: Date, required: true },
//   businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
// }, { timestamps: true });

// const Business = mongoose.model('Business', BusinessSchema);
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

// // Routes
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

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required.' });
//     }

//     const business = await Business.findOne({ email });
//     if (!business) {
//       return res.status(400).json({ error: 'Business not found with this email.' });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, business.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ error: 'Incorrect password.' });
//     }

//     const token = jwt.sign({ userId: business._id, email: business.email }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error during login.' });
//   }
// });

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
//       date: new Date(date),
//       businessId: req.user.userId,
//     });

//     await newInvoice.save();
//     res.status(201).json({ message: 'Invoice saved successfully.' });
//   } catch (err) {
//     console.error('Save invoice error:', err);
//     res.status(500).json({ error: 'Server error while saving invoice.' });
//   }
// });

// // Bill History Endpoints
// app.get('/api/invoices', authenticateJWT, async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const invoices = await Invoice.find({ businessId: req.user.userId })
//       .sort({ date: -1 })
//       .skip(skip)
//       .limit(limit);

//     const totalInvoices = await Invoice.countDocuments({ businessId: req.user.userId });

//     res.json({
//       invoices,
//       totalInvoices
//     });
//   } catch (err) {
//     console.error('Invoice fetch error:', err);
//     res.status(500).json({ error: 'Failed to fetch invoices' });
//   }
// });

// app.get('/api/sales/total', authenticateJWT, async (req, res) => {
//   try {
//     const totalSales = await Invoice.aggregate([
//       { $match: { businessId: mongoose.Types.ObjectId(req.user.userId) } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//     ]);

//     res.json({
//       totalSales: totalSales.length ? totalSales[0].total : 0
//     });
//   } catch (err) {
//     console.error('Total sales error:', err);
//     res.status(500).json({ error: 'Failed to calculate total sales' });
//   }
// });

// app.get('/api/sales/monthly', authenticateJWT, async (req, res) => {
//   try {
//     const monthlySales = await Invoice.aggregate([
//       { $match: { businessId: mongoose.Types.ObjectId(req.user.userId) } },
//       { $group: {
//         _id: {
//           year: { $year: "$date" },
//           month: { $month: "$date" },
//         },
//         total: { $sum: "$totalAmount" },
//       }},
//       { $sort: { "_id.year": -1, "_id.month": -1 } },
//     ]);

//     res.json({
//       monthlySales
//     });
//   } catch (err) {
//     console.error('Monthly sales error:', err);
//     res.status(500).json({ error: 'Failed to calculate monthly sales' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

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
//     price: { type: Number, required: true },
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

// // 🔥 NEW API: Search Invoice History (for BillHistory Page)
// app.get('/api/invoice/search', authenticateJWT, async (req, res) => {
//   try {
//     const { filterType, filterValue } = req.query;
//     if (!filterType || !filterValue) {
//       return res.status(400).json({ error: 'Missing filterType or filterValue.' });
//     }

//     console.log(`Filter Type: ${filterType}`);
//     console.log(`Filter Value: ${filterValue}`);

//     const query = { businessId: req.user.userId }; // Only fetch invoices belonging to the authenticated business

//     if (filterType === 'Name') {
//       query.customerName = { $regex: new RegExp(filterValue, 'i') };  // Case-insensitive regex search
//     } else if (filterType === 'Mobile') {
//       query.customerMobile = { $regex: new RegExp(filterValue, 'i') };  // Case-insensitive regex search
//     } else if (filterType === 'Date') {
//       query.date = filterValue;
//     }

//     console.log('MongoDB Query:', query);

//     const invoices = await Invoice.find(query).sort({ createdAt: -1 });

//     console.log('Invoices Found:', invoices);

//     if (invoices.length === 0) {
//       return res.json({ message: 'No sales found. Try searching!' });
//     }

//     // Formatting the invoices before sending the response
//     const sales = invoices.map(inv => ({
//       _id: inv._id,
//       invoiceNumber: `INV-${inv._id.toString().slice(-6)}`,
//       clientName: inv.customerName,
//       clientMobile: inv.customerMobile,
//       totalAmount: inv.totalAmount,
//       createdAt: inv.createdAt,
//     }));

//     res.json({ sales });
//   } catch (err) {
//     console.error('Invoice search error:', err);
//     res.status(500).json({ error: 'Server error during invoice search.' });
//   }
// });

// // Server Start
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

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
//     price: { type: Number, required: true },
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

// // 🔥 NEW API: Search Invoice History (for BillHistory Page)
// app.get('/api/invoice/search', authenticateJWT, async (req, res) => {
//   try {
//     const { filterType, filterValue } = req.query;
//     if (!filterType || !filterValue) {
//       return res.status(400).json({ error: 'Missing filterType or filterValue.' });
//     }

//     const query = { businessId: req.user.userId }; // Only fetch your own invoices

//     if (filterType === 'Name') {
//       query.customerName = { $regex: new RegExp(filterValue, 'i') };
//     } else if (filterType === 'Mobile') {
//       query.customerMobile = { $regex: new RegExp(filterValue, 'i') };
//     } else if (filterType === 'Date') {
//       query.date = filterValue;
//     }

//     const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    
//     // formatting
//     const sales = invoices.map(inv => ({
//       _id: inv._id,
//       invoiceNumber: `INV-${inv._id.toString().slice(-6)}`,
//       clientName: inv.customerName,
//       clientMobile: inv.customerMobile,
//       totalAmount: inv.totalAmount,
//       createdAt: inv.createdAt,
//     }));

//     res.json({ sales });
//   } catch (err) {
//     console.error('Invoice search error:', err);
//     res.status(500).json({ error: 'Server error during invoice search.' });
//   }
// });

// // Server Start
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


///fine working
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

// // Server Start
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

// // Mongoose Schema
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

//     const existingUser = await Business.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already registered.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newBusiness = new Business({
//       businessName,
//       phone,
//       email,
//       password: hashedPassword,
//       address,
//       gstNo,
//       logo: req.file ? `/uploads/${req.file.filename}` : null,
//     });

//     await newBusiness.save();
//     res.status(201).json({ message: 'Business registered successfully!' });
//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login Route
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: 'Please provide email and password.' });

//     const user = await Business.findOne({ email });
//     if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

//     const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         businessName: user.businessName,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         gstNo: user.gstNo,
//         logo: user.logo,
//       },
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Auth Middleware
// const authenticateJWT = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Access Denied' });

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ error: 'Invalid Token' });
//     req.user = user;
//     next();
//   });
// };

// // Get Business Profile (protected route)
// app.get('/api/auth/profile', authenticateJWT, async (req, res) => {
//   try {
//     const user = await Business.findById(req.user.userId);
//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.json({
//       businessName: user.businessName,
//       phone: user.phone,
//       email: user.email,
//       address: user.address,
//       gstNo: user.gstNo,
//       logo: user.logo,
//     });
//   } catch (err) {
//     console.error('Profile error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Start Server
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// require('dotenv').config(); // Load environment variables
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Initialize the app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse incoming JSON requests
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/businessApp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// // Mongoose schema for Business model
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

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // JWT secret from environment variables
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// // Signup route
// app.post('/api/auth/signup', upload.single('logo'), async (req, res) => {
//   try {
//     const { businessName, phone, email, password, confirmPassword, address, gstNo } = req.body;

//     if (!businessName || !phone || !email || !password || !confirmPassword) {
//       return res.status(400).json({ error: 'Please fill all required fields.' });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match.' });
//     }

//     // Check if email already exists
//     const existingUser = await Business.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already registered.' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new business user
//     const newBusiness = new Business({
//       businessName,
//       phone,
//       email,
//       password: hashedPassword,
//       address,
//       gstNo,
//       logo: req.file ? `/uploads/${req.file.filename}` : null,
//     });

//     await newBusiness.save();

//     res.status(201).json({ message: 'Business registered successfully!' });
//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login route
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Please provide email and password.' });
//     }

//     const user = await Business.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid email or password.' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         businessName: user.businessName,
//         email: user.email,
//         phone: user.phone,
//         address: user.address,
//         gstNo: user.gstNo,
//         logo: user.logo,
//       },
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Middleware to check if the user is authenticated
// const authenticateJWT = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'Access Denied' });
//   }
  
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid Token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Protected route example (Dashboard)
// app.get('/api/dashboard', authenticateJWT, (req, res) => {
//   res.json({
//     message: 'Welcome to the dashboard',
//     user: req.user,
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// // ////-----------------
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const bcrypt = require('bcryptjs'); // Ensure it's bcryptjs, not bcrypt

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/businessApp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log('MongoDB connected');
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });

// // Multer config for logo upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // Mongoose model
// const BusinessSchema = new mongoose.Schema({
//   businessName: String,
//   phone: String,
//   email: String,
//   password: String,
//   address: String,
//   gstNo: String,
//   logo: String,
// });
// const Business = mongoose.model('Business', BusinessSchema);

// // Signup route
// app.post('/api/auth/signup', upload.single('logo'), async (req, res) => {
//   try {
//     const {
//       businessName,
//       phone,
//       email,
//       password,
//       confirmPassword,
//       address,
//       gstNo,
//     } = req.body;

//     // Password match check
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newBusiness = new Business({
//       businessName,
//       phone,
//       email,
//       password: hashedPassword,
//       address,
//       gstNo,
//       logo: req.file ? `/uploads/${req.file.filename}` : null,
//     });

//     await newBusiness.save();
//     res.status(201).json({ message: 'Business registered successfully!' });
//   } catch (err) {
//     console.error('Error during signup:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
/////--------------------------------------------------
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const multer = require('multer');
// // const bcrypt = require('bcrypt');
// const path = require('path');
// const fs = require('fs');
// const bcrypt = require('bcryptjs'); // Ensure it's bcryptjs, not bcrypt

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/businessApp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// console.log('MongoDB connected');

// // Multer config for logo upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // Mongoose model
// const BusinessSchema = new mongoose.Schema({
//   businessName: String,
//   phone: String,
//   email: String,
//   password: String,
//   address: String,
//   gstNo: String,
//   logo: String,
// });
// const Business = mongoose.model('Business', BusinessSchema);

// // Signup route
// app.post('/api/auth/signup', upload.single('logo'), async (req, res) => {
//   try {
//     const {
//       businessName,
//       phone,
//       email,
//       password,
//       confirmPassword,
//       address,
//       gstNo,
//     } = req.body;

//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: 'Passwords do not match' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newBusiness = new Business({
//       businessName,
//       phone,
//       email,
//       password: hashedPassword,
//       address,
//       gstNo,
//       logo: req.file ? `/uploads/${req.file.filename}` : null,
//     });

//     await newBusiness.save();
//     res.status(201).json({ message: 'Business registered successfully!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Start server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const path = require('path');
// const fs = require('fs');
// import express from 'express';
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/businessApp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // Define Mongoose schema and model
// const businessSchema = new mongoose.Schema({
//   businessName: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   passwordHash: { type: String, required: true },
//   address: { type: String },
//   gstNo: { type: String },
//   logoUrl: { type: String }, // path to logo image
// }, { timestamps: true });

// const Business = mongoose.model('Business', businessSchema);

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve uploaded images statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = './uploads/logos';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Save with unique filename: timestamp + original name
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // Signup route
// app.post('/api/signup', upload.single('logo'), async (req, res) => {
//   try {
//     const {
//       businessName,
//       phone,
//       email,
//       password,
//       confirmPassword,
//       address,
//       gstNo,
//     } = req.body;

//     // Basic validation
//     if (!businessName || !phone || !email || !password || !confirmPassword) {
//       return res.status(400).json({ message: 'Please fill all required fields.' });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: 'Passwords do not match.' });
//     }

//     // Check if email already exists
//     const existingBusiness = await Business.findOne({ email });
//     if (existingBusiness) {
//       return res.status(400).json({ message: 'Email already registered.' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(password, salt);

//     // Prepare new business data
//     const newBusiness = new Business({
//       businessName,
//       phone,
//       email,
//       passwordHash,
//       address,
//       gstNo,
//       logoUrl: req.file ? `/uploads/logos/${req.file.filename}` : null,
//     });

//     await newBusiness.save();

//     return res.status(201).json({ message: 'Business registered successfully!' });
//   } catch (error) {
//     console.error('Signup error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
