'use strict';

var app = require('../..');
import request from 'supertest';

var newAuthor;

describe('Author API:', function() {
  describe('GET /api/authors', function() {
    var authors;

    beforeEach(function(done) {
      request(app)
        .get('/api/authors')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          authors = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(authors).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/authors', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/authors')
        .send({
          name: 'New Author',
          info: 'This is the brand new author!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newAuthor = res.body;
          done();
        });
    });

    it('should respond with the newly created author', function() {
      expect(newAuthor.name).to.equal('New Author');
      expect(newAuthor.info).to.equal('This is the brand new author!!!');
    });
  });

  describe('GET /api/authors/:id', function() {
    var author;

    beforeEach(function(done) {
      request(app)
        .get(`/api/authors/${newAuthor._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          author = res.body;
          done();
        });
    });

    afterEach(function() {
      author = {};
    });

    it('should respond with the requested author', function() {
      expect(author.name).to.equal('New Author');
      expect(author.info).to.equal('This is the brand new author!!!');
    });
  });

  describe('PUT /api/authors/:id', function() {
    var updatedAuthor;

    beforeEach(function(done) {
      request(app)
        .put(`/api/authors/${newAuthor._id}`)
        .send({
          name: 'Updated Author',
          info: 'This is the updated author!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedAuthor = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAuthor = {};
    });

    it('should respond with the original author', function() {
      expect(updatedAuthor.name).to.equal('New Author');
      expect(updatedAuthor.info).to.equal('This is the brand new author!!!');
    });

    it('should respond with the updated author on a subsequent GET', function(done) {
      request(app)
        .get(`/api/authors/${newAuthor._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let author = res.body;

          expect(author.name).to.equal('Updated Author');
          expect(author.info).to.equal('This is the updated author!!!');

          done();
        });
    });
  });

  describe('PATCH /api/authors/:id', function() {
    var patchedAuthor;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/authors/${newAuthor._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Author' },
          { op: 'replace', path: '/info', value: 'This is the patched author!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedAuthor = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedAuthor = {};
    });

    it('should respond with the patched author', function() {
      expect(patchedAuthor.name).to.equal('Patched Author');
      expect(patchedAuthor.info).to.equal('This is the patched author!!!');
    });
  });

  describe('DELETE /api/authors/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/authors/${newAuthor._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when author does not exist', function(done) {
      request(app)
        .delete(`/api/authors/${newAuthor._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
