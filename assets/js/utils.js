// Fonctions utilitaires

// Formatage des nombres
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Formatage des dates
function formatDate(dateString, format = config.dateFormat) {
    return moment(dateString).format(format);
}

// Formatage des heures
function formatTime(dateString, format = config.timeFormat) {
    return moment(dateString).format(format);
}

// Formatage combiné date/heure
function formatDateTime(dateString) {
    return moment(dateString).format(`${config.dateFormat} ${config.timeFormat}`);
}

// Génération d'ID unique
function generateUniqueId() {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Obtenir le statut du stock
function getStockStatus(product) {
    if (product.stock <= product.minThreshold) {
        return 'critical';
    } else if (product.stock <= product.minThreshold * config.lowStockThreshold) {
        return 'warning';
    } else {
        return 'good';
    }
}

// Obtenir la classe CSS correspondant au statut
function getStockStatusClass(product) {
    const status = getStockStatus(product);
    return config.alerts[status].class;
}

// Obtenir le badge d'alerte
function getAlertBadge(product) {
    const status = getStockStatus(product);
    const badgeText = status === 'critical' ? 'Critique' : status === 'warning' ? 'Bas' : 'Bon';
    return `<span class="alert-badge ${config.alerts[status].badge}">${badgeText}</span>`;
}

// Calculer la valeur totale du stock
function calculateTotalStockValue() {
    return products.reduce((total, product) => total + (product.stock * product.price), 0);
}

// Obtenir le nom d'un fournisseur
function getSupplierName(supplierId) {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Fournisseur inconnu';
}

// Obtenir le nom d'un produit
function getProductName(productId) {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produit inconnu';
}

// Obtenir les produits par fournisseur
function getProductsBySupplier(supplierId) {
    return products.filter(p => p.supplierId === supplierId);
}

// Obtenir le nombre de produits par fournisseur
function getProductCountBySupplier(supplierId) {
    return getProductsBySupplier(supplierId).length;
}

// Obtenir les mouvements par produit
function getMovementsByProduct(productId) {
    return movements.filter(m => m.productId === productId);
}

// Obtenir les mouvements récents
function getRecentMovements(limit = 5) {
    return [...movements]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

// Générer une notification
function showNotification(message, type = 'info', duration = 3000) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: duration,
        timerProgressBar: true,
        customClass: {
            popup: 'swal2-toast'
        }
    });
}

// Afficher une confirmation
function showConfirmation(message, callback) {
    Swal.fire({
        title: 'Confirmation',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: config.colors.primary,
        cancelButtonColor: config.colors.danger,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}