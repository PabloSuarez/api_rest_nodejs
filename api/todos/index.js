(function(){
  'use strict';

  let logger = require('../logger'),
      app = require('express')(),
      Todo = require('./model')


  app.route('/api/todo/:id?/')
    .all(function (req, res, next) {
      res.set('Content-Type', 'application/json')
      next()
    })


    /**
     * POST
    **/
    .post(function(req, res) {
      let newTodo = req.body.todo;
      newTodo.id = Date.now()

      Todo.create(newTodo, function (err, data) {
        if(!err){
          res.set('Content-Type','application/json')
          res.status(201)
          res.json({
            todo: newTodo
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
    .get(((req, res) => {
      let id = req.params.id

      if(!id) {
        Todo.find({}, function (err, data) {
          if(!err){
            return res
              .status(200)
              .json({
                todo: data
              })
          }
          return res
            .status(400)
            .json({message: 'no results'})
        })
      }else{
        Todo.findOne({id: id}, function (err, data) {
          if(!err && data){
            return res
              .status(200)
              .json({
                todo: data
              })
          }
          res.status(400)
          res.json({message: 'no results'})
        })
      }
    }))


    /**
     * PUT
    **/
    .put(function (req, res) {
      let id = req.params.id
      let newTodo = req.body.todo

      if(!id || !newTodo){
        return res
          .status(404)
          .json({message: 'required id as parameter and todo in body'})
      }

      newTodo.id = id

      Todo.update({'id':id}, newTodo, function(err, data) {
        if(!err){
          return res
            .status(200)
            .json({
              todo: newTodo
            })
        }
        res.status(304)
        res.json({message: 'not update'})
      })
    })


    /**
     * DELETE
    **/
    .delete(function (req, res) {
      let id = req.params.id

      if(!id){
        return res
          .status(404)
          .json({message: 'required id as parameter'})
      }

      Todo.findOne({'id':id}, function (err, data) {
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

        Todo.remove({'id':id}, function (err, data) {
          if(!err){
            return res
              .status(204)
              .send({message: 'deleted'})
          }
        })

      })
    })


  module.exports = app
})()
