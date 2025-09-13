// Fonctions d'exportation

// Exporter le stock vers Excel
function exportStockToExcel() {
    // Préparer les données
    const exportData = products.map(product => ({
        'ID': `P${String(product.id).padStart(3, '0')}`,
        'Produit': product.name,
        'Fournisseur': getSupplierName(product.supplierId),
        'Stock': product.stock,
        'Seuil Min': product.minThreshold,
        'Seuil Max': product.maxThreshold,
        'Prix Unitaire': product.price,
        'Valeur Stock': product.stock * product.price,
        'Statut': getStockStatus(product)
    }));
    
    // Créer un workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Formater la feuille
    XLSX.utils.book_append_sheet(wb, ws, config.export.defaultSheetName);
    
    // Définir la largeur des colonnes
    const wscols = [
        {wch: 10}, // ID
        {wch: 30}, // Produit
        {wch: 25}, // Fournisseur
        {wch: 10}, // Stock
        {wch: 10}, // Seuil Min
        {wch: 10}, // Seuil Max
        {wch: 15}, // Prix Unitaire
        {wch: 15}, // Valeur Stock
        {wch: 10}  // Statut
    ];
    ws['!cols'] = wscols;
    
    // Exporter le fichier
    XLSX.writeFile(wb, config.export.excelFileName);
    
    showNotification('Export Excel réussi', 'success');
}

// Exporter le stock vers PDF
function exportStockToPDF() {
    // Créer un tableau HTML pour le PDF
    const table = document.createElement('table');
    table.className = 'export-table';
    
    // En-tête
    let thead = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Produit</th>
                <th>Fournisseur</th>
                <th>Stock</th>
                <th>Seuil Min</th>
                <th>Seuil Max</th>
                <th>Prix Unitaire</th>
                <th>Valeur Stock</th>
                <th>Statut</th>
            </tr>
        </thead>
    `;
    
    // Corps
    let tbody = '<tbody>';
    products.forEach(product => {
        tbody += `
            <tr>
                <td>P${String(product.id).padStart(3, '0')}</td>
                <td>${product.name}</td>
                <td>${getSupplierName(product.supplierId)}</td>
                <td>${product.stock}</td>
                <td>${product.minThreshold}</td>
                <td>${product.maxThreshold}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${formatCurrency(product.stock * product.price)}</td>
                <td>${getStockStatus(product).toUpperCase()}</td>
            </tr>
        `;
    });
    tbody += '</tbody>';
    
    table.innerHTML = thead + tbody;
    
    // Créer un conteneur pour le PDF
    const element = document.createElement('div');
    element.className = 'pdf-export-container';
    element.innerHTML = `
        <h1 class="text-center mb-4">État du Stock - ${formatDate(moment().format('YYYY-MM-DD'))}</h1>
        ${table.outerHTML}
        <div class="text-right mt-6 text-sm">
            <p>Généré par ${config.appName} - ${config.companyName}</p>
            <p>Date: ${formatDate(moment().format('YYYY-MM-DD'))}</p>
        </div>
    `;
    
    document.body.appendChild(element);
    
    // Configurer jsPDF
    const opt = {
        margin: 10,
        filename: config.export.pdfFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    // Générer le PDF
    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
        showNotification('Export PDF réussi', 'success');
    });
}

// Exporter les mouvements vers Excel
function exportMovementsToExcel() {
    // Préparer les données
    const exportData = movements.map(movement => ({
        'Date': formatDate(movement.date),
        'Type': movement.type === 'entry' ? 'Entrée' : 'Sortie',
        'Produit': getProductName(movement.productId),
        'Quantité': movement.quantity,
        'Motif': movement.reason,
        'Stock Avant': movement.previousStock,
        'Stock Après': movement.newStock
    }));
    
    // Créer un workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Formater la feuille
    XLSX.utils.book_append_sheet(wb, ws, 'Mouvements');
    
    // Définir la largeur des colonnes
    const wscols = [
        {wch: 15}, // Date
        {wch: 10}, // Type
        {wch: 30}, // Produit
        {wch: 10}, // Quantité
        {wch: 25}, // Motif
        {wch: 15}, // Stock Avant
        {wch: 15}  // Stock Après
    ];
    ws['!cols'] = wscols;
    
    // Exporter le fichier
    XLSX.writeFile(wb, `mouvements_stock_${moment().format('YYYYMMDD')}.xlsx`);
    
    showNotification('Export Excel des mouvements réussi', 'success');
}

// Exporter un rapport vers Excel
function exportReportToExcel(reportTitle, reportContent) {
    // Créer un conteneur temporaire pour extraire les tableaux
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = reportContent;
    
    // Trouver tous les tableaux dans le rapport
    const tables = tempDiv.querySelectorAll('table');
    const wb = XLSX.utils.book_new();
    
    tables.forEach((table, index) => {
        // Convertir le tableau HTML en données
        const tableData = [];
        
        // Extraire les en-têtes
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => {
            headers.push(th.textContent.trim());
        });
        tableData.push(headers);
        
        // Extraire les lignes
        table.querySelectorAll('tbody tr').forEach(tr => {
            const rowData = [];
            tr.querySelectorAll('td').forEach(td => {
                rowData.push(td.textContent.trim());
            });
            tableData.push(rowData);
        });
        
        // Créer une feuille de calcul
        const ws = XLSX.utils.aoa_to_sheet(tableData);
        
        // Nommer la feuille (limité à 31 caractères)
        const sheetName = `${reportTitle.substring(0, 20)}-${index + 1}`;
        XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    });
    
    // Exporter le fichier
    XLSX.writeFile(wb, `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${moment().format('YYYYMMDD')}.xlsx`);
    
    showNotification('Export Excel du rapport réussi', 'success');
}

// Exporter un rapport vers PDF
function exportReportToPDF(reportTitle, reportContent) {
    // Créer un conteneur pour le PDF
    const element = document.createElement('div');
    element.className = 'pdf-export-container';
    element.innerHTML = `
        <h1 class="text-center mb-4">${reportTitle} - ${formatDate(moment().format('YYYY-MM-DD'))}</h1>
        ${reportContent}
        <div class="text-right mt-6 text-sm">
            <p>Généré par ${config.appName} - ${config.companyName}</p>
            <p>Date: ${formatDate(moment().format('YYYY-MM-DD'))}</p>
        </div>
    `;
    
    document.body.appendChild(element);
    
    // Configurer jsPDF
    const opt = {
        margin: 10,
        filename: `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${moment().format('YYYYMMDD')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Générer le PDF
    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
        showNotification('Export PDF du rapport réussi', 'success');
    });
}

