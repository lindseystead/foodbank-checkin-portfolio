# Ops notes

## Production topology

| Layer | Host |
|-------|------|
| Client | Vercel — https://foodbank-checkin-tan.vercel.app/ |
| Admin | Vercel — https://foodbank-checkin.vercel.app/ |
| API | Google Cloud Run |
| DB / Auth | Supabase |

## Day-of operations (staff)

Full walkthrough for the live demo: see **Try the live demo** in the root [README](../README.md).

1. Upload a Link2Feed-style CSV for **today’s** appointments (or run Link2Feed API sync).
2. Clients check in on the kiosk (phone + last name).
3. Staff monitor check-ins, print tickets, handle help requests.
4. Day-of rows expire per backend retention (~24h).

Sample CSV shape: [`sample-format.csv`](sample-format.csv). Replace `Pick Up Date` values with the current local operating date before uploading.
