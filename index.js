const express = require('express');
const fs = require('fs');
const app = express();
const port = 2024;
const login = require('fca-unofficial');

let a = {}; // Initialize data variable

// Global handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Read the AppState JSON synchronously
try {
    const appState = JSON.parse(fs.readFileSync('./nexusState.json', 'utf8'));

    // Initialize login asynchronously
    login({ appState }, (err, api) => {
        if (err) {
            console.error('Error logging in:', err);
            return;
        }

        // Set up 'a' after successful login
        a = {
            send: function(message, id) {
                api.sendMessage(message, id);
            }
        };
        api.listenMqtt((err, event) => {

            if (err) return;
            if (event.body === "/getID") {
                if (!event.isGroup) {
                api.sendMessage(`[ 𝖭𝖤𝖷𝖴𝖲 𝖠𝖫𝖳 ]\n- 𝖳𝖧𝖨𝖲 𝖨𝖲 𝖠𝖭 𝖲𝖤𝖱𝖵𝖨𝖢𝖤 𝖡𝖮𝖳 𝖠𝖭𝖣 𝖢𝖠𝖭'𝖳 𝖡𝖤 𝖴𝖲𝖤 𝖮𝖴𝖳𝖲𝖨𝖣𝖤 𝖮𝖥 𝖳𝖧𝖤 𝖦𝖱𝖮𝖴𝖯.\n[ 𝖣𝖠𝖳𝖠 ]\n𝖴𝖲𝖤𝖱 𝖨𝖣: ${event.senderID}`, event.threadID)
                } else {
                        api.sendMessage(`[ 𝖲𝖯𝖤𝖢𝖨𝖠𝖫 𝖨𝖣 ]\n𝖨𝖣: ${event.senderID} \n𝖭𝖮𝖳𝖤: 𝖳𝖧𝖨𝖲 𝖨𝖲 𝖮𝖭𝖫𝖸 𝖴𝖲𝖤𝖣 𝖥𝖮𝖱 𝖵𝖤𝖱𝖨𝖥𝖨𝖢𝖠𝖳𝖨𝖮𝖭.`, event.threadID)
                }
        }
        })

        console.log('Logged in successfully.');
    });
} catch (err) {
    console.error('Error reading or parsing nexusState.json:', err);
}

// Routes
app.get('/send', (req, res) => {
    const msg = req.query.msg;
    const id = req.query.id;
    try {
        if (a.send) {
            a.send(msg, id)
                res.send('Message sent.');
        } else {
            res.status(500).send('API not initialized.');
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get('/', (req, res) => {
    res.send('Hey!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});