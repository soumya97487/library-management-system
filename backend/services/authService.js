// services/authService.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const transport = require('../config/email');

// Sign any payload (object) into a JWT
function generateToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
}

// Used for signup email verification
function generateSignupToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );
}

exports.signup = async ({ name, email, password, role }, clientUrl) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('User with that email already exists.');
  }

  // Send verification email
  const signupToken = generateSignupToken({ name, email, password, role });
  const verifyURL = `${clientUrl}/api/auth/verify/${signupToken}`;
  await transport.sendMail({
    from: `"Library Management" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify your email',
    template: 'verifyEmails',
    context: { name, verifyURL }
  });

  return { message: 'Verification email sent. Please check your inbox.' };
};

exports.verifyEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { name, email, password, role } = decoded;

  const already = await User.findOne({ email });
  if (already) {
    throw new Error('User already verified and registered.');
  }

  // Create & return the new user
  const user = await User.create({ name, email, password, role, isVerified: true });
  return user;
};

exports.login = async ({ email, password }) => {
  // Bring back the hashed password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isVerified) {
    throw new Error('Invalid credentials or email not verified');
  }

  const match = await user.matchPassword(password);
  if (!match) {
    throw new Error('Invalid credentials');
  }

  // Embed both id and role in the token
  const token = generateToken({ id: user._id, role: user.role });
  return token;
};
