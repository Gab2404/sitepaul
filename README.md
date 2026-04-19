# 🌿 Plateforme RSE BTP — Guide de démarrage

> **Ce guide est fait pour toi, même si tu n'as jamais touché du code de ta vie.**  
> Suis les étapes dans l'ordre. 5 à 10 minutes au total, promis.

---

## 🧱 C'est quoi ce projet ?

C'est un **site web** qui tourne sur ton ordinateur (pas besoin d'internet).  
Il pose des questions sur ta façon de gérer ton entreprise BTP, puis génère un **tableau de bord RSE** personnalisé.

---

## 🚀 ÉTAPE 1 — Installer Node.js (une seule fois)

Node.js, c'est le "moteur" qui fait tourner le site.  
Tu n'as besoin de l'installer **qu'une seule fois**.

### 👉 Télécharge Node.js ici :
**https://nodejs.org/fr/**

Sur la page, clique sur le gros bouton vert **"LTS — Recommandé"**.  
Ouvre le fichier téléchargé et clique "Suivant, Suivant, Installer".

> **Comment savoir si c'est bien installé ?**  
> Ouvre un terminal (expliqué juste en dessous) et tape :
> ```
> node --version
> ```
> Si tu vois quelque chose comme `v20.x.x`, c'est bon ! ✅

---

## 📂 ÉTAPE 2 — Ouvrir le dossier du projet dans un terminal

### Sur Windows :
1. Ouvre le dossier **sitepaul** dans l'Explorateur de fichiers
2. Dans la barre d'adresse en haut (là où tu vois le chemin du dossier), clique dessus
3. Efface tout et tape : `powershell`
4. Appuie sur **Entrée**
5. Une fenêtre noire s'ouvre — c'est ton terminal 🎉

### Alternative (aussi sur Windows) :
- Fais un clic droit dans le dossier **sitepaul** (sur fond vide)
- Clique **"Ouvrir dans le Terminal"**

---

## ⌨️ ÉTAPE 3 — Les 2 seules commandes à taper

Dans la fenêtre noire (terminal), tape ces 2 commandes une par une.  
Après chaque commande, appuie sur **Entrée** et attends que ça se termine.

### Commande 1 — Installer les dépendances (une seule fois) :
```
npm install
```
> ⏳ Cette commande télécharge les fichiers nécessaires.  
> Elle peut prendre 1 à 2 minutes. C'est normal, sois patient.

### Commande 2 — Lancer le site :
```
npm run dev
```
> 🌿 Quand tu vois `ready - started server on 0.0.0.0:3000`, le site est lancé !

---

## 🌐 ÉTAPE 4 — Ouvrir le site dans ton navigateur

Ouvre **Google Chrome**, **Firefox** ou **Edge**, et tape cette adresse :

```
http://localhost:3000
```

**C'est tout !** Le site s'affiche. 🎉

---

## 🛑 Comment arrêter le site ?

Quand tu as fini, retourne dans le terminal et appuie sur :
```
Ctrl + C
```
Le site s'arrête. Pour le relancer, retape juste `npm run dev`.

---

## 🔁 La prochaine fois (après l'avoir déjà installé)

Tu n'as plus besoin de faire l'Étape 1 et 3-première-commande.  
Il suffit juste de :
1. Ouvrir le terminal dans le dossier **sitepaul**
2. Taper `npm run dev`
3. Aller sur `http://localhost:3000`

---

## 🆘 Problèmes fréquents

| Problème | Solution |
|---|---|
| `npm : command not found` | Node.js n'est pas installé. Retourne à l'Étape 1. |
| Le site ne s'affiche pas | Vérifie que le terminal affiche `ready` et retape l'adresse exacte. |
| Page blanche ou erreur rouge | Ferme le terminal, rouvre-le, retape `npm run dev`. |
| `EACCES` ou erreur de droits | Lance le terminal **en tant qu'administrateur** (clic droit → "Exécuter en tant qu'administrateur"). |

---

## 📁 Structure du projet (pour les curieux)

```
sitepaul/
│
├── 📄 pages/index.js          ← La page principale
├── 📄 pages/api/calculate.js  ← Le "serveur" qui calcule les scores RSE
│
├── 📂 lib/                    ← Le "cerveau" (données + calculs)
│   ├── designSystem.js        ← Couleurs et polices
│   ├── normes.js              ← Les 19 référentiels normatifs
│   ├── questions.js           ← Les 10 questions du diagnostic
│   └── computeProfile.js      ← L'algorithme de calcul RSE
│
├── 📂 components/
│   ├── ui/                    ← Boutons, cartes, graphiques SVG
│   └── views/                 ← Les 3 écrans (Accueil, Diagnostic, Dashboard)
│
└── 📂 styles/
    └── globals.css            ← Tout le design du site
```

---

*Projet RSE BTP — 2025 · ISO 26000 · GRI Standards · ESRS/CSRD*
