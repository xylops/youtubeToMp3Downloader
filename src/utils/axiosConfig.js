const axios = require('axios')
const storage = require('electron-json-storage')
const _ = require('lodash')

const INTERVAL_MS = 10
let PENDING_REQUESTS = 0
let MAX_REQUESTS_COUNT = 0
storage.get('maxConnection', (err, num) => {
    if(_.isEmpty(num)){
        storage.set('maxConnection', 5, (err) => {console.log(err)})
        MAX_REQUESTS_COUNT = 5
    } else {
        MAX_REQUESTS_COUNT = num
    }
})

// create new axios instance
const api = axios.create({})
/**
 * Axios Request Interceptor
 */
api.interceptors.request.use(function (config) {
  return new Promise((resolve, reject) => {
    let interval = setInterval(() => {
      if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
        PENDING_REQUESTS++
        clearInterval(interval)
        resolve(config)
      } 
    }, INTERVAL_MS)
  })
})
/**
 * Axios Response Interceptor
 */
api.interceptors.response.use(function (response) {
  PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
  return Promise.resolve(response)
}, function (error) {
  PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
  return Promise.reject(error)
})

module.exports = api