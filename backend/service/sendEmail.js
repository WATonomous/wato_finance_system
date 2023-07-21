const Mailjet = require('node-mailjet')

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
)

const sendEmail = async ({ To, Subject, HTMLPart }) => {
    try {
        await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.FINANCE_EMAIL,
                    },
                    To,
                    Subject,
                    HTMLPart,
                },
            ],
        })
        console.log('sendEmail success!')
    } catch (err) {
        console.log(`Uh oh! bad sendEmail: ${err}`)
    }
}

module.exports = {
    sendEmail,
}
