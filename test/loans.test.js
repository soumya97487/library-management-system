const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

describe('Loan API Tests', function() {
  this.timeout(5000);

  let token;
  let authorId;
  let categoryId;
  let bookId;
  let borrowerId;
  let loanId;

  before(async () => {
    // Connect to test DB and clear
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoose.connection.db.dropDatabase();

    // Signup & verify admin
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

    // Create related entities: author, category, book, borrower
    const authorRes = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Loan Author', bio: 'Author bio' });
    authorId = authorRes.body._id;

    const categoryRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'History', description: 'History books' });
    categoryId = categoryRes.body._id;

    const bookRes = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Loan Book',
        isbn: '1111111111',
        publication_year: 2020,
        publisher: 'Loan Publisher',
        authors: [authorId],
        categories: [categoryId]
      });
    bookId = bookRes.body._id;

    const borrowerRes = await request(app)
      .post('/api/borrowers')
      .set('Authorization', `Bearer ${token}`)
      .send({ first_name: 'Borrow', last_name: 'Er', email: 'borrower@example.com', phone_number: '5555555555' });
    borrowerId = borrowerRes.body._id;
  });

  after(async () => {
    await mongoose.disconnect();
  });

  it('POST /api/loans - should create a new loan', async () => {
    const res = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${token}`)
      .send({ book: bookId, borrower: borrowerId, loan_date: '2025-06-01', due_date: '2025-06-15', return_date: '2025-06-10', status: 'returned' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
    loanId = res.body._id;
  });

  it('GET /api/loans - should return array of loans', async () => {
    const res = await request(app)
      .get('/api/loans')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
  });

  it('GET /api/loans/:id - should return loan by ID', async () => {
    const res = await request(app)
      .get(`/api/loans/${loanId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id', loanId);
  });

  it('PUT /api/loans/:id - should update loan', async () => {
    const res = await request(app)
      .put(`/api/loans/${loanId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ book: bookId, borrower: borrowerId, loan_date: '2025-06-02', due_date: '2025-06-16', return_date: '2025-06-12', status: 'on_loan' });

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal('on_loan');
  });

  it('DELETE /api/loans/:id - should delete loan', async () => {
    const res = await request(app)
      .delete(`/api/loans/${loanId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Loan deleted');
  });
});