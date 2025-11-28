// server.js

require('dotenv').config(); // Load variables from .env file
const express = require('express');
const path = require('path');
// No need to import cors if not used for specific configurations, express.static is enough for same-origin

const app = express();
const PORT = 3000;

// Serve your static files (HTML, CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Securely load Kintone credentials and Field Codes from the .env file
const {
    KINTONE_SUBDOMAIN,
    KINTONE_APP_ID,
    KINTONE_API_TOKEN,
    FIELD_CODE_EMPLOYMENT_STATUS,
    FIELD_CODE_CREATED_DATETIME,
    FIELD_CODE_JOB_CODE
} = process.env;

const KINTONE_BASE_URL = `https://${KINTONE_SUBDOMAIN}/k/v1/records.json?app=${KINTONE_APP_ID}`;

// API endpoint for your website to call to get all open jobs
app.get('/api/jobs', async (req, res) => {
    const query = `${FIELD_CODE_EMPLOYMENT_STATUS} in ("Open") order by ${FIELD_CODE_CREATED_DATETIME} desc`;
    const kintoneUrl = `${KINTONE_BASE_URL}&query=${encodeURIComponent(query)}`;

    try {
        // CORRECTED: Dynamically import node-fetch
        const fetch = (await import('node-fetch')).default;

        const kintoneResponse = await fetch(kintoneUrl, {
            headers: { 'X-Cybozu-API-Token': KINTONE_API_TOKEN }
        });

        if (!kintoneResponse.ok) {
            const error = await kintoneResponse.json();
            throw new Error(error.message || 'Failed to fetch from Kintone');
        }
        const data = await kintoneResponse.json();
        res.json({ success: true, data: data.records });
    } catch (error) {
        console.error('API Error (/api/jobs):', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to get the details of a single job
app.get('/api/job/:jobCode', async (req, res) => {
    const { jobCode } = req.params;
    const query = `${FIELD_CODE_JOB_CODE} = "${jobCode}" and ${FIELD_CODE_EMPLOYMENT_STATUS} in ("Open") limit 1`;
    const kintoneUrl = `${KINTONE_BASE_URL}&query=${encodeURIComponent(query)}`;

    try {
        // CORRECTED: Dynamically import node-fetch
        const fetch = (await import('node-fetch')).default;

        const kintoneResponse = await fetch(kintoneUrl, {
            headers: { 'X-Cybozu-API-Token': KINTONE_API_TOKEN }
        });

        if (!kintoneResponse.ok) {
            const error = await kintoneResponse.json();
            throw new Error(error.message || 'Failed to fetch from Kintone');
        }
        const data = await kintoneResponse.json();
        
        if (data.records && data.records.length > 0) {
            res.json({ success: true, data: data.records[0] });
        } else {
            res.status(404).json({ success: false, error: 'Job not found or is no longer active.' });
        }
    } catch (error) {
        console.error(`API Error (/api/job/${jobCode}):`, error);
        res.status(500).json({ success: false, error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running. Your website is available at http://localhost:${PORT}/opportunities.html`);
});