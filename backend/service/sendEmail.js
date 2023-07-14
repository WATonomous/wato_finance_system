const Mailjet = require('node-mailjet')

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
)

const getTicketLinkHTML = (ticketPath) => {
    return `
        <div>
            <br />
            View the ticket here: 
            <a
                href=${process.env.REACT_APP_FRONTEND_URL}${ticketPath}
            >
                ${process.env.REACT_APP_FRONTEND_URL}${ticketPath}
            </a>
        </div>
    `
}

const sendEmail = async (emailDetail) => {
    try {
        const res = await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: process.env.FINANCE_EMAIL,
                    },
                    To: emailDetail.To,
                    Subject: emailDetail.Subject,
                    HTMLPart:
                        emailDetail.HTMLPart +
                        getTicketLinkHTML(emailDetail.ticketPath),
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
