# Link2Feed & CSV ingest

How appointment data enters the production system. Implementation of the Express client, CSV processor, and credential storage lives in the **private** API repo; this note describes the design as shipped. The public repo includes the admin Settings / CSV Upload UI that drives it.

## Problem

Staff already run day-of appointments in Link2Feed. The check-in system must load that day’s list without forcing every site to wire API keys on day one, and without maintaining two different “sources of truth” for kiosk lookup and tickets.

## Two ingest paths, one record model

```
Link2Feed Appointment List CSV  ──┐
                                  ├──► ingest ──► unified day-of records (tenant-scoped)
Link2Feed REST API (optional)  ───┘         │
                                            ▼
                         Admin check-ins / dashboard / tickets
                         Kiosk phone + last-name lookup
```

Both paths write the same unified appointment/check-in shape used by the kiosk and admin. Controllers talk to a stable store API (`unifiedStore`); persistence is tenant-scoped Postgres behind that adapter.

**CSV is primary.** Sites can run indefinitely on daily exports.

**API is optional.** When credentials are configured, staff can pull today’s appointments from Settings without a file upload. CSV remains available alongside it.

## CSV path (primary)

1. Staff export **Appointment List → CSV** from Link2Feed (not Mail Merge / Client List).
2. Admin → **CSV Upload** posts the file to the staff API.
3. Processor:
   - Fuzzy header detection (spacing / casing / naming variants)
   - Date-mismatch gate (CSV day vs operating timezone “today”; confirm to override)
   - Deduplication on re-upload
4. Rows become day-of records with ~24h expiry (`expires_at`), then purge on an interval.

Sample column shape for demos: [`sample-format.csv`](sample-format.csv). Live imports need **today’s** `Pick Up Date` in the food bank timezone.

## API path (optional)

Admin **Settings** drives:

| Action | Purpose |
|--------|---------|
| Configure | Save API key, HMAC secret, base URL, agency ID (per tenant; secrets not returned to the browser) |
| Test connection | Verify signed requests reach Link2Feed |
| Sync now | Pull today’s appointments into the same unified records as CSV |
| Clear config | Remove credentials; fall back to CSV-only |

Signing follows Link2Feed’s HMAC-SHA256 scheme (request body signed with the secret; API key on the request). Environments (test / staging / live) map to Link2Feed base URLs in the Settings UI.

If credentials are missing, status endpoints return a graceful “not configured” state so the UI can stay in CSV-only mode without errors.

## What this repo includes vs private

| In this public snapshot | Private (not published) |
|-------------------------|-------------------------|
| CSV Upload UI, instructions, sample format | CSV processor service |
| Link2Feed Settings / status / sync UI | HMAC HTTP client, credential encryption at rest |
| Architecture / data-flow notes | Routes, migrations, env / Secret Manager |

## Honest limits

- The live portfolio demo does **not** ship real Link2Feed API keys. Use CSV upload to exercise ingest.
- This is not “Link2Feed is the database.” Link2Feed is an upstream appointment source; Postgres holds tenant-scoped operational data for the check-in product.
