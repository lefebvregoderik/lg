// Fetch and display the JSON data
async function loadLourdesGrottos() {
    const loadingElement = document.getElementById('loading');
    const containerElement = document.getElementById('data-container');
    
    try {
        // Fetch the JSON data
        const response = await fetch('lg.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let grottos = await response.json();
        
        // Check for provincie query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const provincieFilter = urlParams.get('provincie');
        
        // Filter grottos if provincie parameter is provided
        if (provincieFilter) {
            grottos = grottos.filter(grotto => 
                grotto.provincie.toLowerCase() === provincieFilter.toLowerCase()
            );
        }
        
        // Hide loading message
        loadingElement.style.display = 'none';
        
        // Create HTML for each grotto
        grottos.forEach(grotto => {
            const grottoCard = document.createElement('div');
            grottoCard.className = 'grotto-card';
            
            grottoCard.innerHTML = `
                <div class="grotto-header">
                    <h3>${grotto.locatie}</h3>
                    <span class="provincie">${grotto.provincie}</span>
                </div>
                <div class="grotto-details">
                    <p><strong>Straat:</strong> ${grotto.straat}</p>
                    ${grotto.info ? `<p><strong>Info:</strong> ${grotto.info}</p>` : ''}
                    <p><strong>Categorie:</strong> <span class="categorie ${grotto.categorie.toLowerCase()}">${grotto.categorie}</span></p>
                    ${grotto.bestandsnaam ? `
                        <div class="image-container">
                            <img src="static/thumbnail/${grotto.bestandsnaam}" 
                                 alt="Lourdesgrot ${grotto.locatie}" 
                                 class="grotto-image" 
                                 data-large-src="static/1024x1024/${grotto.bestandsnaam}"
                                 onclick="openLightbox(this)" />
                        </div>
                    ` : ''}
                </div>
            `;
            
            containerElement.appendChild(grottoCard);
        });
        
        // Add summary information
        const summary = document.createElement('div');
        summary.className = 'summary';
        
        let summaryContent = `<h2>Samenvatting</h2>`;
        
        if (provincieFilter) {
            summaryContent += `
                <p>Gefilterd op provincie: <strong>${provincieFilter}</strong></p>
                <p>Aantal grotten in ${provincieFilter}: <strong>${grottos.length}</strong></p>
            `;
        } else {
            summaryContent += `
                <p>Totaal aantal grotten: <strong>${grottos.length}</strong></p>
                <p>Provincies: <strong>${[...new Set(grottos.map(g => g.provincie))].length}</strong></p>
            `;
        }
        
        summary.innerHTML = summaryContent;
        
        containerElement.insertBefore(summary, containerElement.firstChild);
        
        // Create province links
        createProvinceLinks(grottos, provincieFilter);
        
        // Create lightbox
        createLightbox();
        
    } catch (error) {
        loadingElement.innerHTML = `<p style="color: red;">Fout bij het laden van gegevens: ${error.message}</p>`;
        console.error('Error loading data:', error);
    }
}

// Create province links in sidebar
function createProvinceLinks(allGrottos, currentFilter) {
    const provinceLinksContainer = document.getElementById('province-links');
    
    // Get unique provinces and count grottos per province
    const provinceData = {};
    allGrottos.forEach(grotto => {
        if (!provinceData[grotto.provincie]) {
            provinceData[grotto.provincie] = 0;
        }
        provinceData[grotto.provincie]++;
    });
    
    // Sort provinces alphabetically
    const sortedProvinces = Object.keys(provinceData).sort();
    
    // Update "Alle provincies" link
    const allLink = document.getElementById('all-link');
    allLink.innerHTML = `Alle provincies <span class="province-count">(${allGrottos.length})</span>`;
    
    // Set active state for "Alle provincies"
    if (!currentFilter) {
        allLink.classList.add('active');
    } else {
        allLink.classList.remove('active');
    }
    
    // Add province links
    sortedProvinces.forEach(provincie => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        link.href = `?provincie=${encodeURIComponent(provincie)}`;
        link.innerHTML = `${provincie} <span class="province-count">(${provinceData[provincie]})</span>`;
        
        // Set active state
        if (currentFilter && currentFilter.toLowerCase() === provincie.toLowerCase()) {
            link.classList.add('active');
        }
        
        listItem.appendChild(link);
        provinceLinksContainer.appendChild(listItem);
    });
}

// Create lightbox HTML
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            <img class="lightbox-image" id="lightbox-image" src="" alt="" />
        </div>
    `;
    document.body.appendChild(lightbox);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Open lightbox with image
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    
    lightboxImage.src = imgElement.dataset.largeSrc;
    lightboxImage.alt = imgElement.alt;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Load data when page is ready
document.addEventListener('DOMContentLoaded', loadLourdesGrottos);