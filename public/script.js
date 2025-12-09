// ===================================
// THREE.JS BACKGROUND INITIALIZATION (UNCHANGED)
// ===================================
let camera, scene, renderer, particles, particleCount;

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

    // Material
    const material = new THREE.PointsMaterial({
        size: 5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the particles slightly
    particles.rotation.y += 0.0005; 
    
    renderer.render(scene, camera);
}


// ===================================
// APPLICATION LOGIC (MODIFIED START)
// ===================================

let allResources = []; // NEW global variable to store the fetched data

document.addEventListener("DOMContentLoaded", () => {
    // START THREE.JS BACKGROUND
    initBackground();
    animate();
    
    // START APPLICATION UI: Fetch data first, then load the types
    fetchAndLoadData();
});

// ----------------------------------
// NEW: Fetch Data Function
// ----------------------------------
async function fetchAndLoadData() {
    const typesDiv = document.getElementById("types");
    typesDiv.innerHTML = '<button class="tg-btn" disabled>Loading data securely...</button>';

    try {
        // CALL THE NETLIFY FUNCTION endpoint (which will securely talk to GitHub)
        const response = await fetch('/.netlify/functions/fetch-data'); 
        
        if (!response.ok) {
            throw new Error(\Failed to fetch data: \${response.status} \${response.statusText}\);
        }
        
        allResources = await response.json(); 
        
        // Now that data is loaded, display the main buttons
        loadTypes();

} catch (error) {
        console.error("Error fetching resources:", error);
        typesDiv.innerHTML = \<div class="tg-header-btn" style="background: #e74c3c;">
            Error loading data. Check console.
        </div>\;
    }
}


// ----------------------------------
// Theme Toggle Function (UNCHANGED)
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
// Load Type Buttons (UNCHANGED logic)
// ----------------------------------
function loadTypes() {

    const typesDiv = document.getElementById("types");
    const catDiv = document.getElementById("categories");
    const resultsDiv = document.getElementById("results");
    
    catDiv.style.display = "none";
    resultsDiv.innerHTML = "";
    
    typesDiv.innerHTML = \
        <button class="tg-btn" onclick="loadCategories('channel')"> Channels</button>
        <button class="tg-btn" onclick="loadCategories('group')"> Groups</button>
        <button class="tg-btn" onclick="loadCategories('bot')">Bots</button>
    \;
}

// ----------------------------------
// Show Categories (UNCHANGED)
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
        catDiv.innerHTML += \

            <button class="tg-btn-outline" onclick="showResults('\${type}', '\${formatted}')">

                \${c}

            </button>

        \;

    });

    catDiv.innerHTML += \

        <button class="tg-btn mt-3" style="grid-column: 1 / -1;" onclick="loadTypes()"> Back</button>

    \;
}

// ----------------------------------
// Show Results (MODIFIED: uses allResources)
// ----------------------------------
function showResults(type, category) {

    const catDiv = document.getElementById("categories");
    const resultsDiv = document.getElementById("results");
    catDiv.style.display = "none";
    
    const filtered = allResources.filter(
        item =>
            item.type === type &&
            item.category.toLowerCase().replace(/[^a-z0-9]/g, "_") === category
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = \
            <h4>No data found.</h4>
            <button class="tg-btn mt-3 w-100" onclick="backToCategories()"> Back</button>
        \;
        return;
    }
    
    const toTitleCase = (str) => {
        return str.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, (x) => x.toUpperCase());
    }

    let typeTitle = toTitleCase(type);
    const categoryTitle = toTitleCase(category);
    
    if (!typeTitle.endsWith('s')) {
        typeTitle += 's';
    }
    
    let html = \
        <div class="tg-header-btn">
            \${categoryTitle} \${typeTitle}
        </div>
        <ul class="list-group mt-3">
    \;


    filtered.forEach(item => {

        const imageHtml = item.image 
            ? \<img src="\${item.image}" alt="Profile Picture" class="profile-pic">\
            : ''; 
        html += \`

<li class="list-group-item d-flex justify-content-between align-items-center">

                <div class="d-flex align-items-center">

                    \${imageHtml}

                    <strong>\${item.name}</strong>

                </div>

                <a href="\${item.link}" target="_blank" class="tg-btn-link">Open</a>

            </li>

        \;

    });
    html += \</ul>

        <button class="tg-btn mt-3 w-100" onclick="backToCategories()">Back</button>

    \`;
    resultsDiv.innerHTML = html;
}

// ----------------------------------
// Back to Categories (UNCHANGED)
// ----------------------------------
function backToCategories() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("categories").style.display = "grid";
}
