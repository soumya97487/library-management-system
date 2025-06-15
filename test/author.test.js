const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

describe('Author API Tests', function() {
  this.timeout(5000);

  let token;
  let authorId;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await mongoose.connection.db.dropDatabase();

    // Create and verify admin user
    const adminRes = await request(app)
      .post('/api/auth/signup')
      .send({ name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' });

    // Bypass email verification: set isVerified directly
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

  it('POST /api/authors - should create a new author', async () => {
    const res = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Author One', bio: 'Bio of author one' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    expect(res.body.name).to.equal('Author One');
    authorId = res.body._id;
  });

  it('GET /api/authors - should return array of authors', async () => {
    const res = await request(app)
      .get('/api/authors')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
  });

  it('GET /api/authors/:id - should return author by ID', async () => {
    const res = await request(app)
      .get(`/api/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', authorId);
  });

  it('PUT /api/authors/:id - should update author', async () => {
    const res = await request(app)
      .put(`/api/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Author One Updated', bio: 'Updated bio' });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('Author One Updated');
  });

  it('DELETE /api/authors/:id - should delete author', async () => {
    const res = await request(app)
      .delete(`/api/authors/${authorId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Author deleted');
  });
});
