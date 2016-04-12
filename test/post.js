(() => {
  'use strict';

  let request = require('supertest-as-promised'),
      api = require('../server.js'),
      async = require('async'),
      host = process.env.API_TEST_HOST || api,
      logger = require('../api/logger'),
      mongoose = require('mongoose');

  request = request(host)


  let API_URL = '/api/post/';
  let MODEL   = 'post';


  let createModel = (data, callback) => {
    request
      .post(`${API_URL}`)
      .set('Accept', 'application/json')
      .send(data)
      .expect(201)
      .end(callback)
  }

  let assertions = (res, data, callback) => {
    let model = res.body.data;

    expect(model).to.have.property('name', data.name)
    expect(model).to.have.property('description', data.description)
    expect(model).to.have.property('hide', data.hide)
    callback(null, model)
  }

  let getModel = (res, callback) => {
    let id = res.body.data.id

    request
      .get(`${API_URL}${id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .end(callback)
  }

  let deleteTodo = (res, callback) => {
    let id = res.body.data.id

    request
      .delete(`${API_URL}${id}`)
      .expect(204)
      .end(callback)
  }


  describe(`Coleccion de ${MODEL} [/model]`, () => {

    before((done) => {
      mongoose.connect(`mongodb://localhost/${MODEL}-test`, done)
    })

    after((done) => {
      mongoose.disconnect(done)
      mongoose.models = {}
    })


    describe('POST creat new model', () => {
      it('should be create a model', (done) => {
        let data = {
          'post': {
            name: 'Creo MI TODO #node #node-pro',
            description: 'Introduccion a clase',
            hide: false
          }
        }

        async.waterfall([
          (callback) => {
            createModel(data, callback)
          },
          (res, callback) => {
            assertions(res, data, callback)
          }
        ], done)
      })
    })


    describe('PUT modify a model', function () {
      it('should be get a model and update it', function (done) {
        let data = {
          "post": {
            name: 'MI model #node #node-pro',
            description: 'Introduccion a clase',
            hide: false
          }
        }

        let newData = {
          "post": {
            name: "MI model 'Actualizada'",
            description: 'Utilizando PUT',
            hide: false
          }
        }
        let id;

        async.waterfall([
          function (callback) {
            createModel(data, callback)
          },
          function (res, callback) {
            getModel(res, callback)
          },
          function (res, callback){
            assertions(res, data, callback)
          },
          function (res, callback) {
            newData[MODEL].id = res.id
            request
              .put(`${API_URL}` + res.id)
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


    describe('DELETE a model', function () {
      it('should be DELETE a model', function (done) {
        let data = {
          post: {
            name: 'MI TODO #node #node-pro',
            description: 'Introduccion a clase'
          }
        }

        let id

        async.waterfall([
          // create a model
          function (callback) {
            createModel(data, callback)
          },
          // delete this model
          function (res, callback) {
            deleteTodo(res, callback)
            id = res.body.data.id
          },
          // check that not exist after
          function (res, callback) {
            request
              .get(`${API_URL}${id}`)
              .expect(400)
              .end(callback)
          }
        ], done)
      })
    })


    describe('GET obtengo una TODO', function () {
      let data = {
        post: {
          name: 'MI TODO #node #node-pro',
          description: 'Introduccion a clase',
          hide: false
        }
      }

      it('deberia obtener una model existente', function (done) {
        let id

        async.waterfall([
          function (callback) {
            createModel(data, callback)
          },
          function (res, callback) {
            getModel(res, callback)
          },
          function (res, callback){
            assertions(res, data, callback)
          }
        ], done)
      })

      it('should be get all models', function (done) {

        async.waterfall([
          function (callback) {
            createModel(data, callback)
            createModel(data, callback)
          },
          function (res, callback) {
            // .get(`${API_URL}`)
            request
              .get('/api/post/')
              // .expect(200)
              .expect('Content-Type', /application\/json/)
              .then(function (res) {
                let body = res.body

                expect(body).to.have.property('data')

                let bodyLength = Object.keys(body.data).length
                expect(bodyLength).above(0)
              })
          }
        ], done())
      })
    })

  })

})()
