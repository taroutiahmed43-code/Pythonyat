# 🧠 Parcours IA — Site Web Complet

Site vitrine interactif pour apprendre l'IA, avec Claude intégré comme tuteur.

---

## 📁 Structure du projet

```
parcours-ia/
├── index.html          ← Page principale
├── css/
│   ├── style.css       ← Styles globaux + composants
│   └── chat.css        ← Styles du widget chat
├── js/
│   ├── canvas.js       ← Animation réseau de particules (hero)
│   ├── main.js         ← Navigation, scroll, phases, FAQ
│   └── chat.js         ← Intégration API Claude
└── README.md
```

---

## ✨ Fonctionnalités

- **Hero animé** — Canvas avec réseau de particules interactif (réagit à la souris)
- **Curseur custom** — Curseur + trail fluide, blend-mode difference
- **Barre de progression** — Scroll tracker en haut de page
- **Navbar sticky** — Transparente → frostée au scroll
- **Section About** — Grille 2 colonnes avec carte visuelle dynamique
- **6 Phases interactives** — Timeline avec checkboxes, tags, boutons Claude
- **Tracker de progression** — Barre de progression mise à jour en temps réel
- **Ressources** — Grille 6 cartes avec hover animation
- **FAQ accordéon** — Ouverture/fermeture animée
- **Chat Claude** — Widget flottant avec API Anthropic intégrée
- **Responsive** — Mobile first, breakpoints 640px / 900px

---

## 🚀 Déploiement

### Option 1 — GitHub Pages (gratuit, recommandé)
```bash
# 1. Créer un repo GitHub public
# 2. Uploader les fichiers
# 3. Settings → Pages → Deploy from branch → main
# 4. Votre site sera disponible sur : https://username.github.io/parcours-ia
```

### Option 2 — Netlify (gratuit, drag & drop)
```
1. Aller sur netlify.com
2. Drag & drop le dossier parcours-ia/
3. URL automatique type : parcours-ia.netlify.app
```

### Option 3 — Vercel (gratuit)
```bash
npm i -g vercel
cd parcours-ia
vercel
```

### Option 4 — Local
```bash
# Ouvrir index.html directement dans le navigateur
# ou utiliser un serveur local :
npx serve .
# ou
python -m http.server 8080
```

---

## 🤖 Configuration Claude

L'intégration Claude utilise l'API Anthropic via `js/chat.js`.

**Pour la production**, la clé API doit être gérée côté serveur (ne jamais exposer une clé API en frontend public).

**Solutions recommandées :**

### A. Netlify Functions (le plus simple)
Créer `netlify/functions/chat.js` :
```javascript
const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  const { messages } = JSON.parse(event.body);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: 'Tu es un tuteur IA bienveillant...',
    messages
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ reply: response.content[0].text })
  };
};
```

Puis dans `js/chat.js`, remplacer l'URL par `/api/chat` et ajouter la variable d'env `ANTHROPIC_API_KEY` dans Netlify.

### B. Cloudflare Workers
### C. Backend Node.js/Express

---

## 🎨 Personnalisation

### Couleurs (css/style.css)
```css
:root {
  --c1: #6ee7b7;  /* emerald — phase 1 */
  --c2: #38bdf8;  /* sky — phase 2 */
  --c3: #f59e0b;  /* amber — phase 3 */
  --c4: #a78bfa;  /* violet — phase 4 */
  --c5: #f472b6;  /* pink — phase 5 */
  --c6: #fb923c;  /* orange — phase 6 */
}
```

### Contenu des phases
Modifier directement dans `index.html` les balises `<article class="phase-item">`.

### Prompts Claude par phase
Dans chaque `phase-claude-btn`, modifier le texte du prompt dans `onclick="askClaude('...')"`.

---

## 📦 Dépendances

Aucune dépendance npm — tout en HTML/CSS/JS pur.
Polices Google Fonts chargées via CDN (Instrument Serif + DM Sans + DM Mono).

---

Propulsé par **Claude** — Anthropic 🤖
