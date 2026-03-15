const express = require('express');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure SES client with IAM access keys
const sesClient = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

// Email endpoint
app.post('/send', async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;

    const params = {
        Source: 'no-reply@domaxtrading.web.lk',
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

// Root path → index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Clean URLs + case-insensitive handler
// Handles: /contact, /Contact, /CONTACT, /contact.html, /Contact.html etc.
app.get('*', (req, res) => {
    const publicDir = path.join(__dirname, 'public');
    let requestedPath = req.path;

    // Remove leading slash
    let pageName = requestedPath.replace(/^\//, '');

    // Remove .html extension if present
    pageName = pageName.replace(/\.html$/i, '');

    // If it's a static file request (has extension like .css, .js, .jpg, .png, .json, etc.)
    if (pageName.includes('.')) {
        // Try exact path first
        const exactPath = path.join(publicDir, requestedPath);
        if (fs.existsSync(exactPath)) {
            return res.sendFile(exactPath);
        }
        // File not found
        return res.status(404).send('File not found');
    }

    // For page requests (no extension), find the matching HTML file (case-insensitive)
    try {
        const files = fs.readdirSync(publicDir);
        const matchedFile = files.find(
            file => file.toLowerCase() === `${pageName.toLowerCase()}.html`
        );

        if (matchedFile) {
            return res.sendFile(path.join(publicDir, matchedFile));
        }
    } catch (err) {
        console.error('Error reading directory:', err);
    }

    // Nothing found → 404
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
