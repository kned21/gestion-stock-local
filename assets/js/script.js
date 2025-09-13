// Script principal de l'application

$(document).ready(async function() {
    try {
        // Initialiser les données
        await initAppData();
        
        // Initialiser les composants UI
        initTabs();
        initFilters();
        initButtons();
        initCharts();
        
        // Remplir les filtres
        $('#supplierFilter').append(suppliers.map(s => 
            `<option value="${s.id}">${s.name}</option>`
        ));
        
        // Rendre les tableaux initiaux
        renderStockTable();
        renderMovementsTable();
        renderSuppliersTable();
        renderAlertsTable();
        
        // Mettre à jour le dashboard
        updateDashboard();
        
        // Initialiser la sauvegarde automatique
        initAutoBackup();
        
        console.log(`${config.appName} v${config.version} initialisé avec succès`);
    } catch (error) {
        console.error("Erreur lors de l'initialisation de l'application:", error);
        Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors du chargement de l\'application. Veuillez rafraîchir la page.',
            icon: 'error',
            confirmButtonText: 'Rafraîchir'
        }).then(() => {
            location.reload();
        });
    }
    
    // Gestionnaire pour les modales
    $(document).on('click', '.close-modal', function() {
        $(this).closest('.modal').remove();
    });
    
    // Gestionnaire pour les clics en dehors de la modale
    $(document).on('click', '.modal', function(e) {
        if ($(e.target).hasClass('modal')) {
            $(this).remove();
        }
    });
});

// Écouter les changements de stock pour les alertes
function checkStockAlerts() {
    const criticalProducts = products.filter(p => p.stock <= p.minThreshold);
    
    if (criticalProducts.length > 0) {
        // Créer une notification pour chaque produit critique
        criticalProducts.forEach(product => {
            const options = {
                body: `Stock critique pour ${product.name} (${product.stock}/${product.minThreshold})`,
                icon: 'assets/icons/alert.png',
                requireInteraction: true
            };
            
            // Vérifier si les notifications sont autorisées
            if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification('Alerte Stock Critique', options);
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            new Notification('Alerte Stock Critique', options);
                        }
                    });
                }
            }
            
            // Afficher une notification SweetAlert en plus
            showNotification(`Stock critique pour ${product.name} (${product.stock}/${product.minThreshold})`, 'error', 5000);
        });
    }
}

// Vérifier les alertes de stock périodiquement
setInterval(checkStockAlerts, 300000); // Toutes les 5 minutes