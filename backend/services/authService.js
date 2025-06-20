const jwt = require('jsonwebtoken')
const User = require('../models/User')
const transport = require('../config/email')

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1h'
    });
}

function generateSignupToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
}

exports.signup = async ({ name, email, password, role }, clientUrl) => {
    // check existing
    let user = await User.findOne({ email });
    if (user) throw new Error('User with that email already exists.');
    // create signup token & send email
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
  let existing = await User.findOne({ email });
  if (existing) throw new Error('User already verified and registered.');

  const user = await User.create({ name, email, password, role, isVerified: true });
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isVerified) throw new Error('Invalid credentials or email not verified');
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error('Invalid credentials');
  const token = generateToken(user._id);
  return token;
};