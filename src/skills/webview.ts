module.exports = async controller => {
  const debug = require("debug")("botkit:checkout")

  controller.hears(
    ["h"],
    "message_received,facebook_postback",
    (bot, message) => {
      bot.startConversation(message, (err, convo) => {
        if (!err) {
          convo.say({
            attachment: {
              type: "template",
              payload: {
                template_type: "generic",
                elements: [
                  {
                    title: "Burrito Bros",
                    image_url:
                      "https://scontent.fgse1-1.fna.fbcdn.net/v/t31.0-8/19400274_752665731525118_1737977948184626420_o.jpg?oh=6d2a82d9520d233f780e5dd98150f28d&oe=5B0E66DD",
                    subtitle:
                      "Burrito Bros inspireras av den mexikanska och amerikanska känslan. Vårt mål är att servera de godaste Burritosarna i stan, om vi nu inte redan gör det?",
                    default_action: {
                      type: "web_url",
                      url: `https://squishclient.localtunnel.me`,
                      messenger_extensions: true,
                      webview_height_ratio: "full"
                    },
                    buttons: [
                      {
                        type: "web_url",
                        title: "Till butik",
                        url: `https://squishclient.localtunnel.me`,
                        messenger_extensions: true,
                        webview_height_ratio: "tall",
                        webview_share_button: "hide"
                      }
                    ]
                  }
                ]
              }
            }
          })

          convo.next()
        }
      })
    }
  )
}
