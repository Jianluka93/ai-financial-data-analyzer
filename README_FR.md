# Personal Finance Pro - Guide de l'Utilisateur

Bienvenue dans **Personal Finance Pro**, l'application intelligente pour le suivi et l'analyse de vos finances. Ce guide vous aidera à préparer vos fichiers et à tirer le meilleur parti des fonctionnalités de l'application.

---

## 🚀 Comment Commencer

1. **Préparer le fichier** : Assurez-vous que vos données sont dans un format pris en charge (Excel ou CSV).
2. **Télécharger les données** : Cliquez sur le bouton **"Télécharger"** en haut à droite et sélectionnez votre fichier.
3. **Analyser** : Une fois téléchargée, l'application générera automatiquement des graphiques, des statistiques et un tableau détaillé des transactions.
4. **Navigation dans les graphiques** : Vous pouvez afficher les données par jour, mois ou année. Dans la vue **Quotidienne**, utilisez les flèches pour naviguer entre les mois.
5. **Conseils IA** : Cliquez sur **"Générer des conseils IA"** pour recevoir une analyse personnalisée basée sur vos habitudes de dépenses.

---

## 📊 Formats de Fichiers Pris en Charge

L'application accepte les formats suivants :
- **Excel** : `.xlsx`, `.xls`
- **CSV** : `.csv` (séparés par des virgules ou des points-virgules)

### Structure de Fichier Recommandée
Pour une lecture optimale, votre fichier doit avoir une ligne d'en-tête avec des noms de colonnes clairs. L'application essaiera d'identifier automatiquement les colonnes en fonction des mots-clés suivants :

| Type de Donnée | Mots-clés Recherchés (insensible à la casse) |
| :--- | :--- |
| **Date** | `Data`, `Date`, `Giorno`, `Day` |
| **Description** | `Descrizione`, `Nome`, `Causale`, `Oggetto`, `Voce` |
| **Revenus** | `Entrata`, `Guadagno`, `Income`, `Profit`, `Credito`, `Incasso` |
| **Dépenses** | `Uscita`, `Spesa`, `Expense`, `Costo`, `Debito`, `Uscite` |

---

## 🌍 Support Multilingue
L'application prend en charge quatre langues :
- **Italien** (IT)
- **Anglais** (EN)
- **Allemand** (DE)
- **Français** (FR)

Vous pouvez changer la langue à tout moment à partir du menu déroulant en haut à droite.

---

## 🤖 Analyse IA (Locale avec Ollama)
L'intégration avec l'intelligence artificielle analyse vos flux de trésorerie pour :
- Identifier les dépenses récurrentes excessives.
- Suggérer des stratégies d'épargne.
- Fournir un résumé professionnel de votre performance financière.

L'analyse est effectuée **localement** via **Ollama** pour garantir une confidentialité maximale de vos données financières. Aucune connexion Internet ou clé API externe n'est requise.

---

## 🚀 Configuration d'Ollama
Pour utiliser l'assistant IA, vous devez avoir Ollama installé sur votre ordinateur :

1. **Installer Ollama** : Téléchargez-le sur [ollama.com](https://ollama.com).
2. **Télécharger un modèle** : Ouvrez votre terminal et choisissez un modèle en fonction des performances de votre PC :
   - **Modèle Lourd (Recommandé pour PC puissants)** : `ollama run llama3`
   - **Modèle Intermédiaire (Équilibré)** : `ollama run phi3`
   - **Modèle Léger (Pour PC moins puissants ou portables)** : `ollama run tinyllama`
3. **Configurer le CORS** : Pour permettre à l'application de communiquer avec Ollama depuis le navigateur, vous devez définir la variable d'environnement `OLLAMA_ORIGINS`.
   - **Windows (PowerShell)** : `$env:OLLAMA_ORIGINS="*"; ollama serve`
   - **Mac/Linux** : `OLLAMA_ORIGINS="*" ollama serve`
4. **Utilisation dans l'App** :
   - Dans la sezione **"Conseiller IA"**, écrivez le nom du modèle que vous avez installé (ex: `llama3`, `phi3` ou `tinyllama`) dans le champ **"Modèle Ollama"**.
   - **Paramètres Avancés** : Personnalisez la réponse en ajustant ces valeurs :
     - **Longueur Réponse (num_predict)** : Nombre maximal de jetons générés. Augmentez-le si la réponse est coupée (ex. 500-1000).
     - **Température** : Créativité du modello (0.1 = précis, 0.8 = créatif). 0.4-0.5 est recommandé pour les conseils financiers.
     - **Taille Contexte (num_ctx)** : Mémoire du modèle. Si vous avez beaucoup de données, augmentez-la (ex. 4096).
     - **Limite Données (slice)** : Nombre de caractères de données envoyés à l'IA. Augmentez ce valore si vous avez des milliers de lignes.
   - Cliquez sur **"Analyser avec IA"**.

---
*Personal Finance Pro - Gérez votre avenir, un centime à la fois.*
