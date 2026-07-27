# Privacy and data protection

DPF-RT is a local research prototype. It contains no telemetry, analytics, tracking, backend, or application-controlled data transfer.

Use pseudonyms only. Do not enter real names, institutional identifiers, select-agent information, genuine non-public protocols, or real operational details. Demo content is explicitly fictional.

Stored data includes evaluation content, pseudonym, browser user-agent, coarse viewport class, locale, and timestamps. The user-agent exists only as usability context; institutions should determine whether retaining it is proportionate before real research use.

Data remains in `localStorage` under `dpft:` keys. Exported JSON/CSV files leave the browser only when a person explicitly downloads and shares them. The approved Phase 0 pilot channel is human-mediated email/shared-drive exchange; institutional retention, access-control, encryption, and deletion requirements remain outside the application.

“Delete all local data” requires typing `DELETE` and removes only keys beginning with `dpft:`. Exported files are unaffected and must be managed separately.

Real-study use requires institutional data-protection and research-governance review.
