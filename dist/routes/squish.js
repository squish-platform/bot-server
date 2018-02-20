var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const items = require("../data/items");
module.exports = (server, squish, controller) => {
    const debug = require("debug")("routes:squish");
    // Squish webhooks
    server.post("/payments", squish.paymentHook);
    server.post("/refunds", squish.refundHook);
    // Squish routes
    server.get("/items", (req, res) => __awaiter(this, void 0, void 0, function* () { return res.send(items); }));
    server.get("/checkout", (req, res) => __awaiter(this, void 0, void 0, function* () {
        controller.storage.users.get(req.params.user, (err, user) => {
            console.log(user);
            console.log("Create invoice", user.cart);
            // const invoice = await squish.create({
            //   amount: "2.00",
            //   customer: "46733423424"
            // })
            // console.log(invoice)
            // const token = await squish.paymentRequest({
            //   ...invoice,
            //   amount: "2.00"
            // })
            // console.log(token)
            // // const token = "asd"
            // // const invoice = {
            // //   id: "foo"
            // // }
            // res.send(renderCheckout({ invoice, token }))
        });
    }));
    server.get("/subscribe", (req, res) => {
        res
            .set({
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive"
        })
            .flushHeaders();
        const handler = squish.subscribe(req.query.id, (err, invoice) => res.write(eventMessage(invoice)));
        // Mock payment
        // setTimeout(() => {
        //   squish
        //     .simulate({
        //       id: req.query.id,
        //       amount: "55.00",
        //       customer: "46700123123"
        //     })
        //     .then(res => {})
        //     .catch(err => debug(err))
        // }, 5000)
        // TODO: unsubscribe
        req.on("close", _ => handler.unsubscribe());
    });
};
function sumCart(cart, items) {
    return Object.keys(cart).reduce((sum, key) => sum + cart[key] * +items.find(p => p.id === key).amount, 0);
}
function eventMessage(invoice) {
    return `id:${invoice.id}\ndata:${JSON.stringify(invoice)}\n\n`;
}
// Template
function renderCheckout({ token, invoice }) {
    if (!token) {
        return "no token";
    }
    if (!invoice.id) {
        return "no invoice id";
    }
    const url = `swish://paymentrequest?token=${token}&callbackurl=${"https://squish.localtunnel.me/payments"}`;
    return `
<html>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<head>
<style type="text/css">

body {
  font-family: monospace;
  color: #333;
  padding: 6px 36px;
}
img {
  max-width: 100px;
  height: auto;
  display: block;
  margin: 0 auto;
}
.container {
  text-align: center;

}

</style>
</head>
  <body>
  <small><pre id="status">väntar på signering...</pre><small>

  <div class="container">
  <h3><pre id="status">Starta appen</pre><h3>

  </div>
		<a class="btn swish" href="${url}"><img src="https://i0.wp.com/telekomidag.se/files/2017/03/swish_logo_primary_rgb-2.png?fit=480%2C634" /></a>

		<script>
		window.open("${url}")

		if (!!window.EventSource) {
			var source = new EventSource('/subscribe?id=${invoice.id}')

			source.addEventListener('message', function(e) {
        console.log(JSON.parse(e.data))
        document.getElementById("status").textContent = JSON.stringify(JSON.parse(e.data), null, 2)
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
//# sourceMappingURL=squish.js.map