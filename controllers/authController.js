const User = require('../models/User');
const jwt = require('jsonwebtoken');
const transport = require('../config/email');

// Helper to sign JWTs
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h'
  });
}

// Generate a signup verification token containing user details
function generateSignupToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with that email already exists.'
      });
    }

    // Create a token with the user info
    const signupToken = generateSignupToken({ name, email, password, role });

    const verifyURL = `${process.env.CLIENT_URL}/api/auth/verify/${signupToken}`;

    try {
      await transport.sendMail({
        from: `"Library Management" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify your email',
        template: 'verifyEmails',
        context: {
          name,
          verifyURL
        }
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
      return res.status(500).json({
        success: false,
        message: 'Could not send verification email. Please try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification email sent. Please check your inbox.'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: 'Verification link expired or invalid.'
      });
    }

    const { name, email, password, role } = decoded;

    // Double-check user doesn't already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already verified and registered.'
      });
    }

    // Create user with isVerified true
    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: true
    });
     console.log('Newly verified & created user:', user)
    return res.status(200).json({
      success: true,
      message: 'Email verified! Signup successful.'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Email not verified.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id);
    return res.status(200).json({ success: true, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
