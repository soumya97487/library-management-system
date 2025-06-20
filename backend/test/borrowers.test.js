const { chai, expect, app, connectAndClean, disconnect, loginAdmin, request } = require('./testHelper'); // Updated imports

describe('Borrower CRUD Tests', function() {
  this.timeout(5000); // Set timeout for the suite
  let adminToken, borrowerId; // Variables for ID and token

  // Before all tests, setup environment: connect, clean, login admin
  before(async () => {
    await connectAndClean();
    adminToken = await loginAdmin();
  });

  // After all tests, disconnect from DB
  after(async () => {
    await disconnect();
  });

  it('should create a borrower successfully', (done) => {
    request(app)
      .post('/api/borrowers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice.smith@example.com',
        phone_number: '555-111-2222',
        address: '123 Main St'
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id');
        expect(res.body.email).to.equal('alice.smith@example.com');
        borrowerId = res.body._id; // Store borrower ID
        done();
      });
  });

  it('should get all borrowers', (done) => {
    request(app)
      .get('/api/borrowers')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1); // Should contain the created borrower
        const foundBorrower = res.body.find(b => b._id === borrowerId);
        expect(foundBorrower).to.exist;
        expect(foundBorrower.first_name).to.equal('Alice');
        done();
      });
  });

  it('should get a borrower by their ID', (done) => {
    expect(borrowerId).to.exist;
    request(app)
      .get(`/api/borrowers/${borrowerId}`) // Use the stored borrower ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id').equal(borrowerId);
        expect(res.body.first_name).to.equal('Alice');
        done();
      });
  });

  it('should update a borrower successfully', (done) => {
    expect(borrowerId).to.exist;
    request(app)
      .put(`/api/borrowers/${borrowerId}`) // Use the stored borrower ID
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        first_name: 'Alicia',
        phone_number: '555-333-4444'
      }) // New data
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('first_name').equal('Alicia');
        expect(res.body).to.have.property('phone_number').equal('555-333-4444');
        done();
      });
  });

  it('should delete a borrower successfully', (done) => {
    expect(borrowerId).to.exist;
    request(app)
      .delete(`/api/borrowers/${borrowerId}`) // Use the stored borrower ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Borrower deleted successfully');

        // Verify deletion by attempting to retrieve the borrower
        request(app)
          .get(`/api/borrowers/${borrowerId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404) // Expect Not Found for deleted resource
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});