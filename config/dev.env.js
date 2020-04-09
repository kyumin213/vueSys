'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST:"/api",
  API_ROOT: '"http://47.115.37.202:8090/"',
})
