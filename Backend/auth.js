// const jwt = require('jsonwebtoken'); // Install with: npm install jsonwebtoken

// // Secret key for JWT (store securely in env vars in production)
// const JWT_SECRET = 'your_jwt_secret_key_here';

// // Login route
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Please provide email and password' });
//     }

//     // Find user by email
//     const user = await Business.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Compare password with hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Create JWT token (valid for 1 day)
//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // Send token and user info (exclude password)
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