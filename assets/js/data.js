// Gestion des données avec LocalForage
let products = [];
let suppliers = [];
let movements = [];

// Initialiser les données
async function initAppData() {
    try {
        // Charger les données existantes ou utiliser les données par défaut
        const [loadedProducts, loadedSuppliers, loadedMovements] = await Promise.all([
            localforage.getItem('stock_pro_products'),
            localforage.getItem('stock_pro_suppliers'),
            localforage.getItem('stock_pro_movements')
        ]);
        
        // Si aucune donnée n'existe, utiliser les données par défaut
        if (!loadedProducts || !loadedSuppliers || !loadedMovements) {
            await resetDefaultData();
        } else {
            products = loadedProducts || [];
            suppliers = loadedSuppliers || [];
            movements = loadedMovements || [];
        }
        
        // Lancer l'auto-sauvegarde
        startAutoSave();
        
        return true;
    } catch (error) {
        console.error("Erreur lors de l'initialisation des données:", error);
        await resetDefaultData();
        return false;
    }
}

// Réinitialiser avec des données par défaut
async function resetDefaultData() {
    // Liste des fournisseurs
    suppliers = [
        { id: 1, name: "Mr Joel", contact: "", email: "", phone: "" },
        { id: 2, name: "Groupe Ship", contact: "", email: "", phone: "" },
        { id: 3, name: "Mme Gladys", contact: "", email: "", phone: "" },
        { id: 4, name: "Mr Guy", contact: "", email: "", phone: "" },
        { id: 5, name: "Mr Michael", contact: "", email: "", phone: "" },
        { id: 6, name: "Mme Esther", contact: "", email: "", phone: "" },
        { id: 7, name: "Mme Ada", contact: "", email: "", phone: "" },
        { id: 8, name: "Groupe Alliance Cosmétique", contact: "", email: "", phone: "" },
        { id: 9, name: "Mr Serge", contact: "", email: "", phone: "" },
        { id: 10, name: "Mr Duval", contact: "", email: "", phone: "" },
        { id: 11, name: "Mr Ferrari", contact: "", email: "", phone: "" },
        { id: 12, name: "Mr Ali", contact: "", email: "", phone: "" },
        { id: 13, name: "Mr Ntsika", contact: "", email: "", phone: "" },
        { id: 14, name: "Mr Jean", contact: "", email: "", phone: "" },
        { id: 15, name: "Mr Eli", contact: "", email: "", phone: "" },
        { id: 16, name: "Mr Samba", contact: "", email: "", phone: "" },
        { id: 17, name: "Mr Winner", contact: "", email: "", phone: "" },
        { id: 18, name: "Mme Makon", contact: "", email: "", phone: "" },
        { id: 19, name: "Mme Essential", contact: "", email: "", phone: "" },
        { id: 20, name: "Mme Zara", contact: "", email: "", phone: "" },
        { id: 21, name: "Mr Therny", contact: "", email: "", phone: "" },
        { id: 22, name: "Mme Wilna", contact: "", email: "", phone: "" },
        { id: 23, name: "Mme Priscille", contact: "", email: "", phone: "" }
    ];

    // Liste des produits par fournisseur
    products = [
        // Groupe Ship (id: 2)
        { id: 1, name: "Gel Doré", supplierId: 2, stock: 15, minThreshold: 10, maxThreshold: 50, price: 2500 },
        { id: 2, name: "Gel intime", supplierId: 2, stock: 8, minThreshold: 5, maxThreshold: 30, price: 3000 },
        { id: 3, name: "Collagen Night Care", supplierId: 2, stock: 12, minThreshold: 8, maxThreshold: 40, price: 4500 },
        { id: 4, name: "Smart anti snoring", supplierId: 2, stock: 5, minThreshold: 3, maxThreshold: 20, price: 8000 },
        { id: 5, name: "Snore Free Noseclip", supplierId: 2, stock: 7, minThreshold: 5, maxThreshold: 25, price: 6000 },
        { id: 6, name: "Lunettes manche Doré noire", supplierId: 2, stock: 25, minThreshold: 10, maxThreshold: 50, price: 3500 },
        { id: 7, name: "Lunettes manche marron", supplierId: 2, stock: 20, minThreshold: 10, maxThreshold: 50, price: 3500 },
        { id: 8, name: "Lunettes fumée", supplierId: 2, stock: 18, minThreshold: 10, maxThreshold: 50, price: 4000 },
        { id: 9, name: "Poudre Miracle Withener", supplierId: 2, stock: 30, minThreshold: 15, maxThreshold: 60, price: 5000 },
        { id: 10, name: "Baskets Snickers", supplierId: 2, stock: 12, minThreshold: 5, maxThreshold: 30, price: 15000 },
        { id: 11, name: "Chaussures carton Noire", supplierId: 2, stock: 8, minThreshold: 5, maxThreshold: 25, price: 12000 },
        { id: 12, name: "Chaussures carton Marron", supplierId: 2, stock: 6, minThreshold: 5, maxThreshold: 25, price: 12000 },
        { id: 13, name: "Chaussures hors carton noire", supplierId: 2, stock: 10, minThreshold: 5, maxThreshold: 30, price: 10000 },
        { id: 14, name: "Chaussures hors carton marron", supplierId: 2, stock: 9, minThreshold: 5, maxThreshold: 30, price: 10000 },
        { id: 15, name: "Chaussures Marron-Noire", supplierId: 2, stock: 7, minThreshold: 5, maxThreshold: 30, price: 11000 },

        // Mme Gladys (id: 3)
        { id: 16, name: "Nuisettes 3 en 1", supplierId: 3, stock: 22, minThreshold: 10, maxThreshold: 50, price: 4500 },
        { id: 17, name: "Nuisettes 4 en 1", supplierId: 3, stock: 18, minThreshold: 10, maxThreshold: 50, price: 5500 },
        { id: 18, name: "Demis", supplierId: 3, stock: 35, minThreshold: 15, maxThreshold: 60, price: 2000 },
        { id: 19, name: "Pantalon Ankara", supplierId: 3, stock: 14, minThreshold: 8, maxThreshold: 40, price: 6000 },
        { id: 20, name: "Culotte Ankara", supplierId: 3, stock: 28, minThreshold: 15, maxThreshold: 50, price: 3000 },
        { id: 21, name: "Joggings", supplierId: 3, stock: 16, minThreshold: 10, maxThreshold: 40, price: 7500 },
        { id: 22, name: "Montre", supplierId: 3, stock: 11, minThreshold: 5, maxThreshold: 30, price: 12000 },

        // Mme Ada (id: 7)
        { id: 23, name: "Gros savon 2 en 1", supplierId: 7, stock: 45, minThreshold: 20, maxThreshold: 80, price: 1500 },
        { id: 24, name: "Petit savon 2 en 1", supplierId: 7, stock: 60, minThreshold: 30, maxThreshold: 100, price: 1000 },
        { id: 25, name: "Savon Hydratant", supplierId: 7, stock: 38, minThreshold: 20, maxThreshold: 70, price: 1800 },
        { id: 26, name: "Savon Exfoliating", supplierId: 7, stock: 32, minThreshold: 15, maxThreshold: 60, price: 2200 },
        { id: 27, name: "Serum Anti-Tâche", supplierId: 7, stock: 25, minThreshold: 10, maxThreshold: 50, price: 8500 },
        { id: 28, name: "Serum Anti-Melasma", supplierId: 7, stock: 18, minThreshold: 10, maxThreshold: 40, price: 9500 },
        { id: 29, name: "Crème réparatrice", supplierId: 7, stock: 22, minThreshold: 12, maxThreshold: 45, price: 7000 },
        { id: 30, name: "Crème éclat", supplierId: 7, stock: 28, minThreshold: 15, maxThreshold: 50, price: 6500 },
        { id: 31, name: "Collagen Peptides", supplierId: 7, stock: 12, minThreshold: 8, maxThreshold: 35, price: 12000 },
        { id: 32, name: "Masques", supplierId: 7, stock: 40, minThreshold: 20, maxThreshold: 70, price: 3500 },
        { id: 33, name: "Lait Hydratant", supplierId: 7, stock: 35, minThreshold: 18, maxThreshold: 60, price: 4500 },
        { id: 34, name: "Lait Éclaircissant", supplierId: 7, stock: 30, minThreshold: 15, maxThreshold: 55, price: 5500 },

        // Mme Esther (id: 6)
        { id: 35, name: "Simi", supplierId: 6, stock: 8, minThreshold: 5, maxThreshold: 25, price: 4000 },
        { id: 36, name: "Irum bouteille", supplierId: 6, stock: 12, minThreshold: 8, maxThreshold: 30, price: 6500 },
        { id: 37, name: "Gros pot Minu", supplierId: 6, stock: 15, minThreshold: 10, maxThreshold: 40, price: 8000 },
        { id: 38, name: "Petit pot Minu", supplierId: 6, stock: 20, minThreshold: 12, maxThreshold: 45, price: 6000 },
        { id: 39, name: "Hyper derma", supplierId: 6, stock: 10, minThreshold: 6, maxThreshold: 30, price: 15000 },

        // Mr Guy (id: 4)
        { id: 40, name: "Sac à dos", supplierId: 4, stock: 25, minThreshold: 15, maxThreshold: 50, price: 9500 },
        { id: 41, name: "Trousses", supplierId: 4, stock: 38, minThreshold: 20, maxThreshold: 70, price: 4500 },
        { id: 42, name: "Crayons", supplierId: 4, stock: 100, minThreshold: 50, maxThreshold: 200, price: 500 },
        { id: 43, name: "Apple Watch", supplierId: 4, stock: 8, minThreshold: 5, maxThreshold: 20, price: 75000 },

        // Mr Winner (id: 17)
        { id: 44, name: "Pommade énergie verte gros pot", supplierId: 17, stock: 12, minThreshold: 8, maxThreshold: 35, price: 6500 },
        { id: 45, name: "Pommade énergie verte petit pot", supplierId: 17, stock: 18, minThreshold: 10, maxThreshold: 40, price: 4500 },
        { id: 46, name: "Pommade énergie noire", supplierId: 17, stock: 14, minThreshold: 8, maxThreshold: 35, price: 4500 },
        { id: 47, name: "Pommade énergie citron", supplierId: 17, stock: 16, minThreshold: 10, maxThreshold: 40, price: 4500 },
        { id: 48, name: "Bouteille de tisane", supplierId: 17, stock: 22, minThreshold: 12, maxThreshold: 50, price: 3500 },

        // Mme Makon (id: 18)
        { id: 49, name: "Lace Glue bouteille rose", supplierId: 18, stock: 15, minThreshold: 10, maxThreshold: 40, price: 5500 },
        { id: 50, name: "Buttocks", supplierId: 18, stock: 10, minThreshold: 6, maxThreshold: 30, price: 12000 },
        { id: 51, name: "Formule Ventre Plat", supplierId: 18, stock: 18, minThreshold: 12, maxThreshold: 45, price: 8500 },
        { id: 52, name: "Formule Minceur", supplierId: 18, stock: 20, minThreshold: 15, maxThreshold: 50, price: 8000 },
        { id: 53, name: "Virility", supplierId: 18, stock: 12, minThreshold: 8, maxThreshold: 35, price: 15000 },

        // Mme Essential (id: 19)
        { id: 54, name: "Écouteurs", supplierId: 19, stock: 25, minThreshold: 15, maxThreshold: 60, price: 6500 },
        { id: 55, name: "Super booster", supplierId: 19, stock: 30, minThreshold: 20, maxThreshold: 70, price: 4500 },
        { id: 56, name: "Mini ventilateur", supplierId: 19, stock: 18, minThreshold: 10, maxThreshold: 40, price: 8500 },
        { id: 57, name: "Mini Aspirateur", supplierId: 19, stock: 12, minThreshold: 8, maxThreshold: 30, price: 12000 },

        // Mme Zara (id: 20)
        { id: 58, name: "Dexe Shampoings", supplierId: 20, stock: 40, minThreshold: 20, maxThreshold: 80, price: 3500 },
        { id: 59, name: "Boxers 2xl", supplierId: 20, stock: 35, minThreshold: 25, maxThreshold: 70, price: 2500 },
        { id: 60, name: "Boxers 3xl", supplierId: 20, stock: 28, minThreshold: 20, maxThreshold: 60, price: 2500 },
        { id: 61, name: "Boxers 4xl", supplierId: 20, stock: 22, minThreshold: 15, maxThreshold: 50, price: 2500 },

        // Mr Eli (id: 15)
        { id: 62, name: "Sadoer", supplierId: 15, stock: 15, minThreshold: 10, maxThreshold: 40, price: 7500 },
        { id: 63, name: "Sadoer Eyes", supplierId: 15, stock: 12, minThreshold: 8, maxThreshold: 35, price: 9500 },

        // Mr Duval (id: 10)
        { id: 64, name: "Parfum de voiture", supplierId: 10, stock: 30, minThreshold: 15, maxThreshold: 60, price: 4500 },

        // Mr Therny (id: 21)
        { id: 65, name: "The snail", supplierId: 21, stock: 18, minThreshold: 12, maxThreshold: 45, price: 8500 },

        // Mr Jean (id: 14)
        { id: 66, name: "Moika cream", supplierId: 14, stock: 22, minThreshold: 15, maxThreshold: 50, price: 7500 },
        { id: 67, name: "Moika Triple power", supplierId: 14, stock: 18, minThreshold: 12, maxThreshold: 45, price: 8500 },
        { id: 68, name: "Slimming", supplierId: 14, stock: 14, minThreshold: 10, maxThreshold: 40, price: 9500 },
        { id: 69, name: "Mk", supplierId: 14, stock: 20, minThreshold: 15, maxThreshold: 50, price: 7000 },

        // Mr Joel (id: 1)
        { id: 70, name: "B3", supplierId: 1, stock: 25, minThreshold: 15, maxThreshold: 60, price: 6500 },

        // Mr Samba (id: 16)
        { id: 71, name: "Étui iPhone 11 Pro max noir écran clair", supplierId: 16, stock: 12, minThreshold: 8, maxThreshold: 30, price: 5500 },
        { id: 72, name: "Étui iPhone 11 6.5\" noir écran fumé", supplierId: 16, stock: 15, minThreshold: 10, maxThreshold: 35, price: 5000 },
        { id: 73, name: "Étui iPhone 11 6.1\" noir écran fumé", supplierId: 16, stock: 18, minThreshold: 12, maxThreshold: 40, price: 5000 },
        { id: 74, name: "Étui iPhone 12 noir écran clair", supplierId: 16, stock: 14, minThreshold: 10, maxThreshold: 35, price: 5500 },
        { id: 75, name: "Étui iPhone 12 Pro max écran fumé", supplierId: 16, stock: 10, minThreshold: 8, maxThreshold: 30, price: 6000 },
        { id: 76, name: "Étui iPhone 13 Pro écran clair", supplierId: 16, stock: 16, minThreshold: 12, maxThreshold: 40, price: 6500 },
        { id: 77, name: "Étui iPhone 13 Pro max écran clair", supplierId: 16, stock: 12, minThreshold: 10, maxThreshold: 35, price: 7000 },
        { id: 78, name: "Étui iPhone 14 6.1\" écran fumé", supplierId: 16, stock: 20, minThreshold: 15, maxThreshold: 50, price: 5500 },
        { id: 79, name: "Étui iPhone 15 6.1\" écran fumé", supplierId: 16, stock: 18, minThreshold: 15, maxThreshold: 50, price: 6000 },
        { id: 80, name: "Étui iPhone 15 Pro max écran clair", supplierId: 16, stock: 14, minThreshold: 10, maxThreshold: 40, price: 7500 },
        { id: 81, name: "Étui iPhone 16 6.1\" écran fumé", supplierId: 16, stock: 12, minThreshold: 10, maxThreshold: 35, price: 6500 },
        { id: 82, name: "Étui iPhone 16 Pro noir écran fumé", supplierId: 16, stock: 10, minThreshold: 8, maxThreshold: 30, price: 7000 },
        { id: 83, name: "Étui iPhone 16 écran clair", supplierId: 16, stock: 15, minThreshold: 12, maxThreshold: 40, price: 6500 },
        { id: 84, name: "Étui iPhone 16 Pro max écran clair", supplierId: 16, stock: 8, minThreshold: 6, maxThreshold: 25, price: 8000 },

        // Mr Ali (id: 12)
        { id: 85, name: "Prothèse dentaire", supplierId: 12, stock: 6, minThreshold: 4, maxThreshold: 20, price: 25000 },

        // Mr Ferrari (id: 11)
        { id: 86, name: "Ronfit forte", supplierId: 11, stock: 15, minThreshold: 10, maxThreshold: 40, price: 8500 },

        // Mr Serge (id: 9)
        { id: 87, name: "Café", supplierId: 9, stock: 40, minThreshold: 20, maxThreshold: 80, price: 3500 },
        { id: 88, name: "Lotions", supplierId: 9, stock: 35, minThreshold: 20, maxThreshold: 70, price: 4500 },
        { id: 89, name: "Parfum de bouche", supplierId: 9, stock: 28, minThreshold: 15, maxThreshold: 50, price: 3000 },
        { id: 90, name: "Sprays", supplierId: 9, stock: 32, minThreshold: 20, maxThreshold: 60, price: 3500 },

        // Mr Michael (id: 5)
        { id: 91, name: "Gold Caviar", supplierId: 5, stock: 12, minThreshold: 8, maxThreshold: 30, price: 18000 },
        { id: 92, name: "Acné", supplierId: 5, stock: 18, minThreshold: 12, maxThreshold: 45, price: 7500 },
        { id: 93, name: "Thé rose", supplierId: 5, stock: 25, minThreshold: 15, maxThreshold: 50, price: 4500 },
        { id: 94, name: "Thé vert", supplierId: 5, stock: 30, minThreshold: 20, maxThreshold: 60, price: 4000 },

        // Mme Wilna (id: 22)
        { id: 95, name: "Perruques avec bandeau", supplierId: 22, stock: 15, minThreshold: 10, maxThreshold: 40, price: 12000 },
        { id: 96, name: "Perruques sans bandeau", supplierId: 22, stock: 18, minThreshold: 12, maxThreshold: 45, price: 15000 },
        { id: 97, name: "Pose tête Perruques", supplierId: 22, stock: 22, minThreshold: 15, maxThreshold: 50, price: 8000 },
        { id: 98, name: "Sac à main", supplierId: 22, stock: 14, minThreshold: 10, maxThreshold: 35, price: 18000 }
    ];

    // Mouvements initiaux
    movements = [
        { id: 1, date: moment().format('YYYY-MM-DD'), type: 'entry', productId: 1, quantity: 50, reason: 'Réapprovisionnement', previousStock: 0, newStock: 50 },
        { id: 2, date: moment().subtract(1, 'days').format('YYYY-MM-DD'), type: 'exit', productId: 1, quantity: 15, reason: 'Vente', previousStock: 50, newStock: 35 },
        { id: 3, date: moment().subtract(2, 'days').format('YYYY-MM-DD'), type: 'exit', productId: 2, quantity: 12, reason: 'Vente', previousStock: 20, newStock: 8 },
        { id: 4, date: moment().subtract(3, 'days').format('YYYY-MM-DD'), type: 'entry', productId: 43, quantity: 10, reason: 'Nouvelle commande', previousStock: 0, newStock: 10 },
        { id: 5, date: moment().subtract(4, 'days').format('YYYY-MM-DD'), type: 'exit', productId: 43, quantity: 2, reason: 'Vente', previousStock: 10, newStock: 8 },
        { id: 6, date: moment().subtract(5, 'days').format('YYYY-MM-DD'), type: 'entry', productId: 23, quantity: 100, reason: 'Réapprovisionnement', previousStock: 0, newStock: 100 },
        { id: 7, date: moment().subtract(6, 'days').format('YYYY-MM-DD'), type: 'exit', productId: 23, quantity: 55, reason: 'Vente', previousStock: 100, newStock: 45 },
        { id: 8, date: moment().subtract(7, 'days').format('YYYY-MM-DD'), type: 'exit', productId: 70, quantity: 10, reason: 'Vente', previousStock: 35, newStock: 25 },
        { id: 9, date: moment().subtract(8, 'days').format('YYYY-MM-DD'), type: 'entry', productId: 85, quantity: 10, reason: 'Nouvelle commande', previousStock: 0, newStock: 10 },
        { id: 10, date: moment().subtract(9, 'days').format('YYYY-MM-DD'), type: 'exit', productId: 85, quantity: 4, reason: 'Vente', previousStock: 10, newStock: 6 }
    ];

    // Sauvegarder les données
    await Promise.all([
        localforage.setItem('stock_pro_products', products),
        localforage.setItem('stock_pro_suppliers', suppliers),
        localforage.setItem('stock_pro_movements', movements)
    ]);
}

