 const fetch = require('node-fetch');
 
 // Configuration based on your GitHub repository details
 const GITHUB_OWNER = 'ashed2127';
 const GITHUB_REPO = 'llpjson';
 const FILE_PATH = 'data.json';
 const BRANCH = 'main'; 
 
 // The URL to fetch the raw content of your JSON file from GitHub
 const GITHUB_URL = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${FILE_PATH}`;
 
 exports.handler = async (event, context) => {
     try {
         console.log(`Attempting to fetch data from: ${GITHUB_URL}`);
         
         // 1. Fetch the data from the raw GitHub URL
         const response = await fetch(GITHUB_URL);
         
         if (!response.ok) {
             console.error(`GitHub fetch failed. Status: ${response.status}`);
             return {
                 statusCode: response.status,
                 body: JSON.stringify({ error: "Failed to fetch data from GitHub. Please check the repo URL or branch." }),
             };
         }
         
         // 2. Parse the JSON response
         const data = await response.json();
 
         // 3. Return the data to the client
         return {
             statusCode: 200,
             headers: { 
                 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': '*'
             },
             body: JSON.stringify(data),
         };
         
     } catch (error) {
         console.error("Error in Netlify Function:", error.message);
         return {
             statusCode: 500,
             body: JSON.stringify({ error: "Internal server error while processing data request." }),
         };
     }
 }; 
