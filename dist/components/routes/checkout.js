"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug")("routes/checkout");
const sse = require("server-sent-events");
function default_1(server, controller) {
    server.post("/paymentrequests", controller.squish.paymentHook);
    server.get("/subscribe", sse, (req, res) => {
        controller.squish.subscribe(req.params.id, invoice => res.sse(`data: ${JSON.stringify(invoice)}\n\n`));
    });
    server.get("/checkout", (req, res) => {
        const url = `swish://paymentrequest?token=${req.params.token}`;
        res.send(`
<html>

    <body>
        <a href="${url}">Starta Swish</a>
        väntar på signering...

        <script>
            window.open("${url}")

            if (!!window.EventSource) {
            var source = new EventSource('/subscribe?id=${req.params.id}')

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
</html>
        `);
    });
}
exports.default = default_1;
//# sourceMappingURL=checkout.js.map