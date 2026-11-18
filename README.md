# Smile Club web app (phase 1)

Mobile-first web app for the Davangere oral-health study, built from the "Day & Night" design (Option A, v4).
Phase 2 adds native Android (Kotlin) and iOS (Swift) apps that share `design-tokens/tokens.json`.

## Status

| Area | State |
| --- | --- |
| Today screen (sun by day, moon by night, auto by clock) | Built |
| 2-minute brushing timer with 4 zones and voice prompts | Built |
| Celebration (+2 sparkles brush, +3 questions) | Built |
| Questions: picture tiles (5-8 y), list (9-12 y), skip logic, quiz score | Built (content from `src/content/questions.js`) |
| English / Hindi, read-aloud, saving on the device | Built |
| Join screen: a grown-up enters the child's code and PIN once | Built |
| Upload to Supabase (works offline, sends when there is internet, never twice) | Built |
| Publishing to GitHub Pages on every push | Built (`.github/workflows/pages.yml`) |
| Learn (videos), Journey, Rewards | Placeholder, next build |
| Grown-ups corner: consent, family questions | Next build |
| Offline install (service worker) | Next build |

## Study database (Supabase)

`supabase/schema.sql` sets up everything. No names are stored: each child is a code, and the code-to-name list stays offline with the study team.

Add a child (Supabase dashboard, SQL editor). It returns a 6-digit PIN for the study card:

```sql
select * from public.add_participant('SC-001', 'A', 'junior');
```

Lost card or new phone: `select * from public.reset_pin('SC-001');`

Read the data in Table editor (export as CSV): `participant_summary`, `brushing_by_day`, `answers_long`, or the raw `events` table.

The app's public key can only call `enrol` and `submit_events`; it can't read anything. Five wrong PINs lock a code for 15 minutes.

Add `?demo` to the address to show the app without joining (nothing is uploaded).

## Run

Install Node.js LTS, then in this folder:

```bash
npm install
```

```bash
npm run dev
```

Demo switches in the address bar: `?theme=day` or `?theme=night`, `?mode=senior`, `?lang=hi`, `?group=B`.

## Structure

- `src/config.ts`: Supabase address and publishable key (public by design)
- `src/lib/sync.ts`: outbox and upload
- `supabase/schema.sql`: tables, security rules, researcher views
- `design-tokens/tokens.json`: colours, type, radii, spacing (shared with Kotlin and Swift)
- `src/styles/theme.css`: the same tokens as CSS variables, `data-theme="day" | "night"`
- `src/content/`: question sets and video scripts (tested in the earlier app)
- `src/lib/`: i18n, store (localStorage), time and study week, router, speech
- `src/ui/`: icons, illustrations, shared components
- `src/screens/`: Today, Brush, Done, Questionnaire, Placeholder
