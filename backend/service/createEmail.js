const Mailjet = require('node-mailjet')

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
)

const createEmail = async (emailDetail) => {
    const mailRequest = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: process.env.FINANCE_EMAIL,
                    Name: 'Finance System',
                },
                To: [
                    {
                        Email: 'v2zheng@watonomous.ca',
                        Name: emailDetail?.toName,
                    },
                ],
                Subject: emailDetail.subject,
                HTMLPart: emailDetail.htmlPart,
            },
        ],
    })
    try {
        await mailRequest
        res.status(200).json(`successfully sent email!`)
    } catch (err) {
        res.status(500).send(`Uh oh bad email!: ${err}`)
    }
}

module.exports = {
    createEmail,
}
