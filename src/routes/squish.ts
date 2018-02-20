const items = require("../data/items")

module.exports = (server, squish) => {
  const debug = require("debug")("routes:squish")

  // Squish webhooks
  server.post("/payments", squish.paymentHook)
  server.post("/refunds", squish.refundHook)

  // Squish routes
  server.get("/items", async (req, res) => res.send(items))
  server.post("/checkout", async (req, res) => {
    const amount = sumCart(req.body, items).toFixed(2)

    const invoice = await squish.create({
      amount,
      customer: "46700123456"
    })

    const token = await squish.paymentRequest({
      ...invoice,
      amount
    })
    const url = `swish://paymentrequest?token=${token}&callbackurl=${
      squish.swish.opts.paymentUrl
    }`
    res.send({ invoice, token: url })
  })
  server.get("/subscribe", (req, res) => {
    res
      .set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      })
      .flushHeaders()

    const handler = squish.subscribe(req.query.id, (err, invoice) => {
      res.write(eventMessage(invoice))
    })
    req.on("close", _ => handler.unsubscribe())
  })
}

function eventMessage(invoice) {
  console.log("eventMessage", invoice)

  return `id:${invoice.id}\ndata:${JSON.stringify(invoice)}\n\n`
}

function sumCart(cart, items) {
  return Object.keys(cart).reduce(
    (sum, key) => sum + cart[key] * +items.find(p => p.id === key).amount,
    0
  )
}
