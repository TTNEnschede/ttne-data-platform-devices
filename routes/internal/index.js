'use strict'

const Router        = require('restify-router').Router;
const router        = new Router();

/**
 * @api {get} /internal/healthy Healthy check
 * @apiVersion 1.0.0
 * @apiHeader {String} apikey An access-key for health checking.
 * @apiDescription With this api end point the healthy of the service can be tested.
 *
 * @apiGroup Internal
 * @apiSuccess {String} result The result message.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      result: "healthy"
 *    }
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 400 Bad Request
 */
router.get('/healthy', function (req, res, next) {
  res.send({ result: 'healthy' })
  next()
})

/**
 * @api {get} /internal/kill Kill the service
 * @apiVersion 1.0.0
 * @apiHeader {String} apikey An access-key for health checking.
 * @apiDescription With this api end point the service can be killed.
 *
 * @apiGroup Internal
 * @apiSuccess {String} result The result message.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      result: "dying"
 *    }
 * @apiErrorExample {json} Errors
 *    HTTP/1.1 500 Internal Server Error
 *    HTTP/1.1 400 Bad Request
 */
router.get('/kill', function (req, res, next) {
  res.send({ result: 'dying' })
  next()
  process.exit(0)
})

module.exports = router;
