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

module.exports = router;
