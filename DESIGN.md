# Sproutful — Multiple Intelligences Web App · Build Brief

**Product name: Sproutful.** Tagline: *"Discover the spark within."*

This is the single source of truth for the build. The mockup PNGs in `/design/mockups/`
show **layout and vibe only** — text in them may be garbled and is NOT the spec. When the
images and this document disagree, **this document wins**.

---

## How to work with the human (IMPORTANT — read before building)

- **Build only what is specified here, in the order the human asks.** Do one screen/step at a time
  and stop for review. Do not jump ahead and build screens or features that weren't requested yet.
- **When anything is unclear, missing, or not covered by this document — ASK the human first.**
  Do NOT guess, invent content, or make a unilateral product decision. Things that REQUIRE asking
  include: the real Year/Class lists, any page copy not written here, and any case where the
  mockups and this document disagree in a way this doc doesn't resolve.
- Prefer surfacing a short question over assuming. A wrong assumption costs more than a quick ask.
- Do not change the questions (§8), the scoring (§9), or the data/link model (§1.5, §10) without
  explicit confirmation from the human.

---

## 1. What we're building

**Sproutful** is one website that serves many schools, with **no logins and no accounts**. The
operator (the human) sets up each school by hand and hands them two links. Students open their
link and take a Multiple Intelligences self-assessment; the school opens its private link to view
results — replacing parents sending screenshots. The first school is **DYEC**.

**Student flow:** open student link → enter Name + Year + Class → answer 56 statements (rated 1–5)
→ app computes 8 scores (1.0–5.0) → result is saved → student sees their result (wheel + top
strength + their ID).

**School flow:** open the private dashboard link → see all of that school's students and their
8 scores → search by name or ID → export.

---

## 1.5 The link model (read carefully — this is the whole architecture)

There are **no accounts, no passwords, no Google Sign-In, no teacher/owner roles.** Access is by
**unguessable links**, like a "anyone with the link" Google Doc share.

**Each school has TWO different secret codes:**
- a **student code** → the link `/s/{studentCode}` (shared with students; opens the quiz)
- a **dashboard code** → the link `/d/{dashboardCode}` (kept private by the school; opens results)

The two codes MUST be different. The student code is shared widely, so it must NOT grant dashboard
access. Knowing one code must never reveal the other.

**The Registry Sheet (operator-controlled).** The human keeps one private Google Sheet — the
**Registry** — with one row per school. This is both the operator's record/backup AND the live
wiring the site reads to route requests. One tab named `schools`:

| Column | Example | Notes |
|---|---|---|
| `school_name` | DYEC | Shown to students as a greeting and on the dashboard |
| `school_id` | DYEC | Short code, used as the Student ID prefix (§9) |
| `student_code` | k7m2qx9f3a | Goes in the `/s/...` link |
| `dashboard_code` | 9f3b8t6w1z | Goes in the `/d/...` link (different from student_code) |
| `sheet_id` | 1u1WYn... | The ID of that school's own data Sheet |
| `created_at` | 2026-06-03 | Optional |

