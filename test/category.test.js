const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

describe('Category API Tests', function() {
  this.timeout(5000);

  let token;
  let categoryId;

  before(async () => {
    // Connect to the test database and clear it
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await mongoose.connection.db.dropDatabase();

    // Sign up and verify an admin user
    await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' });

    const adminUser = await User.findOne({ email: 'admin@example.com' });
    adminUser.isVerified = true;
    await adminUser.save();

    // Login to get the JWT token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpass' });
    token = loginRes.body.token;
  });

  after(async () => {
    // Disconnect after tests
    await mongoose.disconnect();
  });

  it('POST /api/categories - should create a new category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Science', description: 'Science books' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    expect(res.body.name).to.equal('Science');
    categoryId = res.body._id;
  });

  it('GET /api/categories - should retrieve all categories', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
  });

  it('GET /api/categories/:id - should retrieve category by ID', async () => {
    const res = await request(app)
      .get(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', categoryId);
  });

  it('PUT /api/categories/:id - should update the category', async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Science & Tech', description: 'Science and Technology books' });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('Science & Tech');
  });

  it('DELETE /api/categories/:id - should delete the category', async () => {
    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Category deleted');
  });
});
