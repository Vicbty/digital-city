---
name: supabase-dashboard
description: Base de données Supabase et dashboard de Digital City (visiteurs, parties, scores au quiz, notes 1-10). À utiliser pour src/lib/supabase.ts, la page /dashboard, le comptage des visites ou l'enregistrement des parties.
---

# Supabase + dashboard

## SQL à exécuter dans Supabase (SQL Editor)
```sql
create table visits (id uuid default gen_random_uuid() primary key, created_at timestamptz default now());
create table games (
  id uuid default gen_random_uuid() primary key,
  score int, quiz_correct int, quiz_total int,
  rating int check (rating between 1 and 10),
  pseudo text check (char_length(pseudo) <= 20),
  created_at timestamptz default now()
);
alter table visits enable row level security;
alter table games enable row level security;
create policy "anon insert visits" on visits for insert to anon with check (true);
create policy "anon read visits" on visits for select to anon using (true);
create policy "anon insert games" on games for insert to anon with check (true);
create policy "anon read games" on games for select to anon using (true);
-- nécessaire si « Automatically expose new tables » est décoché à la création du projet
grant select, insert on visits to anon;
grant select, insert on games to anon;
```

Si la table games existe déjà sans pseudo :
```sql
alter table games add column if not exists pseudo text check (char_length(pseudo) <= 20);
```

## src/lib/supabase.ts doit exposer
- logVisit() : 1 insert dans visits au chargement de l'app, une seule fois par navigateur et par jour (clé localStorage).
- saveGame({ score, quizCorrect, quizTotal, rating, pseudo }) : insert dans games (si la colonne pseudo manque, réessaie sans).
- getLeaderboard(limit) : meilleurs scores avec pseudo (écran de fin + dashboard).
- getStats() : { visitors, games, avgQuizPercent, avgRating, ratingDistribution[1..10], scores[] }.
- getPercentileBeaten(score) : % des parties avec un score inférieur.

## Fallback
Si VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquent, tout fonctionne en localStorage avec la même interface (le jeu ne doit jamais planter à cause de Supabase). Afficher un petit badge « mode local » sur /dashboard.

## Règles
- Ne jamais lire ni afficher le contenu de .env.
- Toutes les erreurs Supabase sont attrapées (try/catch) et loguées en console, jamais montrées au joueur.
- Le dashboard se rafraîchit toutes les 10 secondes (pratique pendant le pitch).
