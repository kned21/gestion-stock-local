// Configuration globale de l'application
const AppConfig = {
    appName: "Gestion Stock Pro",
    version: "1.0.0",
    companyName: "Votre Entreprise",
    currency: "FCFA",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm",
    defaultMinThreshold: 10,
    defaultMaxThreshold: 100,
    autoSaveInterval: 30000, // 30 secondes
    backupRetention: 7, // 7 jours de sauvegardes
    lowStockThreshold: 1.5, // x le seuil minimum pour considérer comme "bas"
    
    // Configuration des couleurs
    colors: {
        primary: "#3b82f6",
        secondary: "#6366f1",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        info: "#06b6d4"
    },
    
    // Configuration des alertes
    alerts: {
        critical: { threshold: 1, class: "stock-critical", badge: "critical" },
        warning: { threshold: 1.5, class: "stock-low", badge: "warning" },
        good: { threshold: 1.5, class: "stock-good", badge: "success" }
    },
    
    // Configuration de stockage
    storage: {
        productsKey: "stock_pro_products",
        suppliersKey: "stock_pro_suppliers",
        movementsKey: "stock_pro_movements",
        settingsKey: "stock_pro_settings"
    },
    
    // Configuration des exports
    export: {
        excelFileName: `stock_export_${moment().format('YYYYMMDD')}.xlsx`,
        pdfFileName: `stock_report_${moment().format('YYYYMMDD')}.pdf`,
        defaultSheetName: "Stock"
    }
};

// Initialiser les données par défaut si nécessaire
function initAppConfig() {
    // Configuration par défaut si aucune n'est présente
    if (!localStorage.getItem('appConfig')) {
        localStorage.setItem('appConfig', JSON.stringify(AppConfig));
    }
    
    return AppConfig;
}

// Charger la configuration
const config = initAppConfig();