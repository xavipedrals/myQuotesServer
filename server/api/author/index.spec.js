'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var authorCtrlStub = {
  index: 'authorCtrl.index',
  show: 'authorCtrl.show',
  create: 'authorCtrl.create',
  upsert: 'authorCtrl.upsert',
  patch: 'authorCtrl.patch',
  destroy: 'authorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var authorIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './author.controller': authorCtrlStub
});

describe('Author API Router:', function() {
  it('should return an express router instance', function() {
    expect(authorIndex).to.equal(routerStub);
  });

  describe('GET /api/authors', function() {
    it('should route to author.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'authorCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/authors/:id', function() {
    it('should route to author.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'authorCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/authors', function() {
    it('should route to author.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'authorCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/authors/:id', function() {
    it('should route to author.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'authorCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/authors/:id', function() {
    it('should route to author.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'authorCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/authors/:id', function() {
    it('should route to author.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'authorCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