**One data Sheet per school.** Each school's student answers live in their OWN separate Google
Sheet file (fully isolated — one school can never see another's data). The Registry row's
`sheet_id` points to it.

**How a request is routed (the site does this automatically):**
- Student opens `/s/{studentCode}` → backend looks up `studentCode` in the Registry → finds the
  school's `sheet_id` → saves the answer into that school's data Sheet.
- School opens `/d/{dashboardCode}` → backend looks up `dashboardCode` in the Registry → finds the
  same `sheet_id` → reads results back from that school's data Sheet.
- If a code isn't found in the Registry → show a friendly "Link not found" page.

**Adding a new school is manual and code-free** (the human does it in ~2 minutes, no coding, no
visiting the school): create a blank data Sheet, add a Registry row (name, short id, two random
codes, the new Sheet's id), and hand the school its two links. The deployed website never changes.

**All Sheets (Registry + every school's data Sheet) must live in the operator's own Google
account**, so the Apps Script (which runs as the operator) can open them by id.

**Privacy reality (state honestly in product, don't hide):** the dashboard link is the only lock.
Anyone who gets it can view that school's results, and there's no password reset/revoke. The data
is low-sensitivity (first name, year, class, 8 scores — no contact info), so this is an acceptable
trade for a simple tool, but schools should treat the dashboard link like a password.

---

## 2. Tech stack (use exactly this)

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (v4 — CSS-first; design tokens live in `app/globals.css` via `@theme`, not a `tailwind.config.ts`)
- **Framer Motion** for transitions
- **lucide-react** for all icons (no image files for icons)
- Deploy on **Vercel** or **Netlify**
- No database library, no auth library, no backend server — storage is Google Sheets via a single
  Google Apps Script Web App (see §10).

**Routes:**
- `/s/[code]` — student start (welcome + Name/Year/Class form)
- `/s/[code]/quiz` — the 56-question flow
- `/s/[code]/result` — result screen
- `/d/[code]` — the school's private dashboard

A bare `/` can show a tiny Sproutful placeholder (the product isn't a public sign-up site). **Ask
the human before adding any landing-page copy.** State across the student flow can be held in React
context, `sessionStorage`, or URL params — but **do not** persist student data in `localStorage`.
The `code` from the route must be available to every student screen so it can be sent to the backend.

---

## 3. Aesthetic direction

Warm, friendly, calm, child-appropriate but still professional — a tool kids use and a school
reads daily. Soft rounded cards, generous whitespace, pill-shaped buttons, one clear focus per
screen, subtle soft shadows. No heavy gradients. Light, airy, cream-based.

---

## 4. Color tokens

Define these as CSS variables / Tailwind theme extensions.

### UI chrome
| Token | Hex | Use |
|---|---|---|
| `--brand` | `#2A6F6B` | Logo, headings on kid screens, teal accents |
| `--ink` | `#1E293B` | Big hero text, dark headings |
| `--body` | `#475569` | Body / paragraph text |
| `--primary` | `#F26A4F` | Primary buttons ("Start My Journey", "Continue", "Next") |
| `--primary-hover` | `#E15A40` | Button hover |
| `--bg` | `#FAF6EE` | Page background (warm cream) |
| `--surface` | `#FFFFFF` | Cards |
| `--surface-soft` | `#F3EFE4` | Soft tinted sections / progress track |
| `--border` | `#E7E0D2` | Hairlines, input borders |

### The 8 intelligence colors (keep all distinct — never recolor these to one hue)
| Intelligence | Score key | Color | lucide icon |
|---|---|---|---|
| Word Smart | `word_smart` | `#EF6F61` | `BookOpen` |
| Logic Smart | `logic_smart` | `#F4B740` | `Calculator` |
| Music Smart | `music_smart` | `#3BA6A0` | `Music` |
| Picture Smart | `picture_smart` | `#5B8DEF` | `Image` |
| Body Smart | `body_smart` | `#6CC07A` | `PersonStanding` |
| People Smart | `people_smart` | `#9B7EDE` | `Users` |
| Self Smart | `self_smart` | `#F0915A` | `Heart` |
| Nature Smart | `nature_smart` | `#7FB069` | `Leaf` |

---

## 5. Typography

Use Google Fonts (avoid Inter/Roboto/Arial).
- **Display / headings:** `Baloo 2` (rounded, friendly, bold). Weights 600/700.
- **Body / UI:** `Nunito`. Weights 400/600/700.

(If the hero should feel heavier like the mockup, `Poppins` 700 is an acceptable display swap.)

### Shape & depth tokens
- Card radius: `20px`. Button radius: full pill (`9999px`). Input radius: `12px`.
- Card shadow: soft, low-opacity, e.g. `0 8px 24px rgba(30,41,59,0.06)`.
- Buttons: pill, bold label, right-arrow icon inside a small white circle (see mockups).

---

## 6. Screen specs

For all screens: Sproutful logo top-left, generous padding, soft decorative plant/leaf art in the
lower corners (assets provided in `/public/`, see §12). Animate content in with a gentle staggered
fade+rise via Framer Motion.

### 6.1 Student start `/s/[code]`
- On load, the page calls the backend `resolve` action (§10) with the `code` to get the school
  name. If the code is invalid → show a friendly "Link not found" page.
- Sproutful logo top-left. Top nav can show `About Sproutful · How It Works · Benefits` as anchor
  stubs. **There is no "Sign In" — the dashboard is reached only by its private link, never linked
  from here.**
- Show the school's name as a plain text greeting, e.g. "Welcome, {schoolName} students" near the
  hero, so students know they're in the right place.
- Hero left: stacked heading "Discover." / "Understand." / "Grow." — first two in `--ink`,
  "Grow." in `--primary`. Subtext below in `--body`.
- Hero right: provided illustration (kids + tree of intelligence icons).
- A white card with the **start form**: **Name** (text), **Year** (select), **Class** (select),
  and a coral **"Start My Journey"** pill button. Below a hairline, three small feature callouts:
  "Personalized Insights", "Learn Your Way", "Grow With Confidence".
- On submit: validate all three fields, store student info + the `code` in app state, navigate to
  `/s/[code]/quiz`. (The Student ID is created by the backend at the end — see §9.)
- **Year** and **Class** options live in `config/options.ts`. Default Year `1–13`, classes like
  `4A, 4B, ...`. **If the human hasn't given the real lists, ASK — do not invent the final lists.**

### 6.2 Quiz `/s/[code]/quiz`
- One statement at a time. Top: centered "Question {n} of 56" and a progress bar
  (track `--surface-soft`, fill `--brand`).
- A white card: the lucide icon of *this question's intelligence* (§4) shown above the text (icon-only;
  no per-question illustration art), the statement text large and centered in `--brand`.
- Below: a horizontal row of **five circular buttons numbered 1–5**. Tiny labels under the ends:
  "Not at all" under 1, "Exactly like me" under 5. Selected = filled with `--primary`, white number.
- A coral **"Next"** pill button, disabled until an option is chosen. On the last question it reads
  **"See My Results"**.
- A subtle back arrow allows going back; previous answers must be preserved.
- Keep all 56 answers in state. Nothing is sent to the backend until the end.

### 6.3 Result `/s/[code]/result`
- Title "Your Strengths" + a friendly subline. Student ID shown in a small pill top-right
  (e.g. `DYEC-2026-7K39`) — this is the ID returned by the backend.
- Left: the **Strength Wheel** (custom SVG, §7) showing all 8 scores out of 5.0.
- Right: a "Your top strength" card — top intelligence name, its score as `5.0 / 5.0`, its icon,
  and a one-line description. Plus a small encouraging note ("Keep exploring, keep growing!").
- Bottom: **"Download Report"** (secondary, outlined) and **"Continue"** (coral pill → `/s/[code]`).
- Flow: when the student finishes the quiz, call the backend `submit` action (§10), show a brief
  loading state, then render this screen using the returned `student_id` + `top_intelligence`.
- **Top strength descriptions** — one short sentence each:
  - Word Smart: "You think in words and love reading, writing, and storytelling."
  - Logic Smart: "You enjoy numbers, patterns, problem-solving, and figuring out how things work."
  - Music Smart: "You have a natural ability to understand, create, and express through music."
  - Picture Smart: "You think in pictures and are great with space, design, and visual ideas."
  - Body Smart: "You learn by doing and moving, with great coordination and physical skill."
  - People Smart: "You understand and connect with others easily and work well in groups."
  - Self Smart: "You know yourself well and reflect deeply on your own thoughts and goals."
  - Nature Smart: "You feel connected to nature, plants, animals, and the world outdoors."

### 6.4 School Dashboard `/d/[code]`
- On load, call the backend `results` action (§10) with the `code`. If invalid → "Link not found".
  No sign-in screen, no Google — the dashboard code IS the access.
- Header: Sproutful logo, the school name (from the response), and the title "Student Results".
- A big **search bar** ("Search by student name or ID"), an optional class filter, and an
  **"Export Report"** button (exports the current results to CSV/XLSX, client-side).
- Results table: a lucide avatar placeholder, Student (name + ID), Year, Class, then 8 score chips
  (each tinted with its intelligence color), then a "Top Strength" cell (icon + name + score).
  Highlight each row's top-scoring chip with a small star.
- Search/filter run client-side over the returned results (paginate if long).

---

## 7. The Strength Wheel (custom SVG component)

Build as a self-contained React + SVG component: `StrengthWheel({ scores })` where `scores` is the
8-key object. **Do not** use a static image — it's drawn live from each student's data.

Geometry:
- A circle divided into **8 equal wedges** (45° each), one per intelligence, in order:
  Word, Logic, Music, Picture, Body, People, Self, Nature (clockwise from top).
- Each wedge filled in its intelligence color. Encode the score by the **filled radius**:
  `filledRadius = (score / 5) * maxRadius`. A 5.0 reaches the outer edge; a 2.5 reaches halfway.
- Behind the wedges, faint concentric grid rings at 1,2,3,4,5 for scale.
- Place the score (e.g. `4.2` with a small `/5.0`) in a white pill near each wedge's outer end.
- Label each wedge outside the circle with its name + lucide icon, in its color.
- Center: a small white circle with the Sproutful mark — use a lucide `Sprout` icon for now (the
  human will supply a final logo later).

If a custom SVG is too costly first pass, a `recharts` polar/radial chart is an acceptable fallback —
but the custom SVG matches the mockup best and is preferred.

---

## 8. The 56 questions (DATA — do not change wording)

Store as a typed array in `lib/questions.ts`. Rated 1–5: `1 = Not at all … 5 = Exactly like me`.

```ts
// key: which intelligence this question scores
export const QUESTIONS = [
  { n: 1,  key: "word_smart",    text: "I pride myself on having a large vocabulary." },
  { n: 2,  key: "logic_smart",   text: "Using numbers and numerical symbols is easy for me." },
  { n: 3,  key: "music_smart",   text: "Music is very important to me in daily life." },
  { n: 4,  key: "picture_smart", text: "I always know where I am in relation to my home." },
  { n: 5,  key: "body_smart",    text: "I consider myself an athlete." },
  { n: 6,  key: "people_smart",  text: "I feel like people of all ages like me." },
  { n: 7,  key: "self_smart",    text: "I often look for weaknesses in myself that I see in others." },
  { n: 8,  key: "nature_smart",  text: "The world of plants and animals is important to me." },
  { n: 9,  key: "word_smart",    text: "I enjoy learning new words and do so easily." },
  { n: 10, key: "logic_smart",   text: "I often develop equations to describe relationships and/or to explain my observations." },
  { n: 11, key: "music_smart",   text: "I have wide and varied musical interests including both classical and contemporary." },
  { n: 12, key: "picture_smart", text: "I do not get lost easily and can orient myself with either maps or landmarks." },
  { n: 13, key: "body_smart",    text: "I feel really good about being physically fit." },
  { n: 14, key: "people_smart",  text: "I like to be with all different types of people." },
  { n: 15, key: "self_smart",    text: "I often think about the influence I have on others." },
  { n: 16, key: "nature_smart",  text: "I enjoy my pets." },
  { n: 17, key: "word_smart",    text: "I love to read and do so daily." },
  { n: 18, key: "logic_smart",   text: "I often see mathematical ratios in the world around me." },
  { n: 19, key: "music_smart",   text: "I have a very good sense of pitch, tempo, and rhythm." },
  { n: 20, key: "picture_smart", text: "Knowing directions is easy for me." },
  { n: 21, key: "body_smart",    text: "I have good balance and eye-hand coordination and enjoy sports which use a ball." },
  { n: 22, key: "people_smart",  text: "I respond to all people enthusiastically, free of bias or prejudice." },
  { n: 23, key: "self_smart",    text: "I believe that I am responsible for my actions and who I am." },
  { n: 24, key: "nature_smart",  text: "I like learning about nature." },
  { n: 25, key: "word_smart",    text: "I enjoy hearing challenging lectures." },
  { n: 26, key: "logic_smart",   text: "Math has always been one of my favorite classes." },
  { n: 27, key: "music_smart",   text: "My music education began when I was younger and still continues today." },
  { n: 28, key: "picture_smart", text: "I have the ability to represent what I see by drawing or painting." },
  { n: 29, key: "body_smart",    text: "My outstanding coordination and balance let me excel in high-speed activities." },
  { n: 30, key: "people_smart",  text: "I enjoy new or unique social situations." },
  { n: 31, key: "self_smart",    text: "I try not to waste my time on trivial pursuits." },
  { n: 32, key: "nature_smart",  text: "I enjoy caring for my house plants." },
  { n: 33, key: "word_smart",    text: "I like to keep a daily journal of my daily experiences." },
  { n: 34, key: "logic_smart",   text: "I like to think about numerical issues and examine statistics." },
  { n: 35, key: "music_smart",   text: "I am good at playing an instrument and singing." },
  { n: 36, key: "picture_smart", text: "My ability to draw is recognized and complimented by others." },
  { n: 37, key: "body_smart",    text: "I like being outdoors, enjoy the change in seasons, and look forward to different physical activities each season." },
  { n: 38, key: "people_smart",  text: "I enjoy complimenting others when they have done well." },
  { n: 39, key: "self_smart",    text: "I often think about the problems in my community, state, and/or world and what I can do to help rectify any of them." },
  { n: 40, key: "nature_smart",  text: "I enjoy hunting and fishing." },
  { n: 41, key: "word_smart",    text: "I read and enjoy poetry and occasionally write my own." },
  { n: 42, key: "logic_smart",   text: "I seem to understand things around me through a mathematical sense." },
  { n: 43, key: "music_smart",   text: "I can remember the tune of a song when asked." },
  { n: 44, key: "picture_smart", text: "I can easily duplicate color, form, shading, and texture in my work." },
  { n: 45, key: "body_smart",    text: "I like the excitement of personal and team competition." },
  { n: 46, key: "people_smart",  text: "I am quick to sense in others dishonesty and desire to control me." },
  { n: 47, key: "self_smart",    text: "I am always totally honest with myself." },
  { n: 48, key: "nature_smart",  text: "I enjoy hiking in natural places." },
  { n: 49, key: "word_smart",    text: "I talk a lot and enjoy telling stories." },
  { n: 50, key: "logic_smart",   text: "I enjoy doing puzzles." },
  { n: 51, key: "music_smart",   text: "I take pride in my musical accomplishments." },
  { n: 52, key: "picture_smart", text: "Seeing things in three dimensions is easy for me, and I like to make things in three dimensions." },
  { n: 53, key: "body_smart",    text: "I like to move around a lot." },
  { n: 54, key: "people_smart",  text: "I feel safe when I am with strangers." },
  { n: 55, key: "self_smart",    text: "I enjoy being alone and thinking about my life and myself." },
  { n: 56, key: "nature_smart",  text: "I look forward to visiting the zoo." },
] as const;
```

Each intelligence is measured by exactly 7 questions.

---

## 9. Scoring & Student ID

**Scoring:** For each of the 8 keys, sum its 7 answers (each 1–5) and divide by 7, then round to
one decimal. Result is between 1.0 and 5.0.

```
score(key) = round( sum(answers where question.key === key) / 7 , 1 )
```

`top_intelligence` = the friendly label of the highest-scoring key (ties: first in the §4 order).

**Student ID (generated by the backend):** Format `{SCHOOL_ID}-{calendarYear}-{4 chars}`
(e.g. `DYEC-2026-7K39`), where `{SCHOOL_ID}` is the school's short id from the Registry row, and the
4 chars come from the unambiguous set `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no 0/O/1/I). The backend
generates it at `submit` time, guarantees it's unique within that school's data Sheet, and returns
it. The result screen displays the returned ID. (The frontend does not need to generate IDs.)

---

## 10. Backend data contract (single Google Apps Script Web App)

**One Web App URL serves every school.** It reads the Registry (§1.5) to resolve a `code` to the
right school data Sheet, then reads/writes that Sheet. (URL goes in an env var, e.g.
`NEXT_PUBLIC_BACKEND_URL`. The exact URL is set after the Apps Script is deployed.)

**CRITICAL — CORS:** Apps Script cannot send custom CORS headers. POST with
`Content-Type: "text/plain;charset=utf-8"` and the JSON as a string body. Do **not** use
`application/json` (it triggers a failing preflight).

```ts
async function callBackend(payload: object) {
  const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

### Action: `resolve` (student start page — get the school name for the greeting)
Request: `{ "action": "resolve", "student_code": "k7m2qx9f3a" }`
Response (found): `{ "ok": true, "school_name": "DYEC" }`
Response (bad code): `{ "ok": false }`

### Action: `submit` (end of quiz)
Request:
```json
{
  "action": "submit",
  "student_code": "k7m2qx9f3a",
  "student": { "name": "Aung Min", "year": "Year 4", "class": "4B" },
  "scores": {
    "word_smart": 4.2, "logic_smart": 4.1, "music_smart": 5.0, "picture_smart": 4.3,
    "body_smart": 4.0, "people_smart": 4.6, "self_smart": 4.7, "nature_smart": 4.4
  }
}
```
The backend resolves `student_code` → school Sheet + school_id, generates a unique Student ID,
appends one row, and responds:
`{ "ok": true, "student_id": "DYEC-2026-7K39", "top_intelligence": "Music Smart" }`

### Action: `results` (dashboard)
Request: `{ "action": "results", "dashboard_code": "9f3b8t6w1z" }`
Response: `{ "ok": true, "school_name": "DYEC", "results": [ { student fields + 8 scores + top_intelligence }, ... ] }`
(Bad code → `{ "ok": false }`.)

**Security:** `submit` uses the public `student_code`; `results` uses the private `dashboard_code`.
The two codes are different, so a student who has the student link cannot reach the dashboard.
Validate codes server-side; unknown codes return `{ "ok": false }`.

---

## 11. No authentication (by design)

There is no login, no password, no Google Sign-In, no accounts. Access control is entirely the
unguessable links (§1.5). Do **not** add an auth library or a sign-in screen. The dashboard is
reached only by its private `/d/{dashboardCode}` link. See the privacy note in §1.5.

---

## 12. Assets the human provides (do not generate)

Place in `/public/illustrations/`:
- `hero.png` — student start kids + tree of intelligence icons
- corner plant / books decorations

While assets aren't ready, render a labeled grey-box placeholder (`components/Illustration.tsx`) at
the right size, referencing the real `/public/illustrations/` paths so files can be dropped in later
with no code changes. Prefer transparent-background PNGs (the art sits over the cream background).

**Logo:** there is no logo file yet. Use a `components/Logo.tsx` = lucide `Sprout` icon + the word
"Sproutful"; the human will swap in a real logo later (one-file change).

**Quiz cards are icon-only** (§6.2): they use the lucide icon of the question's intelligence — there
are no per-question illustrations.

All 8 intelligence **icons come from `lucide-react`** (§4) — no image files for those.
Fonts load from Google Fonts. The school name is plain text from the Registry (no logo upload).

---

## 13. Out of scope / do not touch

- No accounts, no passwords, no login, no Google Sign-In, no auth library.
- No teacher/owner roles; no per-school logo upload or branding editor. School name is text in the Registry.
- Do not build raw-answer storage — only the 8 final scores are saved.
- Do not change any question wording (§8) or the scoring formula (§9).
- Do not recolor the 8 intelligence colors to a single hue.
- Do not use `localStorage` for long-term storage of student data.
- The student and dashboard codes for a school MUST be different (§1.5, §10).
- Do not mix data between schools — each school has its own data Sheet; resolve the code every time.
- The backend URL goes in an env var; never invent or hardcode Registry codes in the app.
- **When anything is ambiguous, missing, or not covered here, ASK the human — do not decide it yourself.** (See "How to work with the human" at the top.)