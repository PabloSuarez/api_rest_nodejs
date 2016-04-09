(function(){
  'use strict';

  /**
   * Module dependencies
  **/
  let express = require('express'),
      logger  = require('./api/logger'),
      bodyParser  = require('body-parser'),
      mongoose    = require('mongoose'),
      cors        = require('cors'),
      todoRoutes  = require('./api/todos'),
      logUrl      = require('./api/utils/log')


  /**
   * LOCALS VARS
  **/
  let server  = module.exports = express()
  let port    = process.env.PORT || 3000


  /**
   * CONFIGURATIONS
   *
   * enable request origin form localhost
  **/
  server.use(cors({allowedOrigins: ['*']}))

  /**
   * where are the assets?
  **/
  server.use(express.static('client/public'))

  /**
  * parse json requests
  **/
  server.use(bodyParser.json())
  server.use(bodyParser.urlencoded({ extended: false }))

  /**
  * custom log
  **/
  server.use(logUrl)

  /**
  * ROUTER
  **/
  server.use(todoRoutes)

  /**
  * START SERVER if we're not someone else's dependency
  **/
  if (!module.parent) {
    mongoose.connect('mongodb://localhost/api_rest_nodejs', function() {
      server.listen(port, function() {
        logger.info('Server on http://localhost:%s/', port)
      })
    })
  }
})();
