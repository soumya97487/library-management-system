const { chai, expect, app, connectAndClean, disconnect, loginAdmin, request } = require('./testHelper'); // Updated imports

describe('Loan CRUD Tests', function() {
  this.timeout(10000); // Increased timeout
  let adminToken, loanId, authorId, categoryId, bookId, borrowerId; // Variables for IDs and token

  // Before all tests, setup environment: connect, clean, login admin, create dependent entities
  before(async () => {
    await connectAndClean();
    adminToken = await loginAdmin();

    // Create an author, category, book, and borrower as loans depend on them
    const authorRes = await request(app).post('/api/authors').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Loan Test Author', bio: 'Author for loan tests' }).expect(201);
    authorId = authorRes.body._id;

    const categoryRes = await request(app).post('/api/categories').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Loan Test Category', description: 'Category for loan tests' }).expect(201);
    categoryId = categoryRes.body._id;

    const bookRes = await request(app).post('/api/books').set('Authorization', `Bearer ${adminToken}`).send({ title: 'Loanable Book', isbn: '1122334455', publication_year: 2022, publisher: 'Loan Publishers Inc.', authors: [authorId], categories: [categoryId] }).expect(201);
    bookId = bookRes.body._id;

    const borrowerRes = await request(app).post('/api/borrowers').set('Authorization', `Bearer ${adminToken}`).send({ first_name: 'Loan', last_name: 'User', email: 'loan.user@example.com', phone_number: '999-888-7777' }).expect(201);
    borrowerId = borrowerRes.body._id;
  });

  // After all tests, disconnect from DB
  after(async () => {
    await disconnect();
  });

  it('should create a loan successfully', (done) => {
    request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        book: bookId,
        borrower: borrowerId,
        loan_date: '2025-06-01', // Example date
        due_date: '2025-06-15', // Example date
        status: 'on_loan'
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id');
        expect(res.body.book.toString()).to.equal(bookId); // Ensure IDs match (check if your API populates or just sends ID)
        expect(res.body.borrower.toString()).to.equal(borrowerId);
        expect(res.body.status).to.equal('on_loan');
        loanId = res.body._id; // Store loan ID
        done();
      });
  });

  it('should get all loans', (done) => {
    request(app)
      .get('/api/loans')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1); // Should contain the created loan
        const foundLoan = res.body.find(loan => loan._id === loanId);
        expect(foundLoan).to.exist;
        expect(foundLoan.status).to.equal('on_loan');
        done();
      });
  });

  it('should get a loan by its ID', (done) => {
    expect(loanId).to.exist;
    request(app)
      .get(`/api/loans/${loanId}`) // Use the stored loan ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id').equal(loanId);
        expect(res.body.status).to.equal('on_loan');
        done();
      });
  });

  it('should update a loan (e.g., mark as returned) successfully', (done) => {
    expect(loanId).to.exist;
    request(app)
      .put(`/api/loans/${loanId}`) // Use the stored loan ID
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'returned',
        return_date: '2025-06-10' // Example return date
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('status').equal('returned');
        expect(res.body).to.have.property('return_date').to.exist; // Ensure return_date is set
        done();
      });
  });

  it('should delete a loan successfully', (done) => {
    expect(loanId).to.exist;
    request(app)
      .delete(`/api/loans/${loanId}`) // Use the stored loan ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Loan deleted successfully');

        // Verify deletion by attempting to retrieve the loan
        request(app)
          .get(`/api/loans/${loanId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404) // Expect Not Found for deleted resource
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});