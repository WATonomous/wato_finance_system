const Mailjet = require('node-mailjet')

const mailjet = Mailjet.apiConnect(
    process.env.WATO_FINANCE_MAILJET_API_KEY,
    process.env.WATO_FINANCE_MAILJET_SECRET_KEY
)

const sendEmail = async ({ Subject, HTMLPart, To, Cc = [] }) => {
    console.log('📧 Subject:', Subject)
    console.log('📬 Recipients:', To)
    try {
        await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.WATO_FINANCE_FINANCE_EMAIL,
                    },
                    To,
                    Cc,
                    Subject,
                    HTMLPart,
                },
            ],
        })
        console.log('✅ sendEmail success!')
    } catch (err) {
        console.log(`❌ sendEmail failed: ${err}`)
    }
}

module.exports = {
    sendEmail,
}
