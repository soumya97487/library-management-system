// tests/auth.test.js

const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

// Increase test timeout since email sending may take time
describe('Auth API Tests', function() {
  this.timeout(10000);

  before(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Clean users collection
    await User.deleteMany({});
  });

  after(async () => {
    // Disconnect from DB
    await mongoose.disconnect();
  });

  let rawToken;

  it('POST /api/auth/signup - should register user and send verification email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.message).to.match(/Verification email sent/);

    // Retrieve the verification token from DB
    const user = await User.findOne({ email: 'testuser@example.com' }).select('+verificationToken');
    expect(user).to.exist;
    rawToken = user.generateVerificationToken(); // raw token to verify
    // Save hashed token back to user for verify endpoint
    user.verificationToken = require('crypto').createHash('sha256').update(rawToken).digest('hex');
    user.verificationTokenExpire = Date.now() + 30 * 60 * 1000;
    await user.save();
  });

  it('GET /api/auth/verify/:token - should verify email', async () => {
    const res = await request(app)
      .get(`/api/auth/verify/${rawToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.user).to.have.property('_id');
    expect(res.body.user.email).to.equal('testuser@example.com');
  });

  it('POST /api/auth/login - should login verified user and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
    expect(res.body.token).to.be.a('string');
  });
});
