const express = require('express');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log the current directory to debug path issues
console.log('__dirname:', __dirname);
console.log('Files in __dirname:', fs.readdirSync(__dirname));

// Check if public folder exists in different locations
const possiblePaths = [
    path.join(__dirname, 'public'),
    path.join(__dirname, '..', 'public'),
    '/var/task/public',
];

let publicDir = null;
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        publicDir = p;
        console.log('Found public folder at:', p);
        break;
    }
}

if (!publicDir) {
    console.log('WARNING: No public folder found. Using __dirname as fallback.');
    publicDir = __dirname;
}

// Configure SES client
const sesClient = new SESClient({
    region: process.env.AWS_REGION || 'eu-north-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || '',
        secretAccessKey: process.env.AWS_SECRET_KEY || '',
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

// Serve static files
app.use(express.static(publicDir));

// Clean URL routes
const pageMap = {
    '/': 'index.html',
    '/contact': 'contact.html',
    '/about': 'about.html',
    '/product': 'Product.html',
    '/productdetails': 'ProductDetails.html',
};

Object.entries(pageMap).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        const filePath = path.join(publicDir, file);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            console.log('File not found:', filePath);
            res.status(404).send('Page not found');
        }
    });
});

// Case-insensitive fallback
app.get('*', (req, res) => {
    const requestedPage = req.path.replace(/^\//, '').replace(/\.html$/i, '').toLowerCase();

    const caseMap = {
        'contact': 'contact.html',
        'about': 'about.html',
        'product': 'Product.html',
        'productdetails': 'ProductDetails.html',
        'index': 'index.html',
    };

    if (caseMap[requestedPage]) {
        const filePath = path.join(publicDir, caseMap[requestedPage]);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }

    res.status(404).send('Page not found');
});

// DO NOT call app.listen() when running on Amplify/Lambda
// Amplify handles the server startup automatically
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // Running on Amplify - export the app
    module.exports = app;
} else {
    // Running locally
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
