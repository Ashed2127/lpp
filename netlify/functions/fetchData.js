 const fetch = require('node-fetch');
 
 // 🚨 1. Configuration - MAKE SURE THIS MATCHES YOUR REPO DETAILS
 // Replace these values if your repository details change
 const GITHUB_OWNER = 'ashed2127';
 const GITHUB_REPO = 'llpjson';
 const FILE_PATH = 'llpjson/data.json';
 const BRANCH = 'main';   
  
 // 🚨 2. SECURELY GET THE TOKEN
 // This variable MUST be set in your Netlify Environment Variables.
 const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN; 
 
 // 🚨 3. Use the GitHub API URL for content (not the raw.githubusercontent.com URL)
 const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
 
 exports.handler = async (event, context) => {
     
     if (!GITHUB_ACCESS_TOKEN) {
         console.error("GITHUB_ACCESS_TOKEN is missing from Netlify environment variables.");
         return {
             statusCode: 500,
             body: JSON.stringify({ error: "Server configuration error: GitHub token missing." }),
         };
     }
     
     try {
         // 4. Configure the HTTP headers for API access
         const headers = {
             // Include the token for authentication
             'Authorization': `token ${GITHUB_ACCESS_TOKEN}`, 
             // GitHub requires a User-Agent header for API requests
             'User-Agent': 'Netlify-Function-Data-Fetcher',
             'Accept': 'application/vnd.github.v3+json'
         };
 
         // Fetch the file content metadata from the GitHub API
         const response = await fetch(GITHUB_API_URL, { headers: headers });
         
         if (!response.ok) {
             console.error(`GitHub API fetch failed. Status: ${response.status} Body: ${await response.text()}`);
             return {
                 statusCode: response.status,
                 body: JSON.stringify({ error: "Failed to fetch data from GitHub API. Check token permissions." }),
             };
         }
         
         // The GitHub Content API returns a JSON object, where the file content is BASE64 encoded.
         const fileContentMeta = await response.json();
         
         if (fileContentMeta.content && fileContentMeta.encoding === 'base64') {
             // 5. DECODE THE BASE64 CONTENT
             const fileContentBase64 = fileContentMeta.content;
             const fileContent = Buffer.from(fileContentBase64, 'base64').toString('utf8');
             
             // 6. Parse the JSON data from the decoded string
             const data = JSON.parse(fileContent);
 
             // 7. Return the data to the client
             return {
                 statusCode: 200,
                 headers: { 
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': '*'
                 },
                 body: JSON.stringify(data),
             };
             
         } else {
             return {
                  statusCode: 500,
                  body: JSON.stringify({ error: "Failed to read file content or encoding is not base64." }),
             };
         }
 
     } catch (error) {
         console.error("Error in Netlify Function:", error.message);
         return {
             statusCode: 500,
             body: JSON.stringify({ error: `Internal server error: ${error.message}` }),
         };
     }
 };
