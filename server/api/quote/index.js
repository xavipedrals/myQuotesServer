'use strict';

var express = require('express');
var controller = require('./quote.controller');

var router = express.Router();

//Order matters, don't put routes below /:id route
router.get('/', controller.index);
router.get('/all', controller.getAll);
router.get('/recent', controller.getRecent);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
