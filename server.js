const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Route to Handle Contact Form Submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Server-side validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    const timestamp = new Date().toLocaleString();
    const logEntry = `\n=========================================\n[${timestamp}]\nFROM: ${name} <${email}>\nMESSAGE: \n${message}\n=========================================\n`;
    
    // Save to a local file database
    fs.appendFile('database.log', logEntry, (err) => {
        if (err) {
            console.error('Failed to write to database:', err);
            return res.status(500).json({ error: 'Failed to save message.' });
        }
        
        console.log(`\nNew Message Received on Backend from: ${email}`);
        
        // Respond back to frontend successfully
        res.status(200).json({ 
            success: true, 
            message: 'Your message was successfully received by the backend server!' 
        });
    });
});

app.listen(PORT, () => {
    console.log(`\n✅ High-End Portfolio Backend API is Live!`);
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
    console.log(`📡 Waiting for new contact form submissions...\n`);
});
