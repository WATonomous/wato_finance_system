const router = require('express').Router()
const Mailjet = require('node-mailjet')

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
)

router.route('/').post(async (req, res) => {
    const { body: emailDetail } = req
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
                CC: [
                    {
                        Email: 'v2zheng@watonomous.ca',
                        Name: emailDetail?.CC,
                    },
                ],
                Subject: emailDetail.subject,
                HTMLPart: emailDetail.htmlPart,
            },
        ],
    })
    try {
        await mailRequest
        res.json(`successfully sent email!`)
    } catch (err) {
        res.status(500).send(`Uh oh bad email!: ${err}`)
    }
})

module.exports = router
