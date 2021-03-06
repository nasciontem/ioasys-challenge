/**
 * Exports express router for ioasys API consumption, serving
 * as a middleware to the app root requisitions.
 */
const express = require('express')
const axios = require('axios')
const authentication = require('../middleware/authentication')

const ioasysRouter = express.Router()

/**
 * Enpoint for verifying if current user is logged in or not.
 */
ioasysRouter.get('/signed-in', (req, res) => {
  res.send({
    user: req.session.user ?? {},
    authenticated: req.session.authenticated ?? false
  })
})

/**
 * Endpoint for signing the user out, cleaning all data at server
 * storage.
 */
ioasysRouter.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

/**
 * Consumption of the login API, passing user email and password
 * as body, and retrieving user data and authorization tokans as
 * response. 
 */
ioasysRouter.post('/auth/sign-in', async (req, res) => {
  axios.post('https://books.ioasys.com.br/api/v1/auth/sign-in', req.body)
    .then(apiRes => {
      req.session.authorization = apiRes.headers.authorization
      req.session.refresh = apiRes.headers['refresh-token']
      req.session.user = apiRes.data
      req.session.authenticated = true
      req.session.save()

      res.send(apiRes.data)
    })
    .catch(error => res.send(error))
})

/**
 * Consumption of the books API, passing the current page number
 * and records by page as parameters, and retrieving the books as
 * response.
 */
ioasysRouter.get('/books', authentication.refresh, (req, res) => {
  axios.get(`https://books.ioasys.com.br/api/v1/books`, getBookOptionsFromRequest(req))
    .then(apiRes => res.send(apiRes.data))
    .catch(error => res.send(error))
})

function getBookOptionsFromRequest(req) {
  return {
    headers: { 'Authorization': req.headers.authorization },
    params: { page: req.query.page, amount: req.query.amount }
  }
}

module.exports = ioasysRouter