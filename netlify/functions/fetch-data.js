const fetch = require('node-fetch'); 

// * IMPORTANT: UPDATE THESE VARIABLES TO MATCH YOUR PRIVATE REPO DETAILS *
const GITHUB_OWNER = 'ashed2127';  
const GITHUB_REPO = 'llpjson';   
const FILE_PATH = 'data.json'; 
const BRANCH = 'main'; // or 'master'

// The URL to fetch the raw content of your JSON file
const GITHUB_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${FILE_PATH}`;
 
exports.handler = async (event, context) => {
    // This token is securely injected by Netlify from your environment variables
    const githubToken = process.env.GITHUB_ACCESS_TOKEN;
    
    if (!githubToken) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Configuration Error: GITHUB_ACCESS_TOKEN is missing. Set it in Netlify Environment Variables." })
        };
    }

    try {
        // Making the authenticated request to GitHub
        const response = await fetch(GITHUB_URL, {
            headers: {
                'Authorization': \token \${githubToken}\,
                'Accept': 'application/vnd.github.v3.raw', 
            },
        });

        if (!response.ok) {
            console.error(\GitHub fetch failed: \${response.status} - \${response.statusText}\);
            return {
                statusCode: 502, 
                body: JSON.stringify({ 
                    error: "Could not retrieve data. Check GitHub repo details or token permissions."
                })
            };
        }

        const dataText = await response.text();
        const data = JSON.parse(dataText);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=0, must-revalidate'
            },
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Internal server error during fetch:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error while processing request." }),
        };
    }
};
