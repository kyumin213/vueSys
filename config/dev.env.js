'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST:"/api",
  API_ROOT: '"http://119.23.78.0:8080/api"',
})
