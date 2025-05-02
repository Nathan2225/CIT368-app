const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.static(__dirname));
app.use(express.json());



// log
app.post('/log', (req, res) => {
    const { zip, lat, lon, forecast } = req.body;

    // log entry
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ZIP: ${zip}, Lat: ${lat}, Lon: ${lon}, Forecast: ${forecast}\n`;

    // write to weather log
    const logFilePath = path.join(__dirname, 'weather.log');

    fs.appendFile(logFilePath, logLine, (err) => {
        //error handle
        if (err) {
            console.error('Error writing to weather log:', err);
            return res.status(500).send('Logging failed');
        }
        res.status(200).send('Logged');
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});