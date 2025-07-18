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
        
        const grottos = await response.json();
        
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
                            <a href="static/1024x1024/${grotto.bestandsnaam}" target="_blank">
                                <img src="static/thumbnail/${grotto.bestandsnaam}" alt="Lourdesgrot ${grotto.locatie}" class="grotto-image" />
                            </a>
                        </div>
                    ` : ''}
                </div>
            `;
            
            containerElement.appendChild(grottoCard);
        });
        
        // Add summary information
        const summary = document.createElement('div');
        summary.className = 'summary';
        summary.innerHTML = `
            <h2>Samenvatting</h2>
            <p>Totaal aantal grotten: <strong>${grottos.length}</strong></p>
            <p>Provincies: <strong>${[...new Set(grottos.map(g => g.provincie))].length}</strong></p>
        `;
        
        containerElement.insertBefore(summary, containerElement.firstChild);
        
    } catch (error) {
        loadingElement.innerHTML = `<p style="color: red;">Fout bij het laden van gegevens: ${error.message}</p>`;
        console.error('Error loading data:', error);
    }
}

// Load data when page is ready
document.addEventListener('DOMContentLoaded', loadLourdesGrottos);