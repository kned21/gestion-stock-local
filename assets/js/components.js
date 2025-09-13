// Gestion des composants UI

// Initialiser les onglets
function initTabs() {
    $('.tab-btn').on('click', function() {
        // Retirer la classe active de tous les onglets
        $('.tab-btn').removeClass('active');
        $('.tab-content').removeClass('active');
        
        // Ajouter la classe active à l'onglet cliqué
        $(this).addClass('active');
        
        // Afficher le contenu correspondant
        const tabId = $(this).data('tab');
        $('#' + tabId).addClass('active');
        
        // Rafraîchir les données selon l'onglet
        if (tabId === 'dashboard') {
            updateDashboard();
        } else if (tabId === 'stock') {
            renderStockTable();
        } else if (tabId === 'movements') {
            renderMovementsTable();
        } else if (tabId === 'suppliers') {
            renderSuppliersTable();
        } else if (tabId === 'alerts') {
            renderAlertsTable();
        }
    });
}

// Initialiser les filtres
function initFilters() {
    // Filtres du tableau de stock
    $('#searchStock').on('input', function() {
        renderStockTable();
    });
    
    $('#supplierFilter, #stockFilter').on('change', function() {
        renderStockTable();
    });
    
    // Filtres des mouvements
    $('#dateFilter, #typeFilter').on('change', function() {
        renderMovementsTable();
    });
}

// Initialiser les boutons
function initButtons() {
    // Boutons principaux
    $('#addProductBtn').on('click', function() {
        openProductModal();
    });
    
    $('#entryBtn').on('click', function() {
        openMovementModal('entry');
    });
    
    $('#exitBtn').on('click', function() {
        openMovementModal('exit');
    });
    
    $('#addSupplierBtn').on('click', function() {
        openSupplierModal();
    });
    
    // Boutons d'export
    $('#exportExcelBtn').on('click', function() {
        exportStockToExcel();
    });
    
    $('#exportPdfBtn').on('click', function() {
        exportStockToPDF();
    });
    
    $('#exportMovementsBtn').on('click', function() {
        exportMovementsToExcel();
    });
    
    // Boutons de rapport
    $('.report-card button').on('click', function() {
        const reportType = $(this).closest('.report-card').data('report');
        generateReport(reportType);
    });
}