// Sauvegarder les données
async function saveData() {
    try {
        await Promise.all([
            localforage.setItem('stock_pro_products', products),
            localforage.setItem('stock_pro_suppliers', suppliers),
            localforage.setItem('stock_pro_movements', movements)
        ]);
        return true;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des données:", error);
        return false;
    }
}

// Auto-sauvegarde périodique
function startAutoSave() {
    setInterval(async () => {
        await saveData();
        console.log("Données sauvegardées automatiquement");
    }, config.autoSaveInterval);
}

// Ajouter un produit
async function addProduct(product) {
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...product,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    products.push(newProduct);
    await saveData();
    return newProduct;
}

// Mettre à jour un produit
async function updateProduct(id, productData) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...productData };
    await saveData();
    return products[index];
}

// Supprimer un produit
async function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    products.splice(index, 1);
    await saveData();
    return true;
}

// Ajouter un mouvement
async function addMovement(movement) {
    const product = products.find(p => p.id === movement.productId);
    if (!product) throw new Error("Produit non trouvé");
    
    const previousStock = product.stock;
    let newStock;
    
    if (movement.type === 'entry') {
        newStock = previousStock + movement.quantity;
    } else if (movement.type === 'exit') {
        if (movement.quantity > previousStock) {
            throw new Error("Stock insuffisant");
        }
        newStock = previousStock - movement.quantity;
    } else {
        throw new Error("Type de mouvement invalide");
    }
    
    // Mettre à jour le stock du produit
    product.stock = newStock;
    
    const newMovement = {
        id: movements.length > 0 ? Math.max(...movements.map(m => m.id)) + 1 : 1,
        date: movement.date || moment().format('YYYY-MM-DD'),
        type: movement.type,
        productId: movement.productId,
        quantity: movement.quantity,
        reason: movement.reason,
        previousStock: previousStock,
        newStock: newStock,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    movements.push(newMovement);
    await saveData();
    return newMovement;
}

// Obtenir les statistiques
function getStockStats() {
    const critical = products.filter(p => p.stock <= p.minThreshold).length;
    const low = products.filter(p => p.stock > p.minThreshold && p.stock <= p.minThreshold * config.lowStockThreshold).length;
    const good = products.filter(p => p.stock > p.minThreshold * config.lowStockThreshold).length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    
    return {
        critical,
        low,
        good,
        total: products.length,
        totalValue,
        suppliers: suppliers.length
    };
}

// Obtenir les alertes
function getAlerts() {
    return products
        .filter(p => p.stock <= p.minThreshold * config.lowStockThreshold)
        .sort((a, b) => a.stock - b.stock)
        .map(product => ({
            ...product,
            priority: product.stock <= product.minThreshold ? 'critical' : 'warning',
            toOrder: Math.ceil((product.maxThreshold - product.stock) / 2)
        }));
}

// Obtenir l'historique des mouvements
function getMovementHistory(days = 30) {
    const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
    return movements.filter(m => m.date >= startDate);
}