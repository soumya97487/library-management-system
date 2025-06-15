const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

describe('Book API Tests', function() {
  this.timeout(5000);

  let token;
  let bookId;

  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await mongoose.connection.db.dropDatabase();

    // Create and verify admin user
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

  it('POST /api/books - should create a new book', async () => {
    // First create related author and category
    const authorRes = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Book Author', bio: 'Author bio' });
    const categoryRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Fiction', description: 'Fictional books' });

    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        isbn: '1234567890',
        publication_year: 2021,
        publisher: 'Test Publisher',
        authors: [authorRes.body._id],
        categories: [categoryRes.body._id]
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    expect(res.body.title).to.equal('Test Book');
    bookId = res.body._id;
  });

  it('GET /api/books - should return array of books', async () => {
    const res = await request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
  });

  it('GET /api/books/:id - should return book by ID', async () => {
    const res = await request(app)
      .get(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', bookId);
  });

  it('PUT /api/books/:id - should update book', async () => {
    const res = await request(app)
      .put(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Book', isbn: '0987654321', publication_year: 2022, publisher: 'Updated Publisher', authors: [], categories: [] });

    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal('Updated Book');
  });

  it('DELETE /api/books/:id - should delete book', async () => {
    const res = await request(app)
      .delete(`/api/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Book deleted');
  });
});
