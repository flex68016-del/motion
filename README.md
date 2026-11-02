# Emottion — SI TU SAVAIS…

> Il y a des choses que le cœur ressent.

Un espace intime pour exprimer les sentiments qu'on n'a jamais réussi à dire. Amour, regret, nostalgie, gratitude, adieu.

## 🎯 Concept

Emottion est une expérience numérique cinématique et émotionnelle qui permet aux utilisateurs de :
- Explorer cinq univers émotionnels (Amour, Regret, Nostalgie, Gratitude, Adieu)
- Écrire des messages intimes qu'ils n'ont jamais osé dire
- Sauvegarder ces messages localement dans leur navigateur
- Partager leurs créations

**Philosophie** : Rien n'est envoyé, rien n'est synchronisé. Chaque message reste confidentiel sur l'appareil de l'utilisateur.

## 🎨 Design System

### Palette de couleurs
- **Fond principal** : `#0A090B` (Noir profond)
- **Fond secondaire** : `#151218` (Gris foncé)
- **Texte principal** : `#F5F0E9` (Blanc cassé)
- **Texte secondaire** : `#A49AA5` / `#B8B0B9` (Gris doux)
- **Accent rose** : `#D6A0AD`
- **Accent rouge** : `#A84258`

### Typographie
- **Display** : Cormorant Garamond (élégant, éditorial)
- **Body** : DM Sans (lisible, moderne)

### Univers émotionnels
Chaque émotion a sa propre accent color :
- **Amour** : Rose (`#D6A0AD`)
- **Regret** : Rouge doux (`#C4697E`)
- **Nostalgie** : Lavande (`#B9AECC`)
- **Gratitude** : Or doux (`#E4C99B`)
- **Adieu** : Gris (`#A49AA5`)

## 🚀 Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Styling et animations
- **JavaScript (Vanilla)** - Interactivité
- **GSAP** - Animations cinématiques
- **ScrollTrigger** - Animations au scroll
- **Lenis** - Scroll smooth

## 📁 Structure du projet

```
motion/
├── index.html              # Page d'accueil
├── emotions.html           # Hub des émotions
├── ecrire.html             # Éditeur de messages
├── mes-messages.html        # Liste des messages sauvegardés
├── a-propos.html           # Page À propos
├── emotion-*.html          # Pages des univers émotionnels
├── css/
│   └── main.css           # Styles globaux
├── js/
│   ├── app.js             # Initialisation
│   ├── motion.js          # Système d'animation
│   ├── particles.js       # Effet de particules
│   ├── cursor.js          # Curseur personnalisé
│   ├── store.js           # Stockage local
│   ├── intro.js           # Animation d'intro
│   └── pages/             # Scripts par page
├── assets/
│   └── vendor/           # Bibliothèques tierces
└── vercel.json           # Configuration Vercel
```

## 🛠️ Installation et développement

1. **Cloner le repository**
```bash
git clone https://github.com/flex68016-del/motion.git
cd motion
```

2. **Ouvrir le projet**
Ouvrez simplement `index.html` dans votre navigateur pour voir le site en local.

3. **Déploiement**
Le projet est configuré pour Vercel. Les déploiements se font automatiquement via GitHub.

## 📱 Fonctionnalités

### Écriture de messages
- Sélection d'une émotion
- Champ destinataire (facultatif)
- Zone de message (600 caractères max)
- Signature (facultative)
- Aperçu en temps réel
- Sauvegarde locale (localStorage)

### Navigation
- Navigation responsive (desktop/mobile)
- Menu plein écran sur mobile
- Transitions animées entre pages

### Univers émotionnels
Chaque univers contient :
- Un titre et une phrase poétique
- Des fragments narratifs
- Une section d'écriture liée
- Des liens vers les émotions adjacentes

## ♿ Accessibilité

- Navigation au clavier complète
- Focus visible sur les éléments interactifs
- Contraste amélioré pour les textes
- Support `prefers-reduced-motion`
- Labels ARIA appropriés
- Skip link pour l'accessibilité

## 🎬 Motion Design

Le site utilise un système d'animation cinématique :
- Introduction animée (skippable)
- Révélation progressive des textes
- Transitions fluides entre pages
- Effet de particules en arrière-plan
- Animations au scroll

## 🔒 Confidentialité

- Aucune donnée n'est envoyée à un serveur
- Tout est stocké localement dans le navigateur
- L'utilisateur peut supprimer ses messages à tout moment
- Pas de cookies de tracking

## 🌐 Déploiement

Le site est déployé sur Vercel : https://emottion.vercel.app/

### Configuration Vercel
- Clean URLs activées (sans .html)
- Auto déploiement via GitHub
- Optimisation automatique des assets

## 👤 Crédits

Design and develop by [Dev Amankwaah](https://amankwaah-prince.site/)

## 📄 Licence

Ce projet est la propriété de son créateur.

---

**Note** : Ce projet est une expérience artistique et émotionnelle. Il n'est pas destiné à remplacer un véritable support psychologique ou thérapeutique.
