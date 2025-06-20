const { chai, expect, app, connectAndClean, disconnect, loginAdmin, request } = require('./testHelper'); // Updated imports

describe('Author CRUD Tests', function() {
  this.timeout(5000); // Set a timeout for this test suite
  let adminToken; // To store the token obtained from loginAdmin()
  let authorId; // To store the ID of the created author for subsequent tests

  // Before all tests in this suite, connect to DB, clean it, and log in an admin
  before(async () => {
    await connectAndClean(); // Connects to DB and cleans it
    adminToken = await loginAdmin(); // Login as admin to get token for protected routes
  });

  // After all tests in this suite, disconnect from DB
  after(async () => {
    await disconnect();
  });

  it('should create an author successfully', (done) => {
    request(app) // Use supertest's request
      .post('/api/authors')
      .set('Authorization', `Bearer ${adminToken}`) // Set the authorization header with the admin token
      .send({ name: 'J.K. Rowling', bio: 'British author, best known for the Harry Potter series.' })
      .expect(201) // Expect a 201 Created status
      .end((err, res) => { // Standard .end() callback
        if (err) return done(err);
        expect(res.body).to.have.property('_id'); // Use res.body for response data
        expect(res.body.name).to.equal('J.K. Rowling');
        expect(res.body.bio).to.equal('British author, best known for the Harry Potter series.');
        authorId = res.body._id; // Store the ID of the created author for subsequent tests
        done();
      });
  });

  it('should get all authors', (done) => {
    request(app)
      .get('/api/authors')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200) // Expect a 200 OK status
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array'); // Use res.body
        expect(res.body.length).to.be.at.least(1); // Expect at least one author (the one we created)
        // Optionally, check if the created author is in the list
        const foundAuthor = res.body.find(author => author._id === authorId);
        expect(foundAuthor).to.exist;
        expect(foundAuthor.name).to.equal('J.K. Rowling');
        done();
      });
  });

  it('should get an author by their ID', (done) => {
    expect(authorId).to.exist; // Ensure authorId was set in the create test
    request(app)
      .get(`/api/authors/${authorId}`) // Use template literal for dynamic ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200) // Expect a 200 OK status
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id').equal(authorId); // Use res.body
        expect(res.body.name).to.equal('J.K. Rowling');
        done();
      });
  });

  it('should update an author successfully', (done) => {
    expect(authorId).to.exist;
    request(app)
      .put(`/api/authors/${authorId}`) // Use template literal for dynamic ID
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'J.K. Rowling (Updated)', bio: 'Author of the Harry Potter series, updated bio.' }) // New data for update
      .expect(200) // Expect a 200 OK status
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('name').equal('J.K. Rowling (Updated)'); // Use res.body
        expect(res.body).to.have.property('bio').equal('Author of the Harry Potter series, updated bio.');
        done();
      });
  });

  it('should delete an author successfully', (done) => {
    expect(authorId).to.exist;
    request(app)
      .delete(`/api/authors/${authorId}`) // Use template literal for dynamic ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200) // Expect a 200 OK status
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true; // Use res.body
        expect(res.body.message).to.equal('Author deleted successfully'); // Assert specific success message

        // Optional: Verify that the author is no longer accessible
        request(app)
          .get(`/api/authors/${authorId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404) // Expect a 404 Not Found status for a deleted resource
          .end((err, res) => {
            if (err) return done(err); // Check for errors in the verification request
            done();
          });
      });
  });

  // Example of a test requiring different role (e.g., member) or no authentication
  it('should not create an author if unauthorized (no token)', (done) => {
    request(app)
      .post('/api/authors')
      .send({ name: 'Unauthorized Author' }) // No headers sent
      .expect(401) // Expect 401 Unauthorized
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).to.equal('No token, authorization denied'); // Adjust message based on your API
        done();
      });
  });
});