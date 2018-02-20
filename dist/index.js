"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("server");
const fs = require("fs");
const path = require("path");
const Botkit = require("botkit");
const squish_node_1 = require("squish-node");
const thread = require("./thread");
const localtunnel = require("localtunnel");
const controller = Botkit.facebookbot({
    debug: true,
    app_secret: process.env.app_secret,
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token
    //   studio_command_uri: process.env.studio_command_uri
});
const bot = controller.spawn({});
console.log(bot.utterances);
// Setup Webserver
controller.setupWebserver(process.env.port || 3000, (err, server) => {
    controller.api.messenger_profile.domain_whitelist([
        "https://squish.localtunnel.me",
        "https://0.0.0.0"
    ]);
    // Setup Facebook thread settings
    controller.api.thread_settings.greeting(thread.greeting);
    controller.api.thread_settings.get_started(thread.get_started);
    controller.api.thread_settings.menu(thread.menu);
    // Setup Facebook webhooks
    controller.createWebhookEndpoints(server, bot, () => {
        console.log("ONLINE!");
        if (process.env.NODE_ENV !== "production") {
            const tunnel = localtunnel(process.env.port || 3000, { subdomain: "squish" }, (err, tunnel) => {
                if (err) {
                    console.log(err);
                    process.exit();
                }
                console.log("Your bot is available on the web at the following URL: " +
                    tunnel.url +
                    "/facebook/receive");
            });
            tunnel.on("close", function () {
                console.log("Your bot is no longer available on the web at the localtunnnel.me URL.");
                process.exit();
            });
        }
    });
    // Setup Squish
    const HOST = "https://squishbot.localtunnel.me";
    const squish = new squish_node_1.default({
        token: "<secret_key>",
        apiUrl: "https://squishapi.localtunnel.me",
        swish: {
            vendor: "1231181189",
            paymentUrl: `${HOST}/payments`,
            refundUrl: `${HOST}/refunds`,
            cert: {
                pfx: fs.readFileSync(path.join(__dirname + "/../ssl/1231181189.p12")),
                passphrase: "swish"
            }
        }
    });
    require("./routes/squish")(server, squish, controller);
    require("./skills/onboarding")(controller);
    require("./skills/ordering")(controller);
});
//# sourceMappingURL=index.js.map