module.exports = controller => {
    const debug = require("debug")("botkit:checkout");
    controller.hears(["CHECKOUT"], "message_received,facebook_postback", (bot, message) => {
        controller.storage.users.get(message.user, (err, user) => {
            console.log(user);
            if (user && user.name) {
                bot.reply(message, "Hello " + user.name + "!!");
            }
            else {
                bot.reply(message, "Hello.");
            }
        });
    });
};
//# sourceMappingURL=checkout.js.map