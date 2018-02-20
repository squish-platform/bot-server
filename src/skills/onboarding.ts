module.exports = controller => {
  const debug = require("debug")("botkit:onboarding")

  controller.hears(["get_started"], (bot, message) => {
    debug("Starting an onboarding experience!")

    controller.storage.users.get(message.user, (err, user) => {
      bot.reply(message, message.user)
    })
  })
}
