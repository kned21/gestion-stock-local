// Exporter le stock vers PDF (version simplifiée avec html2pdf uniquement)
function exportStockToPDF() {
    // Créer un tableau HTML pour le PDF
    const table = document.createElement('table');
    table.className = 'export-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    
    // En-tête
    let thead = `
        <thead>
            <tr>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">ID</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Produit</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Fournisseur</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Stock</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Seuil Min</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Seuil Max</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Prix Unitaire</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Valeur Stock</th>
                <th style="border: 1px solid #000; padding: 8px; background: #f0f0f0;">Statut</th>
            </tr>
        </thead>
    `;
    
    // Corps
    let tbody = '<tbody>';
    products.forEach(product => {
        const status = getStockStatus(product).toUpperCase();
        tbody += `
            <tr>
                <td style="border: 1px solid #000; padding: 8px;">P${String(product.id).padStart(3, '0')}</td>
                <td style="border: 1px solid #000; padding: 8px;">${product.name}</td>
                <td style="border: 1px solid #000; padding: 8px;">${getSupplierName(product.supplierId)}</td>
                <td style="border: 1px solid #000; padding: 8px;">${product.stock}</td>
                <td style="border: 1px solid #000; padding: 8px;">${product.minThreshold}</td>
                <td style="border: 1px solid #000; padding: 8px;">${product.maxThreshold}</td>
                <td style="border: 1px solid #000; padding: 8px;">${formatCurrency(product.price)}</td>
                <td style="border: 1px solid #000; padding: 8px;">${formatCurrency(product.stock * product.price)}</td>
                <td style="border: 1px solid #000; padding: 8px;">${status}</td>
            </tr>
        `;
    });
    tbody += '</tbody>';
    
    table.innerHTML = thead + tbody;
    
    // Créer un conteneur pour le PDF
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.innerHTML = `
        <h1 style="text-align: center; margin-bottom: 20px;">État du Stock</h1>
        <h2 style="text-align: center; margin-bottom: 30px;">Date: ${moment().format('DD/MM/YYYY')}</h2>
        ${table.outerHTML}
        <div style="text-align: right; margin-top: 30px; font-size: 12px;">
            <p>Généré par ${config.appName} - ${config.companyName}</p>
        </div>
    `;
    
    // Configurer html2pdf
    const opt = {
        margin: 10,
        filename: config.export.pdfFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    // Générer le PDF
    html2pdf().set(opt).from(element).save().then(() => {
        showNotification('Export PDF réussi', 'success');
    }).catch((error) => {
        console.error('Erreur lors de l\'export PDF:', error);
        showNotification('Erreur lors de l\'export PDF', 'error');
    });
}