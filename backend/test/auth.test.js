const { chai, expect, app, connectAndClean, disconnect, request } = require('./testHelper'); // Updated imports
const User = require('../models/User'); // Assuming your User model path
const crypto = require('crypto'); // Used for generating verification tokens

let rawToken; // To store the token for verification steps

describe('Auth API Tests', function() {
  this.timeout(5000); // Set a timeout for the test suite

  // Before all tests in this suite, connect to DB and clean it
  before(async () => {
    await connectAndClean();
  });

  // After all tests in this suite, disconnect from DB
  after(async () => {
    await disconnect();
  });

  it('should signup a new user and send verification email', (done) => {
    request(app) // Use supertest's request
      .post('/api/auth/signup')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
      .expect(200) // Supertest assertion for status
      .end((err, res) => { // Standard .end() callback
        if (err) return done(err); // Pass any errors to Mocha
        expect(res.body.success).to.be.true; // Use res.body for response data
        expect(res.body.message).to.include('Verification email sent');

        // After signup, find the user to extract the raw verification token from the database for testing
        User.findOne({ email: 'test@example.com' }).select('+verificationToken +verificationTokenExpire')
          .then(user => {
            if (!user) { return done(new Error('User not found after signup.')); }
            rawToken = user.generateVerificationToken(); // Make sure this method exists on your User model
            user.verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
            user.verificationTokenExpire = Date.now() + 3600000;
            return user.save();
          })
          .then(() => done())
          .catch(done);
      });
  });

  it('should verify the user email using the raw token', (done) => {
    if (!rawToken) { return done(new Error('rawToken was not set by the signup test. Cannot proceed with verification.')); }
    request(app)
      .get(`/api/auth/verify/${rawToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Email verified successfully!');
        done();
      });
  });

  it('should allow the user to login after successful verification', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.token).to.be.a('string');
        done();
      });
  });

  it('should not allow login with unverified email', (done) => {
    // Signup a new user specifically for this test, but do not verify them
    const unverifiedEmail = 'unverified@example.com';
    request(app)
      .post('/api/auth/signup')
      .send({ name: 'Unverified User', email: unverifiedEmail, password: 'password123' })
      .expect(200) // Assuming signup itself returns 200 even if email is unverified
      .end((err, signupRes) => {
        if (err) return done(err);

        // Attempt to login immediately without verification
        request(app)
          .post('/api/auth/login')
          .send({ email: unverifiedEmail, password: 'password123' })
          .expect(401) // Expect 401 Unauthorized for unverified email
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.message).to.include('Please verify your email'); // Check specific error message
            done();
          });
      });
  });
});