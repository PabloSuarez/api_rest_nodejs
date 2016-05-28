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
app.route(`/api/${modelName}/:id?/`)
  .all((req, res, next) => {
    res.set('Content-Type', 'application/json')
    next()
  })


  /**
   * POST
  **/
  .post((req, res) => {
    let newModel = getModelRequest(req);
    console.log('newModel', newModel);

    newModel.id = Date.now();
    newModel.hide = false;

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
    let id = req.params.id

    if(!id) {
      Model.find({}, (err, data) => {
        if(!err){
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
    }else{
      Model.findOne({id: id}, (err, data) => {
        if(!err && data){
          return res
            .status(200)
            .json({
              data: data
            })
        }
        res.status(400)
        res.json({message: 'no results'})
      })
    }
  })


  /**
   * PUT
  **/
  .put((req, res) => {
    let id = req.params.id
    let newModel = getModelRequest(req);

    if(!id || !newModel){
      return res
        .status(404)
        .json({message: `required id as parameter and ${modelName} in body`})
    }

    newModel.id = id

    Model.update({'id':id}, newModel, (err, data) => {
      if(!err){
        return res
          .status(200)
          .json({
            data: newModel
          })
      }
      res.status(304)
      res.json({message: 'not update'})
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



  /**
   * DELETE ALL
  **/
  app.route(`/api/clean/${modelName}/`)
    .delete((req, res) => {

      Model.remove({}, (err, data) => {
        if(!err){
          return res
            .status(204)
            .send({data: data})
        }
      })
    });


module.exports = app
