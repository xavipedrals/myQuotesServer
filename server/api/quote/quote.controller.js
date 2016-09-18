/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/quotes              ->  index
 * POST    /api/quotes              ->  create
 * GET     /api/quotes/:id          ->  show
 * PUT     /api/quotes/:id          ->  upsert
 * PATCH   /api/quotes/:id          ->  patch
 * DELETE  /api/quotes/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Quote from './quote.model';

var request = require('request');

/** AUX FUNCTIONS **/
function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

/**ENDPOINTS**/
// Gets a list of Quotes
export function index(req, res) {
  return Quote.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getAll(req, res) {
  Quote.find()
      .then(respondWithResult(res))
      .catch(handleError(res));

  // Quote.find(function (err, quotes) {
  //   return res.status(200).json(quotes);
  // });

}

// Gets a list of the most recent 10 Quotes
export function getRecent(req, res) {
  if (typeof req.query.skip !== 'undefined' && req.query.skip && req.query.skip > 0) {
    Quote.find({}).limit(5).skip(req.query.skip)
        .then(respondWithResult(res))
        .catch(handleError(res));
  }
  else {
    Quote.find({}).limit(5)
        .then(respondWithResult(res))
        .catch(handleError(res));
  }
}

// Gets a single Quote from the DB
export function show(req, res) {
  return Quote.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Quote in the DB
export function create(req, res) {

  if (typeof req.body.background_color !== 'undefined' && req.body.background_color){
    Quote.create(req.body)
        .then(respondWithResult(res, 201))
        .catch(handleError(res));
  }
  else {
    var mashapeKey = 'hDNI5fg8wemshbHH6EWyg8xXdBTGp1qv7isjsnjJWy4o3Yxfr2';
    request({
      url: 'https://apicloud-colortag.p.mashape.com/tag-url.json', //URL to hit
      qs: {url: req.body.background_img}, //Query string data
      method: 'GET', //Specify the method
      headers: { //We can define headers too
        'Content-Type': 'application/json',
        'X-Mashape-Key': mashapeKey
      }
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var obj = JSON.parse(body);
        //This is the dominant color
        console.log(obj.tags[0]);

        var newQoute = Quote({
          text: req.body.text,
          background_img: req.body.background_img,
          background_color: obj.tags[0].color,
          author_name: req.body.author_name,
          author_photo: req.body.author_photo
        });
        Quote.create(newQoute)
            .then(respondWithResult(res, 201))
            .catch(handleError(res));
      }
    });

  }
}

// Upserts the given Quote in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Quote.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Quote in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Quote.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Quote from the DB
export function destroy(req, res) {
  return Quote.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
