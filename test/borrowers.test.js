const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

describe('Borrower API Tests', function() {
  this.timeout(5000);

  let token;
  let borrowerId;

  before(async () => {
    // Connect to test database and clear
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();

    // Signup and verify admin
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' });
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    adminUser.isVerified = true;
    await adminUser.save();

    // Login admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpass' });
    token = loginRes.body.token;
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('POST /api/borrowers - should create a new borrower', async () => {
    const res = await request(app)
      .post('/api/borrowers')
      .set('Authorization', `Bearer ${token}`)
      .send({ first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_number: '1234567890' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    expect(res.body.email).to.equal('john@example.com');
    borrowerId = res.body._id;
  });

  it('GET /api/borrowers - should return array of borrowers', async () => {
    const res = await request(app)
      .get('/api/borrowers')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
  });

  it('GET /api/borrowers/:id - should return borrower by ID', async () => {
    const res = await request(app)
      .get(`/api/borrowers/${borrowerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', borrowerId);
  });

  it('PUT /api/borrowers/:id - should update borrower', async () => {
    const res = await request(app)
      .put(`/api/borrowers/${borrowerId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone_number: '0987654321' });

    expect(res.status).to.equal(200);
    expect(res.body.first_name).to.equal('Jane');
    expect(res.body.email).to.equal('jane@example.com');
  });

  it('DELETE /api/borrowers/:id - should delete borrower', async () => {
    const res = await request(app)
      .delete(`/api/borrowers/${borrowerId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Borrower deleted');
  });
});