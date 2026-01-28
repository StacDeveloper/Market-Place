import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

const sendEmail = async ({ to, subject, html }) => {
    const response = await transport.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html
    })
    return response
}

export default sendEmail