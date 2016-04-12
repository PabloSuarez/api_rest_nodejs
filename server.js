'use strict';

/**
 * Module dependencies
**/
let express = require('express'),
    logger  = require('./api/logger'),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    cors        = require('cors'),
    postsRoutes  = require('./api/postsApp'),
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
// server.use(logUrl)

/**
* ROUTER
**/
server.use(postsRoutes)

/**
* START SERVER if we're not someone else's dependency
**/
if (!module.parent) {
  mongoose.connect('mongodb://localhost/post-js', () => {
    logger.info('Connected with mongoose on post-js')
    server.listen(port, () => {
      logger.info('Server on http://localhost:%s/', port)
    })
  })
}
