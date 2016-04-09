(function(){
  'use strict';

  let request = require('supertest-as-promised'),
      api = require('../server.js'),
      async = require('async'),
      host = process.env.API_TEST_HOST || api,
      logger = require('../api/logger'),
      mongoose = require('mongoose');

  request = request(host)


  function createTodo(data, callback) {
    // crear todo nueva
    request
      .post('/api/todo/')
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .end(callback)
  }

  function assertions(res, data, callback) {
    let todo = res.body.todo

    expect(todo).to.have.property('name', data.todo.name)
    expect(todo).to.have.property('description', data.todo.description)
    // expect(todo).to.have.property('id', data.todo.id)
    callback(null, todo)
  }

  function getTodo(res, callback) {
    id = res.body.todo.id

    request
      .get('/api/todo/' + id)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end(callback)
  }

  function deleteTodo(res, callback) {
    let id = res.body.todo.id

    request
      .delete('/api/todo/' + id)
      .expect(204)
      .end(callback)
  }


  describe('Coleccion de Todos [/todo]', function() {

    before(function(done) {
      mongoose.connect('mongodb://localhost/post-test', done)
    })

    after(function(done) {
      mongoose.disconnect(done)
      mongoose.models = {}
    })

    describe('POST creo una todo', function() {
      it('deberia crear una todo', function(done) {
        let data = {
          "todo": {
            "name": "Creo MI TODO #node #node-pro",
            "description": "Introduccion a clase"
          }
        }

        async.waterfall([
          function (callback) {
            createTodo(data, callback)
          },
          function (res, callback) {
            assertions(res, data, callback)
          }
        ], done)
      })
    })

    describe('PUT Modificar una todo', function () {
      it('deberia obtener una todo y modificarla', function (done) {
        let data = {
          "todo": {
            "name": "MI TODO #node #node-pro",
            "description": "Introduccion a clase"
          }
        }

        let newData = {
          "todo": {
            "name": "MI TODO 'Actualizada'",
            "description": "Utilizando PUT"
          }
        }
        let id;

        async.waterfall([
          function (callback) {
            createTodo(data, callback)
          },
          function (res, callback) {
            getTodo(res, callback)
          },
          function (res, callback){
            assertions(res, data, callback)
          },
          function (res, callback) {
            // Ya cree la todo, ahora la actualizo
            newData.todo.id = res.id
            request
              .put('/api/todo/' + res.id)
              .set('Accept', 'application/json')
              .send(newData)
              .expect(200)
              .end(callback)
          },
          function (res, callback) {
            assertions(res, newData, callback)
          }
        ], done)
      })
    })

    describe('DELETE de una todo', function () {
      it('Deberia eliminar una todo', function (done) {
        let data = {
          "todo": {
            "name": "MI TODO #node #node-pro",
            "description": "Introduccion a clase"
          }
        }

        let id

        async.waterfall([
          // create a todo
          function (callback) {
            createTodo(data, callback)
          },
          // delete this todo
          function (res, callback) {
            deleteTodo(res, callback)
            id = res.body.todo.id
          },
          // check that not exist after
          function (res, callback) {
            request
              .get('/api/todo/' + id)
              .expect(400)
              .end(callback)
          }
        ], done)
      })
    })

    describe('GET obtengo una TODO', function () {
      let data = {
        "todo": {
          "name": "MI TODO #node #node-pro",
          "description": "Introduccion a clase"
        }
      }

      it('deberia obtener una todo existente', function (done) {
        let id

        async.waterfall([
          function (callback) {
            createTodo(data, callback)
          },
          function (res, callback) {
            getTodo(res, callback)
          },
          function (res, callback){
            assertions(res, data, callback)
          }
        ], done)
      })

      it('deberia obtener todas las todos', function (done) {

        async.waterfall([
          function (callback) {
            createTodo(data, callback)
            createTodo(data, callback)
          }
        ], done())

        request
          .get('/api/todo/')
          .expect(200)
          .expect('Content-Type', /application\/json/)
          .then(function (res) {
            let body = res.body
            expect(body).to.have.property('todo')

            let bodyLength = Object.keys(body.todo).length
            expect(bodyLength).above(0)
          })
      })
    })

  })

})()
