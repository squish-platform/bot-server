module.exports = controller => {
    const debug = require("debug")("botkit:onboarding");
    controller.hears(["get_started"], (bot, message) => {
        debug("Starting an onboarding experience!");
        controller.storage.users.get(message.user, (err, user) => {
            console.log(user);
            if (!user) {
                controller.storage.users.save(message.user, { id: message.user, cart: new Cart() }, err => {
                    debug(err);
                });
            }
            bot.reply(message, message.user);
        });
    });
};
//# sourceMappingURL=onboarding.js.map