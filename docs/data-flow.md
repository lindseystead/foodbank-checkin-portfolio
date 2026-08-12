# Data flow

```
Link2Feed CSV export (primary)  ─┐
Link2Feed API sync (optional)  ──┼─► API ingest ─► unified records (tenant-scoped)
Manual / kiosk check-in        ─┘         │
                                          ▼
                    Admin dashboard ◄─────┤
                    Print ticket          │
                    Reports / HungerCount ┘
                                          │
                    Client kiosk ─────────┘ (lookup + special requests + confirmation)
```

Day-of appointment payloads expire (~24h). Client profiles and volunteer/consent data persist longer under RLS in the private backend.
