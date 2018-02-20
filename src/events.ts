var request = require("request")
var debug = require("debug")("botkit:subscribe_events")

module.exports = controller => {
  debug("Subscribing to Facebook events...")
  request.post(
    "https://graph.facebook.com/me/subscribed_apps?access_token=" +
      controller.config.access_token,
    (err, res, body) => {
      if (err) {
        debug("Could not subscribe to page messages!")
        throw new Error(err)
      } else {
        debug("Successfully subscribed to Facebook events:", body)
        controller.startTicking()
      }
    }
  )
}
