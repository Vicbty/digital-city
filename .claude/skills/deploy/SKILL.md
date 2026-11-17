---
name: deploy
description: Déployer Digital City sur Vercel et préparer le QR code pour le pitch. À utiliser quand on parle de mise en ligne, déploiement, lien public, Vercel ou QR code.
---

# Déploiement

1. npm run build doit passer sans erreur ni warning TypeScript.
2. Ajouter vercel.json pour que /dashboard marche en rechargement direct :
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
3. Expliquer à l'utilisatrice les étapes manuelles (Claude ne peut pas se connecter à Vercel à sa place) :
   - vercel.com → Add New → Project → importer le repo GitHub digital-city
   - Framework : Vite (détecté automatiquement)
   - Environment Variables : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
   - Deploy. Chaque push sur main redéploie automatiquement.
4. Ajouter une page ou un bouton qui affiche un QR code du lien public (lib qrcode.react autorisée pour ça) pour la slide de pitch.
5. Vérifier les balises meta Open Graph (titre, description, emoji/image) pour que le lien soit joli quand on le partage sur WhatsApp/Insta.
