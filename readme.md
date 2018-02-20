# Messenger bot

```js
import Bot from "squish-bot"

const bot = new Bot({
  token: "<secret_key>",
  swish: {
    vendor: "<vendor>",
    cert: {
      pfx: "<path>",
      passphrase: "swish"
    }
  }
})

/*

*/
```

### Routes

#### Webhooks

```js
// Messenger
server.post("/facebook/receive")
server.get("/facebook/receive")

// Payments
server.post("/paymentrequests", squish.paymentHook)
server.post("/refunds", squish.refundHook)
```

#### Checkout

Render checkout page

* Subscribe to invoice changes to track payment
* Link to open Swish app with token

```js
EventSource(`subscribe?id=${invoice.id}`)
```

```js
server.get("/checkout", (req, res) => res.send(renderCheckout(req.params)))
server.get("/subscribe", sse, (req, res) =>
  squish.subscribe(req.params.id, invoice =>
    res.sse(`data: ${JSON.stringify(invoice)}\n\n`)
  )
)
```
