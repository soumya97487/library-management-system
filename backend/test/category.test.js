const { chai, expect, app, connectAndClean, disconnect, loginAdmin, request } = require('./testHelper'); // Updated imports

describe('Category CRUD Tests', function() {
  this.timeout(5000); // Set timeout for the suite
  let adminToken;
  let categoryId;

  // Before all tests, setup environment: connect, clean, login admin
  before(async () => {
    await connectAndClean();
    adminToken = await loginAdmin();
  });

  // After all tests, disconnect from DB
  after(async () => {
    await disconnect();
  });

  it('should create a category successfully', (done) => {
    request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Thriller', description: 'Suspenseful and exciting stories' })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id');
        expect(res.body.name).to.equal('Thriller');
        categoryId = res.body._id; // Store category ID
        done();
      });
  });

  it('should get all categories', (done) => {
    request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1); // Should contain the created category
        const foundCategory = res.body.find(cat => cat._id === categoryId);
        expect(foundCategory).to.exist;
        expect(foundCategory.name).to.equal('Thriller');
        done();
      });
  });

  it('should get a category by its ID', (done) => {
    expect(categoryId).to.exist;
    request(app)
      .get(`/api/categories/${categoryId}`) // Use the stored category ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('_id').equal(categoryId);
        expect(res.body.name).to.equal('Thriller');
        done();
      });
  });

  it('should update a category', (done) => {
    expect(categoryId).to.exist;
    request(app)
      .put(`/api/categories/${categoryId}`) // Use the stored category ID
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Horror', description: 'Stories intended to scare, shock, or disgust' }) // New data
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('name').equal('Horror');
        expect(res.body).to.have.property('description').equal('Stories intended to scare, shock, or disgust');
        done();
      });
  });

  it('should delete a category', (done) => {
    expect(categoryId).to.exist;
    request(app)
      .delete(`/api/categories/${categoryId}`) // Use the stored category ID
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Category deleted successfully');

        // Verify deletion by attempting to retrieve the category
        request(app)
          .get(`/api/categories/${categoryId}`)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(404) // Expect Not Found for deleted resource
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});