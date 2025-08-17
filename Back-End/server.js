const express = require('express');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure SES client with IAM access keys
const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

app.post('/send', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    const params = {
        Source: 'no-reply@domaxtrading.web.lk', // verified SES email/domain
        Destination: { ToAddresses: [process.env.EMAIL_TO] },
        ReplyToAddresses: [email],
        Message: {
            Subject: { Data: `${subject} (from ${firstName} ${lastName})` },
            Body: {
                Text: {
                    Data: `Dear Sir/Madam,

My name is ${firstName} ${lastName}, regarding: ${subject}.

Message:
${message}

Please respond to my email: ${email}

Thank you,
${firstName} ${lastName}`,
                },
            },
        },
    };

    try {
        const data = await sesClient.send(new SendEmailCommand(params));
        console.log('Email sent:', data.MessageId);
        res.status(200).json({ success: true, messageId: data.MessageId });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost hi hi hi:${PORT}`);
});

