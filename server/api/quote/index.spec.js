'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var quoteCtrlStub = {
  index: 'quoteCtrl.index',
  show: 'quoteCtrl.show',
  create: 'quoteCtrl.create',
  upsert: 'quoteCtrl.upsert',
  patch: 'quoteCtrl.patch',
  destroy: 'quoteCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var quoteIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './quote.controller': quoteCtrlStub
});

describe('Quote API Router:', function() {
  it('should return an express router instance', function() {
    expect(quoteIndex).to.equal(routerStub);
  });

  describe('GET /api/quotes', function() {
    it('should route to quote.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'quoteCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/quotes/:id', function() {
    it('should route to quote.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'quoteCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/quotes', function() {
    it('should route to quote.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'quoteCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/quotes/:id', function() {
    it('should route to quote.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'quoteCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/quotes/:id', function() {
    it('should route to quote.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'quoteCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/quotes/:id', function() {
    it('should route to quote.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'quoteCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
