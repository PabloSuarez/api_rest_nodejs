'use strict';

let app = require('express')(),
    Model = require('./model'),
    config = require('./config');


/**
 * Read CONFIGURATIONS
**/
let modelName = config.modelName;


/**
 * Read post object
**/
let getModelRequest = (req) => req.body[`${modelName}`];


/**
 * set Route
**/
app
  .route(`/api/${modelName}/:id?/`)
  // .all((req, res, next) => {
  //   res.set('Content-Type', 'application/json')
  //   next()
  // })


  /**
   * POST
  **/
  .post((req, res) => {
    let newModel = getModelRequest(req);
    console.log('newModel', newModel);

    Model.create(newModel, (err, data) => {
      if(!err){
        res.set('Content-Type','application/json')
        res.status(201)
        res.json({
          data: newModel
        })
        return
      }
      res.status(500)
      res.json({message: 'no results'})
    })
  })


  /**
   * GET
  **/
  .get((req, res) => {
      Model.find({}, (err, data) => {
        if(!err) {
          return res
            .status(200)
            .json({
              data: data
            })
        }

        return res
          .status(400)
          .json({message: 'no results'})
      })
  })


  /**
   * DELETE
  **/
  .delete((req, res) => {
    let id = req.params.id

    if(!id){
      return res
        .status(404)
        .json({message: 'required id as parameter'})
    }

    Model.findOne({'id':id}, (err, data) => {
      if(err){
        return res
          .status(500)
          .json({message: 'not fund'})
      }

      if(!data){
        return res
          .status(404)
          .json({message: 'no results'})
      }

      Model.remove({'id':id}, (err, data) => {
        if(!err){
          return res
            .status(204)
            .send({message: 'deleted'})
        }
      })
    })
  });


module.exports = app
