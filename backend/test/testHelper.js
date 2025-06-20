const chai = require('chai');
const expect = chai.expect;

const mongoose = require('mongoose');
const app = require('../index'); // Assuming your main Express app is exported from index.js
const request = require('supertest'); // <-- NEW: Import supertest

// --- IMPORTANT: Supertest works directly with the Express app instance.
// No need to start/stop a separate HTTP server in tests like with Axios. ---

const connectAndClean = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/library_test_db', {
            useNewUrlParser: true, // Deprecated in Mongoose 6+, but harmless for older versions
            useUnifiedTopology: true, // Deprecated in Mongoose 6+, but harmless for older versions
        });
    }
    // Drop the database to ensure a clean state before each test suite
    await mongoose.connection.db.dropDatabase();
};

const disconnect = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
};

const loginAdmin = async () => {
    // Use supertest to make the signup request directly on the Express app
    await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' })
        .expect(200); // Supertest's own expect for status code

    // Directly verify the admin user in the database (bypasses email verification in tests)
    const User = require('../models/User'); // Assuming User model path
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (admin) {
        admin.isVerified = true;
        await admin.save();
    } else {
        throw new Error('Admin user not found after signup in testHelper.js for verification.');
    }

    // Use supertest to make the login request
    const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@example.com', password: 'adminpass' })
        .expect(200); // Supertest's own expect for status code

    // Use Chai's expect for asserting on the response body
    expect(res.body.token).to.be.a('string');

    return res.body.token; // Return the JWT token
};

// Export 'request' from supertest so other test files can use it for requests
// and 'app' to pass to request(app)
module.exports = { chai, expect, app, connectAndClean, disconnect, loginAdmin, request };