// Sauvegarde automatique
async function autoBackup() {
    try {
        const backupData = {
            products: [...products],
            suppliers: [...suppliers],
            movements: [...movements],
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
        };
        
        // Créer un nom de fichier de sauvegarde
        const backupFileName = `backup_${moment().format('YYYYMMDD_HHmmss')}.json`;
        
        // Sauvegarder dans le stockage local
        await localforage.setItem(`backup_${moment().format('YYYYMMDDHHmmss')}`, backupData);
        
        // Nettoyer les anciennes sauvegardes
        const keys = await localforage.keys();
        const backupKeys = keys.filter(key => key.startsWith('backup_'));
        
        if (backupKeys.length > config.backupRetention) {
            // Trier les sauvegardes par date
            backupKeys.sort();
            
            // Supprimer les plus anciennes
            for (let i = 0; i < backupKeys.length - config.backupRetention; i++) {
                await localforage.removeItem(backupKeys[i]);
            }
        }
        
        console.log(`Sauvegarde automatique créée: ${backupFileName}`);
    } catch (error) {
        console.error("Erreur lors de la sauvegarde automatique:", error);
    }
}

// Initialiser la sauvegarde automatique
function initAutoBackup() {
    // Sauvegarde immédiate au démarrage
    autoBackup();
    
    // Sauvegarde périodique
    setInterval(autoBackup, 24 * 60 * 60 * 1000); // Toutes les 24 heures
}

// Restaurer depuis une sauvegarde
async function restoreFromBackup(backupKey) {
    try {
        const backupData = await localforage.getItem(backupKey);
        if (!backupData) {
            throw new Error("Sauvegarde non trouvée");
        }
        
        products = [...backupData.products];
        suppliers = [...backupData.suppliers];
        movements = [...backupData.movements];
        
        await saveData();
        
        showNotification('Restauration de la sauvegarde réussie', 'success');
        return true;
    } catch (error) {
        console.error("Erreur lors de la restauration de la sauvegarde:", error);
        showNotification('Erreur lors de la restauration de la sauvegarde', 'error');
        return false;
    }
}