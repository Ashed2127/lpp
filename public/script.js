 // ===================================
 // THREE.JS BACKGROUND INITIALIZATION
 // ===================================
 let camera, scene, renderer, particles, particleCount;
 
 // GLOBAL VARIABLE to hold the fetched data (Initially empty)
 let resources = [];
 // Variable to hold the default image URL (hardcoded here as it's static)
 const DEFAULT_IMAGE = "https://cdn4.telesco.pe/file/DsLzpsIqvXYPIEzbc5D1Gl-v0plEBu9QjerqTszMCG1pjK9Bs_LcU3eoaUXeBljo7B9Iul566vipgbamgniA9-l8DCUCzfpzBiM_Vq4sAJ2i5RtTVxoG-NubbvGUkcijBAc5QeQbiNtg_3OS44vkvPiVbVmfHbCDwpa6lL8X3Weq17aaWiJbY6BQs_NRC7uznR3u1Pf6OMW8K2q5RN_XwsuVExYJAgH2p3AJ_GI7mcXztTXgXxuGquBqOsckD3w6Nd_X2b4jHdjXZrwbf1IZjCatx0O6HbspVyzPPB1x0Kv5i0DelwmaODt5QaevLtyeVH5-i4Urm0UfCNSWehgFYw.jpg";
 
 
 function initBackground() {
     const container = document.getElementById('three-bg');
 
     // Scene and Renderer
     scene = new THREE.Scene();
     scene.background = new THREE.Color(0x000000); // Black background
     renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true });
     renderer.setSize(window.innerWidth, window.innerHeight);
 
     // Camera
     camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
     camera.position.z = 500;
     
     // Starfield Particles
     particleCount = 1500;
     const geometry = new THREE.BufferGeometry();
     const positions = [];
     const colors = [];
     const color = new THREE.Color();
 
     for (let i = 0; i < particleCount; i++) {
         // Position particles randomly in a cube
         positions.push(Math.random() * 2000 - 1000);
         positions.push(Math.random() * 2000 - 1000);
         positions.push(Math.random() * 2000 - 1000);
 
         // Assign a color (white to light blue/cyan)
         color.setHSL(Math.random() * 0.1 + 0.5, 0.9, 0.7);
         colors.push(color.r, color.g, color.b);
     }
     
     geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
     geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
 
     const material = new THREE.PointsMaterial({
         size: 2,
         vertexColors: true,
         transparent: true,
         opacity: 0.8
     });
 
     particles = new THREE.Points(geometry, material);
     scene.add(particles);
 
     // Handle window resize
     window.addEventListener('resize', onWindowResize, false);
 }
 
 function onWindowResize() {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
 }
 
 function animate() {
     requestAnimationFrame(animate);
 
     // Rotate the particle field slightly
     particles.rotation.z += 0.0005;
     particles.rotation.y += 0.0001;
 
     renderer.render(scene, camera);
 }
 
 // ===================================
 // APPLICATION LOGIC
 // ===================================
 
 document.addEventListener("DOMContentLoaded", () => {
     // START THREE.JS BACKGROUND
     initBackground();
     animate();
     
     // START APPLICATION UI
     loadTypes();
 });
 
 // ----------------------------------
 // Theme Toggle Function 
 // ----------------------------------
 function toggleTheme() {
     const body = document.body;
     const currentTheme = body.getAttribute('data-theme');
     const newTheme = currentTheme === 'light' ? 'dark' : 'light';
     body.setAttribute('data-theme', newTheme);
 
     // Update the icon
     const toggleBtn = document.getElementById('theme-toggle-btn');
     if (newTheme === 'dark') {
         toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
     } else {
         toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
     }
 }
 
 // ----------------------------------
 // Load Type Buttons (MODIFIED TO FETCH DATA)
 // ----------------------------------
 async function loadTypes() {
 
     const typesDiv = document.getElementById("types");
     const catDiv = document.getElementById("categories");
     const resultsDiv = document.getElementById("results");
     
     catDiv.style.display = "none";
     resultsDiv.innerHTML = "";
 
     // Show loading state while fetching data
     typesDiv.innerHTML = `
         <div class="tg-header-btn">Loading Data...</div>
     `;
 
     try {
         // 🚨 IMPORTANT: This URL calls your Netlify Function
         const response = await fetch('/.netlify/functions/fetchData');
          
         if (!response.ok) {
             throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         // Populate the global resources array
         resources = await response.json();
         
         // Proceed with UI rendering once data is fetched
         typesDiv.innerHTML = `
             <button class="tg-btn" onclick="loadCategories('channel')"> Channels</button>
             <button class="tg-btn" onclick="loadCategories('group')"> Groups</button>
             <button class="tg-btn" onclick="loadCategories('bot')">Bots</button>
         `;
 
     } catch (error) {
         console.error("Failed to load data:", error);
         typesDiv.innerHTML = `
             <div class="tg-header-btn" style="background: red;">Error: Could not load data.</div>
             <button class="tg-btn mt-3" onclick="loadTypes()">Try Again</button>
         `;
     }
 }
 // ----------------------------------
 // Show Categories
 // ----------------------------------
 function loadCategories(type) {
 
     const typesDiv = document.getElementById("types");
 
     const catDiv = document.getElementById("categories");
 
     const resultsDiv = document.getElementById("results");
     typesDiv.innerHTML = "";
 
     resultsDiv.innerHTML = "";
     catDiv.style.display = "grid";
     const categories = [
 
         "Anime/AC","Adult","News","Business",
 
         "Music","Film & TV","Games","Emotions",
 
         "Community","Crypto","Programming","AI",
 
         "Tech","Finance","Travel","Novels",
 
         "Live","Design","Education","Shopping"
 
     ];
     catDiv.innerHTML = "";
     categories.forEach(c => {
 
         const formatted = c.toLowerCase().replace(/[^a-z0-9]/g, "_");
         catDiv.innerHTML += `
 
             <button class="tg-btn-outline" onclick="showResults('${type}', '${formatted}')">
 
                 ${c}
 
             </button>
 
         `;
 
     });
     // Back button full-width across the grid
 
     catDiv.innerHTML += `
 
         <button class="tg-btn mt-3" style="grid-column: 1 / -1;" onclick="loadTypes()"> Back</button>
 
     `;
 }
 // ----------------------------------
 // Show Results
 // ----------------------------------
 function showResults(type, category) {
 
     // Check if data is loaded
     if (resources.length === 0) {
         document.getElementById("results").innerHTML = `
             <h4>Data not loaded. Please go back and try again.</h4>
             <button class="tg-btn mt-3 w-100" onclick="loadTypes()"> Back to Types</button>
         `;
         return;
     }
     
     const catDiv = document.getElementById("categories");
 
     const resultsDiv = document.getElementById("results");
     catDiv.style.display = "none";
     
     // Filter uses the now-global `resources` array
     const filtered = resources.filter(
 
         item =>
 
             item.type === type &&
 
             item.category.toLowerCase().replace(/[^a-z0-9]/g, "_") === category
 
     );
     if (filtered.length === 0) {
 
         resultsDiv.innerHTML = `
 
             <h4>No data found.</h4>
 
             <button class="tg-btn mt-3 w-100" onclick="backToCategories()"> Back</button>
 
         `;
 
         return;
 
     }
     
     // Function to convert string to Title Case (First letter of each word capitalized)
     const toTitleCase = (str) => {
         // Replace underscores with space, convert to lowercase, then capitalize starts of words
         return str.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (x) => x.toUpperCase());
     }
 
     // Format Type and Category using the new function
     let typeTitle = toTitleCase(type);
     const categoryTitle = toTitleCase(category);
     
     // Pluralize the type for the header (e.g., 'Channel' -> 'Channels')
     if (!typeTitle.endsWith('s')) {
         typeTitle += 's';
     }
     
     // Header template: Category Type (e.g., "Tech Channels") using the non-hovering style
     let html = `
         <div class="tg-header-btn">
             ${categoryTitle} ${typeTitle}
         </div>
         <ul class="list-group mt-3">
     `;
 
 
     filtered.forEach(item => {
 
         // Build the image HTML dynamically. Uses the 'profile-pic' class defined in index.html.
         // Use item.image or the constant DEFAULT_IMAGE if item.image is falsy
         const itemImage = item.image && item.image !== 'https://cdn4.telesco.pe/file/DsLzpsIqvXYPIEzbc5D1Gl-v0plEBu9QjerqTszMCG1pjK9Bs_LcU3eoaUXeBljo7B9Iul566vipgbamgniA9-l8DCUCzfpzBiM_Vq4sAJ2i5RtTVxoG-NubbvGUkcijBAc5QeQbiNtg_3OS44vkvPiVbVmfHbCDwpa6lL8X3Weq17aaWiJbY6BQs_NRC7uznR3u1Pf6OMW8K2q5RN_XwsuVExYJAgH2p3AJ_GI7mcXztTXgXxuGquBqOsckD3w6Nd_X2b4jHdjXZrwbf1IZjCatx0O6HbspVyzPPB1x0Kv5i0DelwmaODt5QaevLtyeVH5-i4Urm0UfCNSWehgFYw.jpg' ? item.image : DEFAULT_IMAGE;
         
         const imageHtml = itemImage 
             ? `<img src="${itemImage}" alt="Profile Picture" class="profile-pic">`
 
             : ''; 
         html += `
 
             <li class="list-group-item d-flex justify-content-between align-items-center">
 
                 <div class="d-flex align-items-center">
 
                     ${imageHtml}
 
                     <strong>${item.name}</strong>
 
                 </div>
 
                 <a href="${item.link}" target="_blank" class="tg-btn-link">Open</a>
 
             </li>
 
         `;
 
     });
     html += `</ul>
 
         <button class="tg-btn mt-3 w-100" onclick="backToCategories()">Back</button>
 
     `;
     resultsDiv.innerHTML = html;
 }
 // ----------------------------------
 // Back to Categories
 // ----------------------------------
 function backToCategories() {
 
     document.getElementById("results").innerHTML = "";
 
     document.getElementById("categories").style.display = "grid";
 }
