# Verification report — 2026-09-25

## Automated checks

Run `npm ci && npm test`. Tests cover:

- Safe arithmetic precedence, parentheses, invalid input and divide-by-zero rejection.
- Related-topic memory retrieval and exclusion of private memories from model context.
- Profile sharing opt-in; pinned and relevant memory selection.
- Commands parse into proposals without executing writes.
- Flashcard due dates, retry delay and increasing intervals.
- Backup validation, duplicate record rejection and exclusion of voice recordings.
- Encrypted export/decrypt round trip and wrong-password rejection.
- Dated task export, calendar escaping and exclusion of completed tasks.
- Static serving, content security policy, removed cloud endpoints.
- Backend access code, origin validation, malformed input and local provider redaction.
- Optional local model request shape and history role filtering (mocked, no model download).
- DOM workflow: profile suggestion review/save, memory create/edit, task completion, notes update, flashcard review, focus log, chat save confirmation, calculator, safe text rendering, IndexedDB persistence.

## Not verified in this environment

The cloud browser rejects the local preview address. Browser-engine downloads also failed. DOM tests were used for functional coverage, not as a claim of real browser testing.

Unverified: rendered layout on physical iPad, microphone permission and recording quality, Safari speech recognition availability, audio output selection, wake lock, service worker installation/offline use on-device, calendar import into Apple Calendar, generative model inference with installed weights.

## iPad release checklist

1. Serve over HTTPS. Open in Safari and Add to Home Screen. Verify portrait and landscape controls fit and remain tappable.
2. Save a temporary profile and memory. Restart the PWA and verify they persist. Search a related topic.
3. Create/edit/complete/delete a test task; export a dated task and check its time when imported into Calendar.
4. Create/edit/search a note. Create a flashcard; reveal and grade; reload and check the review date.
5. Start/pause/finish focus. Verify the elapsed time after returning from background.
6. Tap Dictate, grant microphone if wanted, and review transcript. Verify nothing sends until Send. Test speaker voice, Stop audio, and backgrounding stops capture.
7. Record/replay/delete a brief voice reference. Verify no identity claim is displayed.
8. Export an encrypted backup, restore it with the correct password, and reject a wrong password. Verify recording is excluded.
9. After first load, disconnect network and reopen. Test local tools and a clear error for optional AI.
10. If using a local model, configure it and verify wrong access codes fail. Confirm only approved context is sent, private memories are excluded, and provider failure returns a useful message.

Use disposable sample data for this checklist. Keep a backup before destructive tests.