// Ouvrir la modale de produit
function openProductModal(product = null) {
    const isEditing = product !== null;
    
    let modalContent = `
        <div class="modal-content bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full">
            <div class="modal-header bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <h3 class="text-xl font-bold text-white">${isEditing ? 'Modifier' : 'Ajouter'} un Produit</h3>
                <button class="close-modal absolute top-4 right-4 text-white hover:text-gray-200">
                    <span class="text-2xl">&times;</span>
                </button>
            </div>
            <div class="modal-body p-6">
                <form id="productForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom du Produit</label>
                        <input type="text" id="productName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? product.name : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                        <select id="productSupplier" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                            ${suppliers.map(s => 
                                `<option value="${s.id}" ${isEditing && product.supplierId === s.id ? 'selected' : ''}>${s.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Stock Actuel</label>
                        <input type="number" id="productStock" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? product.stock : '0'}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Seuil Minimum</label>
                        <input type="number" id="productMinThreshold" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? product.minThreshold : config.defaultMinThreshold}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Seuil Maximum</label>
                        <input type="number" id="productMaxThreshold" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? product.maxThreshold : config.defaultMaxThreshold}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire (FCFA)</label>
                        <input type="number" id="productPrice" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? product.price : '0'}" min="0" step="0.01" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button class="btn-cancel px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Annuler
                </button>
                <button class="btn-save px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    ${isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
            </div>
        </div>
    `;
    
    $('body').append(`
        <div id="productModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            ${modalContent}
        </div>
    `);
    
    // Gestion des événements dans la modale
    $('#productModal .close-modal, #productModal .btn-cancel').on('click', function() {
        $('#productModal').remove();
    });
    
    $('#productModal .btn-save').on('click', async function() {
        const name = $('#productName').val().trim();
        const supplierId = parseInt($('#productSupplier').val());
        const stock = parseInt($('#productStock').val());
        const minThreshold = parseInt($('#productMinThreshold').val());
        const maxThreshold = parseInt($('#productMaxThreshold').val());
        const price = parseFloat($('#productPrice').val());
        
        if (!name || isNaN(supplierId) || isNaN(stock) || isNaN(minThreshold) || isNaN(maxThreshold) || isNaN(price)) {
            showNotification('Veuillez remplir tous les champs correctement', 'error');
            return;
        }
        
        if (minThreshold >= maxThreshold) {
            showNotification('Le seuil minimum doit être inférieur au seuil maximum', 'error');
            return;
        }
        
        if (stock < 0) {
            showNotification('Le stock ne peut pas être négatif', 'error');
            return;
        }
        
        if (isEditing) {
            await updateProduct(product.id, {
                name,
                supplierId,
                stock,
                minThreshold,
                maxThreshold,
                price
            });
            showNotification('Produit mis à jour avec succès', 'success');
        } else {
            await addProduct({
                name,
                supplierId,
                stock,
                minThreshold,
                maxThreshold,
                price
            });
            showNotification('Produit ajouté avec succès', 'success');
        }
        
        $('#productModal').remove();
        renderStockTable();
    });
}

// Ouvrir la modale de mouvement
function openMovementModal(type) {
    let modalContent = `
        <div class="modal-content bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
            <div class="modal-header bg-gradient-to-r ${type === 'entry' ? 'from-green-500 to-green-600' : 'from-yellow-500 to-yellow-600'} p-6">
                <h3 class="text-xl font-bold text-white">${type === 'entry' ? 'Entrée' : 'Sortie'} de Stock</h3>
                <button class="close-modal absolute top-4 right-4 text-white hover:text-gray-200">
                    <span class="text-2xl">&times;</span>
                </button>
            </div>
            <div class="modal-body p-6">
                <form id="movementForm" class="space-y-4">
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Produit</label>
                        <select id="movementProduct" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                            <option value="">Sélectionner un produit</option>
                            ${products.map(p => 
                                `<option value="${p.id}">${p.name} (${getSupplierName(p.supplierId)})</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                        <input type="number" id="movementQuantity" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               min="1" value="1" required>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                        <input type="text" id="movementReason" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               placeholder="${type === 'entry' ? 'Réapprovisionnement' : 'Vente'}" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button class="btn-cancel px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Annuler
                </button>
                <button class="btn-save px-4 py-2 ${type === 'entry' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded-lg transition-colors">
                    Confirmer ${type === 'entry' ? 'Entrée' : 'Sortie'}
                </button>
            </div>
        </div>
    `;
    
    $('body').append(`
        <div id="movementModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            ${modalContent}
        </div>
    `);
    
    // Gestion des événements dans la modale
    $('#movementModal .close-modal, #movementModal .btn-cancel').on('click', function() {
        $('#movementModal').remove();
    });
    
    $('#movementModal .btn-save').on('click', async function() {
        const productId = parseInt($('#movementProduct').val());
        const quantity = parseInt($('#movementQuantity').val());
        const reason = $('#movementReason').val().trim();
        
        if (isNaN(productId) || productId <= 0) {
            showNotification('Veuillez sélectionner un produit', 'error');
            return;
        }
        
        if (isNaN(quantity) || quantity <= 0) {
            showNotification('La quantité doit être supérieure à zéro', 'error');
            return;
        }
        
        if (!reason) {
            showNotification('Veuillez indiquer un motif', 'error');
            return;
        }
        
        try {
            await addMovement({
                type: type,
                productId: productId,
                quantity: quantity,
                reason: reason
            });
            
            showNotification(`Mouvement de stock ${type === 'entry' ? 'ajouté' : 'enregistré'} avec succès`, 'success');
            $('#movementModal').remove();
            renderStockTable();
            renderMovementsTable();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });
}

// Ouvrir la modale de fournisseur
function openSupplierModal(supplier = null) {
    const isEditing = supplier !== null;
    
    let modalContent = `
        <div class="modal-content bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl w-full">
            <div class="modal-header bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                <h3 class="text-xl font-bold text-white">${isEditing ? 'Modifier' : 'Ajouter'} un Fournisseur</h3>
                <button class="close-modal absolute top-4 right-4 text-white hover:text-gray-200">
                    <span class="text-2xl">&times;</span>
                </button>
            </div>
            <div class="modal-body p-6">
                <form id="supplierForm" class="space-y-4">
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nom du Fournisseur</label>
                        <input type="text" id="supplierName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? supplier.name : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                        <input type="text" id="supplierContact" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? supplier.contact : ''}">
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input type="tel" id="supplierPhone" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? supplier.phone : ''}">
                    </div>
                    <div class="form-group">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="supplierEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                               value="${isEditing ? supplier.email : ''}">
                    </div>
                </form>
            </div>
            <div class="modal-footer p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button class="btn-cancel px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                    Annuler
                </button>
                <button class="btn-save px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    ${isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
            </div>
        </div>
    `;
    
    $('body').append(`
        <div id="supplierModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            ${modalContent}
        </div>
    `);
    
    // Gestion des événements dans la modale
    $('#supplierModal .close-modal, #supplierModal .btn-cancel').on('click', function() {
        $('#supplierModal').remove();
    });
    
    $('#supplierModal .btn-save').on('click', async function() {
        const name = $('#supplierName').val().trim();
        const contact = $('#supplierContact').val().trim();
        const phone = $('#supplierPhone').val().trim();
        const email = $('#supplierEmail').val().trim();
        
        if (!name) {
            showNotification('Le nom du fournisseur est requis', 'error');
            return;
        }
        
        if (isEditing) {
            const index = suppliers.findIndex(s => s.id === supplier.id);
            if (index !== -1) {
                suppliers[index] = {
                    ...suppliers[index],
                    name,
                    contact,
                    phone,
                    email
                };
                await saveData();
                showNotification('Fournisseur mis à jour avec succès', 'success');
            }
        } else {
            const newSupplier = {
                id: suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1,
                name,
                contact,
                phone,
                email,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            suppliers.push(newSupplier);
            await saveData();
            showNotification('Fournisseur ajouté avec succès', 'success');
        }
        
        $('#supplierModal').remove();
        renderSuppliersTable();
    });
}

// Initialiser les tableaux avec DataTables
function initDataTables() {
    // Vérifier et détruire les instances existantes
    if ($('#stockTable').length && $.fn.DataTable.isDataTable('#stockTable')) {
        $('#stockTable').DataTable().destroy();
    }
    
    if ($('#movementsTable').length && $.fn.DataTable.isDataTable('#movementsTable')) {
        $('#movementsTable').DataTable().destroy();
    }
    
    if ($('#suppliersTable').length && $.fn.DataTable.isDataTable('#suppliersTable')) {
        $('#suppliersTable').DataTable().destroy();
    }
    
    if ($('#alertsTable').length && $.fn.DataTable.isDataTable('#alertsTable')) {
        $('#alertsTable').DataTable().destroy();
    }
    
    // Initialiser uniquement si les éléments existent et sont visibles
    setTimeout(() => {
        if ($('#stockTable:visible').length) {
            $('#stockTable').DataTable({
                language: {
                    url: 'assets/libs/fr-FR.json'
                },
                order: [[3, 'asc']],
                pageLength: 10,
                responsive: true
            });
        }
        
        if ($('#movementsTable:visible').length) {
            $('#movementsTable').DataTable({
                language: {
                    url: 'assets/libs/fr-FR.json'
                },
                order: [[0, 'desc']],
                pageLength: 10,
                responsive: true
            });
        }
        
        if ($('#suppliersTable:visible').length) {
            $('#suppliersTable').DataTable({
                language: {
                    url: 'assets/libs/fr-FR.json'
                },
                order: [[1, 'asc']],
                pageLength: 10,
                responsive: true
            });
        }
        
        if ($('#alertsTable:visible').length) {
            $('#alertsTable').DataTable({
                language: {
                    url: 'assets/libs/fr-FR.json'
                },
                order: [[0, 'asc']],
                pageLength: 10,
                responsive: true
            });
        }
    }, 100);
}

// Initialiser les graphiques
function initCharts() {
    // Graphique de répartition du stock
    const stockCtx = document.getElementById('stockChart').getContext('2d');
    window.stockChart = new Chart(stockCtx, {
        type: 'doughnut',
        data: {
            labels: ['Critique', 'Bas', 'Bon'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    config.colors.danger,
                    config.colors.warning,
                    config.colors.success
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed} produits`;
                        }
                    }
                }
            }
        }
    });
    
    // Graphique des mouvements récents
    const movementsCtx = document.getElementById('movementsChart').getContext('2d');
    window.movementsChart = new Chart(movementsCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Entrées',
                    data: [],
                    backgroundColor: config.colors.success,
                    borderColor: config.colors.success,
                    borderWidth: 1
                },
                {
                    label: 'Sorties',
                    data: [],
                    backgroundColor: config.colors.warning,
                    borderColor: config.colors.warning,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Rendre le tableau de stock
function renderStockTable() {
    const tbody = $('#stockTableBody');
    tbody.empty();
    
    const searchValue = $('#searchStock').val().toLowerCase();
    const supplierFilter = $('#supplierFilter').val();
    const stockFilter = $('#stockFilter').val();
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchValue);
        const matchesSupplier = !supplierFilter || product.supplierId == supplierFilter;
        
        let matchesStock = true;
        if (stockFilter) {
            if (stockFilter === 'critical') matchesStock = product.stock <= product.minThreshold;
            else if (stockFilter === 'low') matchesStock = product.stock > product.minThreshold && product.stock <= product.minThreshold * config.lowStockThreshold;
            else if (stockFilter === 'good') matchesStock = product.stock > product.minThreshold * config.lowStockThreshold;
        }
        
        return matchesSearch && matchesSupplier && matchesStock;
    });
    
    filteredProducts.forEach(product => {
        const statusClass = getStockStatusClass(product);
        const alertBadge = getAlertBadge(product);
        const supplierName = getSupplierName(product.supplierId);
        
        const row = `
            <tr class="${statusClass}">
                <td>P${String(product.id).padStart(3, '0')}</td>
                <td>${product.name}</td>
                <td>${supplierName}</td>
                <td>${product.stock}</td>
                <td>${product.minThreshold}</td>
                <td>${product.maxThreshold}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${formatCurrency(product.stock * product.price)}</td>
                <td>${alertBadge}</td>
                <td class="flex space-x-2">
                    <button class="btn-edit bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-lg" 
                            data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button class="btn-delete bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-lg" 
                            data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </td>
            </tr>
        `;
        
        tbody.append(row);
    });
    
    // Ajouter les gestionnaires d'événements pour les boutons d'édition et de suppression
    $('.btn-edit').on('click', function() {
        const productId = parseInt($(this).data('id'));
        const product = products.find(p => p.id === productId);
        openProductModal(product);
    });
    
    $('.btn-delete').on('click', function() {
        const productId = parseInt($(this).data('id'));
        showConfirmation('Êtes-vous sûr de vouloir supprimer ce produit ?', async () => {
            await deleteProduct(productId);
            showNotification('Produit supprimé avec succès', 'success');
            renderStockTable();
        });
    });
    
    // Réinitialiser DataTables
    initDataTables();
}

// Rendre le tableau des mouvements
function renderMovementsTable() {
    const tbody = $('#movementsTableBody');
    tbody.empty();
    
    const dateFilter = $('#dateFilter').val();
    const typeFilter = $('#typeFilter').val();
    
    let filteredMovements = [...movements];
    
    if (dateFilter) {
        filteredMovements = filteredMovements.filter(m => m.date === dateFilter);
    }
    
    if (typeFilter) {
        filteredMovements = filteredMovements.filter(m => m.type === typeFilter);
    }
    
    // Trier par date décroissante
    filteredMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filteredMovements.forEach(movement => {
        const product = products.find(p => p.id === movement.productId);
        const productName = product ? product.name : 'Produit inconnu';
        
        const typeBadge = movement.type === 'entry' ? 
            `<span class="alert-badge success">ENTRÉE</span>` : 
            `<span class="alert-badge warning">SORTIE</span>`;
        
        const row = `
            <tr>
                <td>${formatDate(movement.date)}</td>
                <td>${typeBadge}</td>
                <td>${productName}</td>
                <td>${movement.quantity}</td>
                <td>${movement.reason}</td>
                <td>${movement.previousStock}</td>
                <td>${movement.newStock}</td>
            </tr>
        `;
        
        tbody.append(row);
    });
    
    // Réinitialiser DataTables
    initDataTables();
}

// Rendre le tableau des fournisseurs
function renderSuppliersTable() {
    const tbody = $('#suppliersTableBody');
    tbody.empty();
    
    suppliers.forEach(supplier => {
        const productCount = getProductCountBySupplier(supplier.id);
        
        const row = `
            <tr>
                <td>F${String(supplier.id).padStart(2, '0')}</td>
                <td>${supplier.name}</td>
                <td>${productCount}</td>
                <td>${supplier.contact || 'N/A'}</td>
                <td>${supplier.email || 'N/A'}</td>
                <td class="flex space-x-2">
                    <button class="btn-edit-supplier bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-lg" 
                            data-id="${supplier.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                    <button class="btn-contact bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-lg" 
                            data-id="${supplier.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                    </button>
                </td>
            </tr>
        `;
        
        tbody.append(row);
    });
    
    // Gestion des événements
    $('.btn-edit-supplier').on('click', function() {
        const supplierId = parseInt($(this).data('id'));
        const supplier = suppliers.find(s => s.id === supplierId);
        openSupplierModal(supplier);
    });
    
    $('.btn-contact').on('click', function() {
        const supplierId = parseInt($(this).data('id'));
        const supplier = suppliers.find(s => s.id === supplierId);
        
        if (!supplier.phone && !supplier.email) {
            showNotification('Aucune information de contact disponible', 'info');
            return;
        }
        
        let contactInfo = '';
        if (supplier.phone) contactInfo += `📞 ${supplier.phone}\n`;
        if (supplier.email) contactInfo += `✉️ ${supplier.email}`;
        
        Swal.fire({
            title: `Contact - ${supplier.name}`,
            text: contactInfo,
            icon: 'info',
            confirmButtonText: 'Fermer'
        });
    });
    
    // Réinitialiser DataTables
    initDataTables();
}

// Rendre le tableau des alertes
function renderAlertsTable() {
    const tbody = $('#alertsTableBody');
    tbody.empty();
    
    const alerts = getAlerts();
    
    alerts.forEach(alert => {
        const priorityBadge = alert.priority === 'critical' ? 
            '<span class="alert-badge critical">HAUTE</span>' : 
            '<span class="alert-badge warning">MOYENNE</span>';
        
        const row = `
            <tr>
                <td>${priorityBadge}</td>
                <td>${alert.name}</td>
                <td>${getSupplierName(alert.supplierId)}</td>
                <td>${alert.stock}</td>
                <td>${alert.minThreshold}</td>
                <td>${alert.toOrder}</td>
                <td>
                    <button class="btn-order bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-lg" 
                            data-supplier="${alert.supplierId}">
                        Commander
                    </button>
                </td>
            </tr>
        `;
        
        tbody.append(row);
    });
    
    // Gestion des événements
    $('.btn-order').on('click', function() {
        const supplierId = parseInt($(this).data('supplier'));
        const supplier = suppliers.find(s => s.id === supplierId);
        
        showConfirmation(`Confirmer la commande auprès de ${supplier.name} ?`, () => {
            showNotification(`Commande envoyée à ${supplier.name} avec succès`, 'success');
        });
    });
    
    // Mettre à jour les compteurs d'alertes
    const criticalCount = alerts.filter(a => a.priority === 'critical').length;
    const warningCount = alerts.filter(a => a.priority === 'warning').length;
    
    $('#criticalAlerts').text(criticalCount);
    $('#warningAlerts').text(warningCount);
    $('#infoAlerts').text(0); // Pas d'alertes info dans ce système
    
    // Réinitialiser DataTables
    initDataTables();
}

// Mettre à jour le dashboard
function updateDashboard() {
    const stats = getStockStats();
    
    // Mettre à jour les statistiques principales
    $('#totalProductsStat').text(stats.total);
    $('#totalValueStat').text(formatCurrency(stats.totalValue));
    $('#lowStockStat').text(stats.critical + stats.low);
    $('#suppliersStat').text(stats.suppliers);
    
    // Mettre à jour les en-têtes
    $('#headerCritical').text(stats.critical);
    $('#headerLow').text(stats.low);
    
    // Mettre à jour le graphique de répartition
    if (window.stockChart) {
        window.stockChart.data.datasets[0].data = [
            stats.critical,
            stats.low,
            stats.good
        ];
        window.stockChart.update();
    }
    
    // Mettre à jour le graphique des mouvements
    if (window.movementsChart) {
        // Obtenir les données pour les 7 derniers jours
        const last7Days = [];
        const entries = [];
        const exits = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
            last7Days.push(moment(date).format('DD/MM'));
            
            const dayEntries = movements.filter(m => 
                m.date === date && m.type === 'entry'
            ).reduce((sum, m) => sum + m.quantity, 0);
            
            const dayExits = movements.filter(m => 
                m.date === date && m.type === 'exit'
            ).reduce((sum, m) => sum + m.quantity, 0);
            
            entries.push(dayEntries);
            exits.push(dayExits);
        }
        
        window.movementsChart.data.labels = last7Days;
        window.movementsChart.data.datasets[0].data = entries;
        window.movementsChart.data.datasets[1].data = exits;
        window.movementsChart.update();
    }
    
    // Mettre à jour les activités récentes
    updateRecentActivities();
}

// Mettre à jour les activités récentes
function updateRecentActivities() {
    const activitiesContainer = $('#recentActivities');
    activitiesContainer.empty();
    
    const recentMovements = getRecentMovements(5);
    
    recentMovements.forEach(movement => {
        const product = products.find(p => p.id === movement.productId);
        const productName = product ? product.name : 'Produit inconnu';
        const supplierName = product ? getSupplierName(product.supplierId) : 'Inconnu';
        
        const activityItem = `
            <div class="activity-item p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-start">
                    <div class="mr-3 mt-1">
                        ${movement.type === 'entry' ? 
                            '<div class="p-2 bg-green-100 rounded-full"><span class="text-green-800">📥</span></div>' : 
                            '<div class="p-2 bg-yellow-100 rounded-full"><span class="text-yellow-800">📤</span></div>'}
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between">
                            <h4 class="font-semibold">${movement.type === 'entry' ? 'Entrée' : 'Sortie'} de stock</h4>
                            <span class="text-sm text-gray-500">${formatDate(movement.date)}</span>
                        </div>
                        <p class="text-gray-700">${movement.quantity} unités de ${productName}</p>
                        <div class="flex justify-between mt-1">
                            <span class="text-sm bg-gray-200 px-2 py-1 rounded">${supplierName}</span>
                            <span class="text-sm font-medium">${movement.reason}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        activitiesContainer.append(activityItem);
    });
}

// Générer un rapport
function generateReport(reportType) {
    let reportTitle, reportContent;
    
    switch (reportType) {
        case 'stock-status':
            reportTitle = "État du Stock";
            reportContent = `
                <h2 class="text-2xl font-bold mb-6 text-center">${reportTitle}</h2>
                <div class="mb-6">
                    <p><strong>Date du rapport:</strong> ${formatDate(moment().format('YYYY-MM-DD'))}</p>
                    <p><strong>Période:</strong> À jour</p>
                </div>
                
                <h3 class="text-xl font-semibold mb-4">Résumé</h3>
                <table class="w-full border-collapse mb-6">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border p-2 text-left">Catégorie</th>
                            <th class="border p-2 text-right">Valeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border p-2">Total Produits</td>
                            <td class="border p-2 text-right">${getStockStats().total}</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Valeur Totale du Stock</td>
                            <td class="border p-2 text-right">${formatCurrency(getStockStats().totalValue)}</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Produits en Stock Critique</td>
                            <td class="border p-2 text-right">${getStockStats().critical}</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Produits en Stock Bas</td>
                            <td class="border p-2 text-right">${getStockStats().low}</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3 class="text-xl font-semibold mb-4">Produits en Alertes</h3>
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border p-2 text-left">Produit</th>
                            <th class="border p-2 text-left">Fournisseur</th>
                            <th class="border p-2 text-right">Stock Actuel</th>
                            <th class="border p-2 text-right">Seuil Min</th>
                            <th class="border p-2 text-right">À Commander</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${getAlerts().map(alert => `
                            <tr>
                                <td class="border p-2">${alert.name}</td>
                                <td class="border p-2">${getSupplierName(alert.supplierId)}</td>
                                <td class="border p-2 text-right">${alert.stock}</td>
                                <td class="border p-2 text-right">${alert.minThreshold}</td>
                                <td class="border p-2 text-right">${alert.toOrder}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            break;
            
        case 'movement-analysis':
            reportTitle = "Analyse des Mouvements";
            // Calculer les statistiques des mouvements
            const totalEntries = movements.filter(m => m.type === 'entry').reduce((sum, m) => sum + m.quantity, 0);
            const totalExits = movements.filter(m => m.type === 'exit').reduce((sum, m) => sum + m.quantity, 0);
            const avgDailyEntries = totalEntries / (movements.length > 0 ? movements.length : 1);
            const avgDailyExits = totalExits / (movements.length > 0 ? movements.length : 1);
            
            reportContent = `
                <h2 class="text-2xl font-bold mb-6 text-center">${reportTitle}</h2>
                <div class="mb-6">
                    <p><strong>Date du rapport:</strong> ${formatDate(moment().format('YYYY-MM-DD'))}</p>
                    <p><strong>Période:</strong> 30 derniers jours</p>
                </div>
                
                <h3 class="text-xl font-semibold mb-4">Résumé des Mouvements</h3>
                <table class="w-full border-collapse mb-6">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border p-2 text-left">Métrique</th>
                            <th class="border p-2 text-right">Valeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border p-2">Total Entrées</td>
                            <td class="border p-2 text-right">${totalEntries}</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Total Sorties</td>
                            <td class="border p-2 text-right">${totalExits}</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Moyenne Entrées/Jour</td>
                            <td class="border p-2 text-right">${Math.round(avgDailyEntries)}</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Moyenne Sorties/Jour</td>
                            <td class="border p-2 text-right">${Math.round(avgDailyExits)}</td>
                        </tr>
                        <tr>
                            <td class="border p-2">Rotation du Stock</td>
                            <td class="border p-2 text-right">${((totalExits / getStockStats().totalValue) * 100).toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
                
                <h3 class="text-xl font-semibold mb-4">Top 5 des Produits les Plus Mouvementés</h3>
                <table class="w-full border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border p-2 text-left">Produit</th>
                            <th class="border p-2 text-left">Fournisseur</th>
                            <th class="border p-2 text-right">Total Entrées</th>
                            <th class="border p-2 text-right">Total Sorties</th>
                            <th class="border p-2 text-right">Stock Actuel</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products
                            .map(product => {
                                const entries = movements
                                    .filter(m => m.productId === product.id && m.type === 'entry')
                                    .reduce((sum, m) => sum + m.quantity, 0);
                                
                                const exits = movements
                                    .filter(m => m.productId === product.id && m.type === 'exit')
                                    .reduce((sum, m) => sum + m.quantity, 0);
                                
                                return {
                                    ...product,
                                    totalEntries: entries,
                                    totalExits: exits,
                                    totalMovements: entries + exits
                                };
                            })
                            .sort((a, b) => b.totalMovements - a.totalMovements)
                            .slice(0, 5)
                            .map(item => `
                                <tr>
                                    <td class="border p-2">${item.name}</td>
                                    <td class="border p-2">${getSupplierName(item.supplierId)}</td>
                                    <td class="border p-2 text-right">${item.totalEntries}</td>
                                    <td class="border p-2 text-right">${item.totalExits}</td>
                                    <td class="border p-2 text-right">${item.stock}</td>
                                </tr>
                            `)
                            .join('')
                        }
                    </tbody>
                </table>
            `;
            break;
            
        case 'supplier-performance':
            reportTitle = "Performance des Fournisseurs";
            reportContent = `
                <h2 class="text-2xl font-bold mb-6 text-center">${reportTitle}</h2>
                <div class="mb-6">
                    <p><strong>Date du rapport:</strong> ${formatDate(moment().format('YYYY-MM-DD'))}</p>
                    <p><strong>Période:</strong> 3 mois</p>
                </div>
                
                <h3 class="text-xl font-semibold mb-4">Résumé</h3>
                <p class="mb-6">Ce rapport évalue la performance des fournisseurs basé sur la disponibilité des produits et les alertes de stock.</p>
                
                <h3 class="text-xl font-semibold mb-4">Classement des Fournisseurs</h3>
                <table class="w-full border-collapse mb-6">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border p-2 text-left">Position</th>
                            <th class="border p-2 text-left">Fournisseur</th>
                            <th class="border p-2 text-left">Produits</th>
                            <th class="border p-2 text-right">Stock Critique</th>
                            <th class="border p-2 text-right">Stock Bas</th>
                            <th class="border p-2 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${suppliers
                            .map((supplier, index) => {
                                const supplierProducts = getProductsBySupplier(supplier.id);
                                const criticalCount = supplierProducts.filter(p => p.stock <= p.minThreshold).length;
                                const lowCount = supplierProducts.filter(p => p.stock > p.minThreshold && p.stock <= p.minThreshold * config.lowStockThreshold).length;
                                
                                // Calculer un score simple (moins d'alertes = meilleur score)
                                const score = ((supplierProducts.length - (criticalCount * 2 + lowCount)) / supplierProducts.length) * 100;
                                
                                return {
                                    ...supplier,
                                    productCount: supplierProducts.length,
                                    criticalCount,
                                    lowCount,
                                    score: isNaN(score) || !isFinite(score) ? 0 : score
                                };
                            })
                            .sort((a, b) => b.score - a.score)
                            .map((supplier, index) => `
                                <tr>
                                    <td class="border p-2">${index + 1}ᵉʳ</td>
                                    <td class="border p-2">${supplier.name}</td>
                                    <td class="border p-2">${supplier.productCount}</td>
                                    <td class="border p-2 text-right">${supplier.criticalCount}</td>
                                    <td class="border p-2 text-right">${supplier.lowCount}</td>
                                    <td class="border p-2 text-right font-bold ${supplier.score >= 80 ? 'text-green-600' : supplier.score >= 60 ? 'text-yellow-600' : 'text-red-600'}">
                                        ${supplier.score.toFixed(1)}%
                                    </td>
                                </tr>
                            `)
                            .join('')
                        }
                    </tbody>
                </table>
                
                <h3 class="text-xl font-semibold mb-4">Recommandations</h3>
                <ul class="list-disc pl-6 space-y-2">
                    <li>Priorisez les commandes auprès des fournisseurs avec un score inférieur à 60%</li>
                    <li>Contactez les fournisseurs avec un grand nombre de produits en stock critique</li>
                    <li>Évaluez la possibilité de diversifier vos sources pour les produits critiques</li>
                </ul>
            `;
            break;
            
        default:
            return;
    }
    
    // Créer la modale du rapport
    $('body').append(`
        <div id="reportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="modal-content bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="modal-header bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                    <h3 class="text-xl font-bold text-white">${reportTitle}</h3>
                    <button class="close-modal absolute top-4 right-4 text-white hover:text-gray-200">
                        <span class="text-2xl">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-6" id="reportContent">
                    ${reportContent}
                </div>
                <div class="modal-footer p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                    <button id="printReport" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" />
                        </svg>
                        Imprimer
                    </button>
                    <button id="exportReportExcel" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12l4-2 4 2 4-2V4a2 2 0 00-2-2H6zM4 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                        </svg>
                        Excel
                    </button>
                    <button id="exportReportPDF" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm6.5 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" />
                        </svg>
                        PDF
                    </button>
                </div>
            </div>
        </div>
    `);
    
    // Gestion des événements
    $('#reportModal .close-modal, #reportModal button:not([id])').on('click', function() {
        $('#reportModal').remove();
    });
    
    $('#printReport').on('click', function() {
        $('#reportContent').printThis({
            importCSS: true,
            loadCSS: "assets/css/style.css",
            header: `<h1 class="text-center">${reportTitle}</h1>`,
            footer: `<div class="text-center text-sm mt-4">Généré le ${formatDate(moment().format('YYYY-MM-DD'))}</div>`
        });
    });
    
    $('#exportReportExcel').on('click', function() {
        exportReportToExcel(reportTitle, reportContent);
    });
    
    $('#exportReportPDF').on('click', function() {
        exportReportToPDF(reportTitle, reportContent);
    });
}