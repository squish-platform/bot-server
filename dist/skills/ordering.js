// convo.addMessage(sendItems(items, user), "default")
// convo.addQuestion(
//   askHowMany(items, user),
//   (res, convo) => {
//     // name has been collected...
//     convo.gotoThread("default")
//   },
//   { key: "quantity" },
//   "default"
// )
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// convo.transitionTo("the_end", "Well I think I am all done.")
module.exports = (controller) => __awaiter(this, void 0, void 0, function* () {
    const { Cart } = require("../cart");
    const debug = require("debug")("botkit:checkout");
    const items = require("../data/items");
    controller.hears(["rensa", "betala"], "message_received,facebook_postback", (bot, message) => {
        bot.startConversation(message, (err, convo) => {
            if (!err) {
                controller.storage.users.get(message.user, (err, user) => {
                    controller.storage.users.save({ cart: new Cart() }, err => {
                        debug(err);
                    });
                });
            }
        });
    });
    controller.hears(["hej", "beställ"], "message_received,facebook_postback", (bot, message) => {
        console.log("ORDERING");
        bot.startConversation(message, (err, convo) => {
            if (!err) {
                const cart = new Cart();
                convo.ask(showItems(items, message.user), (res, convo) => {
                    console.log("message.user.id", message.user);
                    const item = res.payload;
                    console.log(item);
                    controller.storage.users.save({ id: message.user, cart: new Cart() }, err => {
                        debug(err);
                    });
                    // convo.ask(askHowMany(), (res, convo) => {
                    //   console.log(res)
                    //   convo.setVar("cart", cart.add(res.payload, item))
                    //   convo.next()
                    // })
                    convo.transitionTo("default", "Var det allt?");
                    // convo.repeat()
                    convo.next();
                });
            }
        });
    });
    function showItems(items, user) {
        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: items
                        .map(item => ({
                        title: item.name,
                        image_url: item.image,
                        subtitle: `${item.amount}\n\n${item.description}`,
                        buttons: [
                            {
                                type: "postback",
                                title: `Lägg till ${item.name}`,
                                payload: item.id
                            },
                            {
                                type: "postback",
                                title: "Rensa",
                                payload: "RESET"
                            },
                            {
                                type: "web_url",
                                title: "Till betalning",
                                url: `https://squish.localtunnel.me/checkout?user=${user}`,
                                messenger_extensions: true,
                                webview_height_ratio: "compact",
                                webview_share_button: "hide"
                            }
                        ]
                    }))
                }
            }
        };
    }
    function askHowMany() {
        return {
            template_type: "button",
            text: "Hur många?",
            quick_replies: ["En", "Två", "Tre"].map((title, i) => ({
                type: "postback",
                title,
                payload: i + 1
            }))
        };
    }
});
//# sourceMappingURL=ordering.js.map