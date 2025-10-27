const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateDiagramImages() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set viewport for consistent image sizes
    await page.setViewport({ width: 1200, height: 800 });
    
    // Read the HTML file
    const htmlContent = fs.readFileSync('DevConnect_Diagrams_Visual.html', 'utf8');
    
    // Set the HTML content
    await page.setContent(htmlContent);
    
    // Wait for Mermaid to render
    await page.waitForTimeout(3000);
    
    // Get all diagram containers
    const diagramContainers = await page.$$('.diagram-container');
    
    console.log(`Found ${diagramContainers.length} diagrams to capture`);
    
    for (let i = 0; i < diagramContainers.length; i++) {
        const container = diagramContainers[i];
        const title = await container.$eval('.diagram-title', el => el.textContent);
        
        // Clean title for filename
        const filename = title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            + '.png';
        
        console.log(`Capturing: ${title}`);
        
        // Capture the diagram
        await container.screenshot({
            path: `images/${filename}`,
            type: 'png'
        });
        
        console.log(`Saved: images/${filename}`);
    }
    
    await browser.close();
    console.log('All diagrams captured successfully!');
}

// Create images directory if it doesn't exist
if (!fs.existsSync('images')) {
    fs.mkdirSync('images');
}

generateDiagramImages().catch(console.error);


