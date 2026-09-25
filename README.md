# Jarvis — personal workspace for iPad

An installable Safari PWA with an editable personal profile, local memory, daily planning, notes, study tools, browser dictation, spoken replies and an optional self-hosted local AI backend. The interface is designed for touch and iPad landscape/portrait.

**This is a local-first assistant workspace, not an always-listening or omniscient agent.** Without a local model, it runs personal tools and searches saved facts; it does not pretend that command responses are generative AI. Speaker identification and native end-to-end speech-to-speech are not implemented.

## Quick start

Use Node.js 22 or newer (24 recommended):

```sh
npm ci
npm test
npm start
```

Open `http://localhost:3000` on the same computer. No API key or paid subscription is required. Development dependencies are for testing only; the server and app have no runtime npm dependencies.

For an iPad, serve `public/` (or `npm run build` → `dist/`) from an HTTPS static host, or serve the Node backend behind HTTPS. Open the address in Safari, then Share → Add to Home Screen. Opening `index.html` from Files is not a supported installation. The app can run at a domain root or a project subpath when static-hosted. Relative asset paths support repository Pages deployments. A static-only copy cannot reach the optional local model through `/api/chat`.

## What works without a model or subscription

| Area | Features |
| --- | --- |
| Personal profile | Editable name, nickname, goals, projects, interests, response preferences, dictation language; suggestions require review and Save |
| Memory vault | Create, edit, delete, categorize, pin, private/shareable controls; local related-topic search; migrate same-origin v1 memories |
| Today | Tasks, completion, edit/delete, due dates, filters, daily briefing, calendar `.ics` export |
| Notes | Create/edit/delete, title/body search, Markdown export |
| Study | Flashcards, reveal answer, recall grading, persistent review dates; unlimited focus stopwatch with pause/resume and session history |
| Voice | Tap-to-dictate into a reviewable message, system voice selection, speed, read replies, stop audio; local reference recording/playback/deletion |
| Conversation | Local commands, safe calculator, context search, persistent history, copy, bookmark answer as memory, text export and clear |
| Data | IndexedDB, encrypted text backups and restore, storage estimate, persistent-storage request, full erase |
| PWA | Offline app shell, manifest, PNG icons, home-screen shortcuts, reduced-motion support |

Dictation and speech availability vary by browser/OS. If browser dictation is unavailable, use the iPad keyboard microphone. Browser recognition may send audio to the browser vendor. This is **dictation → text processing → system speech**, not Gemini-style native speech-to-speech. Recordings remain in IndexedDB and are excluded from backups. Recording a reference does not teach Jarvis to distinguish the owner from another speaker. No voice authentication is provided.

## Teach Jarvis about you

1. Open **My profile**. Fill it yourself or review **Fill suggested profile**, then Save.
2. Open **Memory** to add facts. Memories default to **Private**. Edit or delete any entry at any time.
3. Local `/find` can show all your memories. AI context excludes private entries. If optional sharing is enabled, the profile plus at most five non-private relevant/pinned memories are sent only when you ask an open-ended question.
4. Notes, task lists, recordings and flashcards are not automatically uploaded to the model. Conversation text you deliberately send is passed as the current message and up to eight recent messages when local AI is enabled.

Search uses normalized concept and character-ngram vectors with cosine similarity. It is lightweight approximate related-topic matching, **not neural semantic embeddings**, and works best for the bundled English concepts. No analytics, tracking, automatic profile collection or cross-app access.

## Local tool commands

```
/brief
/profile
/help
/remember I prefer one hint before a full proof
/task Review graph theory
/note Check the handshake lemma proof
/find olympiad
/calc (12 + 3) * 4
```

Natural variants include `remember that …`, `add a task: …`, `take a note …`, `calculate …`, and `what do you know about me?`. Chat write commands create a reviewable proposal; nothing is saved until you press Save. The local model cannot execute commands or device actions. Tasks entered by voice or chat need their date set separately in Today; background alarms are not implemented.

## Optional local generative AI

This route uses an open model hosted on a computer via a local Ollama installation. It has no per-message cloud API charge; suitable hardware, power, network access and hosting are still required. A computer must remain available; the iPad does not run the model in this build.

1. Run your chosen locally installed model with Ollama on that computer. The supported local endpoint is `http://127.0.0.1:11434/api/chat`.
2. Copy `.env.example` to `.env`. Set `OLLAMA_MODEL` to the exact installed model name.
3. Run this Node server on the same computer. It forwards only to that fixed loopback endpoint.
4. For deployment, set `PUBLIC_ORIGIN` to the exact HTTPS origin and `JARVIS_ACCESS_CODE` to a long random secret. Set `NODE_ENV=production`; startup then requires both. Set `HOST` for your reverse proxy/container as needed. Serve over a trusted HTTPS reverse proxy. Do not expose Ollama directly.
5. In Settings, enter the access code, check the backend, and opt in to local AI. Profile/memory context sharing is a separate toggle, off by default.

The same origin serves UI and `/api`. Backend controls include same-origin checks, an access code for hosted use, constant-time secret comparison, request size limits, a rate limit, bounded context and concurrency, timeouts and redacted provider errors. This is a single-user system, not a multi-user authentication platform. Saved data lives per browser profile and origin. The access code is held in sessionStorage, not committed or cached by the service worker.

The previous Gemini/OpenRouter routes and setup instructions have been removed. Gemini API terms restrict use to adults, so this student-oriented build does not connect to it. See the official terms under References.

## Backups & privacy

Export encrypted backups in Settings using a password of at least 10 characters. PBKDF2-SHA256 (250,000 iterations), random salt and AES-256-GCM protect exported JSON. The password is not stored. Keep it separately: there is no recovery service. Restore validates the data and asks before replacing the current workspace. Voice references are not backed up.

App database contents themselves are not encrypted by this application. Device access means access to the workspace. Clearing Safari data or storage eviction may erase it; regular backups remain necessary even if persistent storage is granted. v1 migration reads the old database only on the same origin. Full erase removes v2 data and attempts to remove v1 memories.

## Limits that matter

- No background microphone or wake word: dictation/recording stop when the page is hidden. No Siri-level integration or other-app reading.
- No permanent companion claim: Jarvis is a software assistant and only knows facts supplied to it.
- No biometric recognition or secure voice login.
- No native speech-to-speech, cloud free-tier dependency or promise of unlimited hosted inference.
- No automatic web/news access, messaging, purchases or unrestricted device control.
- No built-in background notifications. Export due tasks to a calendar if needed.
- Static hosting serves local tools only; local AI requires a running backend and computer.

## Development and verification

`npm test` runs Node unit tests, backend HTTP tests and a jsdom + fake IndexedDB workflow test. DOM simulation checks data and event wiring; it does not validate browser layout, microphone or speech quality. `npm run build` prepares a static distribution. GitHub Actions runs tests and the build on pushes and pull requests.

See [TESTING.md](TESTING.md) for results and the physical-iPad checklist. The build environment could not load a local preview in its browser. No claim of real-device Safari or local model inference verification is made.

## References

- Gemini API age requirements: https://ai.google.dev/gemini-api/terms
- Ollama chat protocol: https://docs.ollama.com/api/chat
- Browser speech recognition: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- Browser speech output: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
