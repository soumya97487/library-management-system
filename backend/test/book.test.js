const { chai, expect, app, connectAndClean, disconnect, loginAdmin, request } = require('./testHelper'); // Updated imports

describe('Book CRUD Tests', function() {
  this.timeout(10000); // Increased timeout
  let adminToken, bookId, authorId, categoryId; // Variables for IDs and token

  // Before all tests, setup environment: connect, clean, login admin, create dependent entities
  before(async () => {
    await connectAndClean(); // Connects to DB and starts server
    adminToken = await loginAdmin(); // Login as admin to get token

    // Create an author first, as books depend on authors
    const authorRes = await request(app)
      .post('/api/authors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Book Author', bio: 'Author for book tests' })
      .expect(201);
    authorId = authorRes.body._id; // Store author ID

    // Create a category first, as books depend on categories
    const categoryRes = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Category', description: 'Category for book tests' })
      .expect(201);
    categoryId = categoryRes.body._id; // Store category ID
  });

  // After all tests, disconnect from DB
  after(async () => {
    await disconnect();
  });

  it('should create a book successfully', (done) => {
    request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'The Alchemist',
        isbn: '978-0062315007',
        publication_year: 1988,
        publisher: 'HarperOne',
        authors: [authorId], // Link to the created author
        categories: [categoryId] // Link to the created category
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id');
        expect(res.body.title).to.equal('The Alchemist');
        expect(res.body.isbn).to.equal('978-0062315007');
        expect(res.body.authors[0].toString()).to.equal(authorId); // Check linked author
        expect(res.body.categories[0].toString()).to.equal(categoryId); // Check linked category
        bookId = res.body._id; // Store book ID
        done();
      });
  });

  it('should get all books', (done) => {
    request(app)
      .get('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1); // Should contain the created book
        const foundBook = res.body.find(book => book._id === bookId);
        expect(foundBook).to.exist;
        expect(foundBook.title).to.equal('The Alchemist');
        done();
      });
  });

  it('should get a book by its ID', (done) => {
    expect(bookId).to.exist;
    request(app)
      .get(`/api/books/${bookId}`) // Use the stored book ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id').equal(bookId);
        expect(res.body.title).to.equal('The Alchemist');
        done();
      });
  });

  it('should update a book successfully', (done) => {
    expect(bookId).to.exist;
    request(app)
      .put(`/api/books/${bookId}`) // Use the stored book ID
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'The Alchemist (Revised Edition)',
        publication_year: 2000, // Update year
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('title').equal('The Alchemist (Revised Edition)');
        expect(res.body).to.have.property('publication_year').equal(2000);
        done();
      });
  });

  it('should delete a book successfully', (done) => {
    expect(bookId).to.exist;
    request(app)
      .delete(`/api/books/${bookId}`) // Use the stored book ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Book deleted successfully');

        // Verify deletion by attempting to retrieve the book
        request(app)
          .get(`/api/books/${bookId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404) // Expect Not Found for deleted resource
          .end((err, res) => {
            if (err) return done(err); // Check for errors in the verification request
            done();
          });
      });
  });
});