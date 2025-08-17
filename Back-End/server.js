const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.post('/send', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;


    const transporter = nodemailer.createTransport({
        host: process.env.SES_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SES_USER,
            pass: process.env.SES_PASS
        }
    });

    const mailOptions = {
        from: `"${firstName} ${lastName}" <no-reply@domaxtrading.web.lk>`,
        to: process.env.EMAIL_TO,
        subject: `${subject} (from ${firstName} ${lastName})`,
        text: `Dear Sir/Madam,

My name is ${firstName} ${lastName}, and I am writing to inquire about ${subject}.

My question is as follows: ${message}

I would be grateful if you could respond to my query at your earliest convenience via email at ${email}.

Thank you for your time and assistance.

Sincerely,  
${firstName} ${lastName}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
