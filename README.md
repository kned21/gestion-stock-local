# 📦 Gestion Stock Pro - Système de Gestion de Stock Avancé

![Gestion Stock Pro](screenshots/screenshot-dashboard.png)

## 🌟 Présentation

**Gestion Stock Pro** est une application web complète de gestion de stock avec alertes automatiques, conçue spécifiquement pour les petites et moyennes entreprises. Ce système permet de gérer efficacement vos produits, fournisseurs, mouvements de stock et génère des rapports détaillés pour une meilleure prise de décision.

## 🔍 Fonctionnalités principales

- **Gestion complète des produits** avec suivi du stock en temps réel
- **Alertes automatiques** lorsque le stock atteint le seuil minimum
- **Suivi détaillé des mouvements** (entrées et sorties)
- **Gestion des fournisseurs** avec leurs produits associés
- **Tableaux de bord analytiques** avec visualisation des données
- **Export vers Excel et PDF** pour les rapports
- **Mode hors-ligne** grâce au stockage local
- **Interface moderne et responsive** utilisable sur tous les appareils
- **Sauvegarde automatique** des données

## 🛠 Technologies utilisées

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Tailwind CSS pour le style
  - jQuery pour la manipulation du DOM
  - Chart.js pour les graphiques
  - DataTables pour les tableaux avancés
  - SweetAlert2 pour les notifications

- **Stockage**:
  - LocalForage pour le stockage local hors-ligne
  - Sauvegardes automatiques

- **Export**:
  - SheetJS (xlsx) pour l'export Excel
  - jsPDF pour l'export PDF
  - html2pdf pour la conversion HTML en PDF

## 🚀 Installation

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/votre-compte/gestion-stock-pro.git
   ```

2. Ouvrez le projet dans votre navigateur :
   - Double-cliquez sur le fichier `index.html` dans le dossier du projet
   - OU utilisez un serveur web local (recommandé pour éviter les problèmes de sécurité avec les bibliothèques JavaScript)

3. Le système est prêt à l'emploi avec des données de démonstration préchargées.

## 💻 Utilisation

1. **Tableau de bord** : Visualisez rapidement l'état de votre stock avec des graphiques et statistiques
2. **Gestion des stocks** : Consultez, ajoutez, modifiez ou supprimez des produits
3. **Mouvements de stock** : Enregistrez les entrées et sorties de stock
4. **Alertes** : Consultez les produits nécessitant une attention immédiate
5. **Rapports** : Générez des rapports détaillés pour l'analyse

## 📂 Structure du projet

```
Gestion-Stock/
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── script.js
│   │   ├── data.js
│   │   ├── components.js
│   │   ├── utils.js
│   │   └── export.js
│   └── libs/
│       ├── jquery-3.6.0.min.js
│       ├── tailwind-1.9.6.min.css
│       ├── chart.min.js
│       ├── xlsx.full.min.js
│       ├── jspdf.umd.min.js
│       ├── sweetalert2.min.js
│       ├── datatables.min.js
│       ├── localforage.min.js
│       ├── moment.min.js
│       ├── printThis.js
│       └── html2pdf.bundle.min.js
├── data/
│   └── backup/
├── exports/
├── config/
│   └── app.config.js
└── README.md
```

## 📷 Captures d'écran

| Dashboard | Gestion des stocks |
|-----------|-------------------|
| ![Dashboard](screenshots/screenshot-dashboard.png) | ![Stock](screenshots/screenshot-stock.png) |

| Alertes | Rapports |
|---------|----------|
| ![Alertes](screenshots/screenshot-alerts.png) | ![Rapports](screenshots/screenshot-reports.png) |

## 📜 License

Ce projet est sous license MIT. Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

---

> Développé avec ❤️ pour les petites entreprises qui ont besoin d'un système de gestion de stock simple mais puissant.

# .gitignore

```
# Fichiers système
.DS_Store
Thumbs.db
*.log
*.tmp
*.swp
*~

# Dossiers de sauvegarde
/data/backup/*
!/data/backup/.gitkeep

# Fichiers exportés
/exports/*
!/exports/.gitkeep

# Fichiers de configuration locaux
/config/local.config.js

# Fichiers temporaires
/temp/
/tmp/

# Fichiers de développement
/node_modules/
/bower_components/

# Fichiers de sauvegarde de l'éditeur
*.sublime-workspace
*.sublime-project
*.vscode/
*.idea/

# Fichiers de cache
.cache/
.cache/*
!/cache/.gitkeep

# Fichiers de déploiement
.DS_Store
.deploy/
.deploy/*

# Fichiers de test
/test/
/tests/
__tests__/

# Captures d'écran (à ajouter manuellement si nécessaire)
/screenshots/*
!/screenshots/.gitkeep

# Fichiers de données temporaires
*.bak
*.orig
*.patch
```