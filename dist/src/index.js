"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("server");
const Botkit = require("botkit");
const squish_node_1 = require("squish-node");
const thread = require("./thread");
const controller = Botkit.facebookbot({
    debug: true,
    app_secret: process.env.app_secret,
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_token: process.env.studio_token
    //   studio_command_uri: process.env.studio_command_uri
});
const bot = controller.spawn({});
// Setup Webserver
controller.setupWebserver(process.env.port || 3000, (err, server) => {
    // Setup Facebook thread settings
    controller.api.thread_settings.greeting(thread.greeting);
    controller.api.thread_settings.get_started(thread.get_started);
    controller.api.thread_settings.menu(thread.menu);
    // Setup Facebook webhooks
    controller.createWebhookEndpoints(server, bot, () => {
        console.log("ONLINE!");
    });
    // Setup Squish
    const squish = new squish_node_1.default({
        token: "<secret_key>",
        swish: {
            vendor: "1231181189",
            callbackUrl: `https://${controller.config.hostname}/hooks/payments`,
            cert: {
                pfx: __dirname + "/ssl/1231181189.p12",
                passphrase: "swish"
            }
        }
    });
    // Squish webhooks
    server.post("/payments", squish.paymentHook);
    server.post("/refunds", squish.refundHook);
    // Squish routes
    server.get("/checkout", (req, res) => res.send(renderCheckout(req.params)));
    server.get("/subscribe", (req, res) => {
        res
            .set({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive"
        })
            .flushHeaders();
        squish.subscribe(req.params.id, invoice => res.write(`id:${invoice.id}\ndata:${JSON.stringify(invoice)}\n\n`));
        // TODO: unsubscribe
        // req.on("close", _ => squish.unsubscribe(req.params.id))
    });
});
// Template
function renderCheckout(invoice) {
    const url = `swish://paymentrequest?token=${invoice.token}`;
    return `
<html>
	<body>
		<a href="${url}">Starta Swish</a>
		väntar på signering...
		
		<script>
		window.open("${url}")
		
		if (!!window.EventSource) {
			var source = new EventSource('/subscribe?id=${invoice.id}')
			
			source.addEventListener('message', function(e) {
				console.log(e.data)
			}, false)
			
			source.addEventListener('open', function(e) {
				console.log("Connection was opened")
			}, false)
			
			source.addEventListener('error', function(e) {
				if (e.readyState == EventSource.CLOSED) {
					console.log("Connection was closed")
				}
			}, false)
		}
		</script>
	</body>
</html>`;
}
//# sourceMappingURL=index.js.map