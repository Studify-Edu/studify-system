# Cloud Sync & Data Integrity Rule

Whenever you are asked to add a new feature that involves storing data (e.g., a new table, a new module, a new type of record), you MUST ensure the following three steps are completed to maintain Data Integrity:

1. **Storage Layers:**
   - Define a unique key for the data (e.g., `K_NEW_FEATURE`).
   - Add it to the local IndexedDB saving process (`secureSave` inside `saveAll` and `saveAttendanceOnly`).
   - Add it to the Firebase Upload payload inside `saveAll()` and `saveAttendanceOnly()`.
   - Add it to the Firebase Download/Merge logic inside `loadAll()` and the real-time listener `onValue`.

2. **Cloud Data Monitor Visibility:**
   - You MUST add the new data entity to the `CLOUD_MONITOR_SECTIONS` array at the end of `app.js`.
   - This array powers the "Cloud Data Monitor" dashboard, ensuring the manager can always visually verify that the local data count matches the Firebase data count.

**NEVER skip adding a new data entity to `CLOUD_MONITOR_SECTIONS`. The user relies on this dashboard to verify that you did your job correctly.**

---

# Studify SaaS Subscription & Ecosystem Architecture

This system (`Studify-Edu/studify-system`) is part of a 2-part SaaS ecosystem:
1. **System 1 (Center App - this workspace):** Runs educational center operations.
2. **System 2 (Master SaaS Dashboard):** A standalone project located on the user's Desktop at `C:\Users\badra\OneDrive\Desktop\Studify-Cloud` (Repository: `balaa6538-oss/studify-cloud`).

### Communication Bridge (Supabase):
Both projects link ONLY through Supabase (`settings` table, row `id: 1`, column `config.subscription` JSONB):
- `is_active`: boolean (if false or expired -> system locks with overlay `#subscriptionLockScreen` and `#assistantSubscriptionLockScreen`).
- `plan_key`: 'monthly' | 'quarterly' | 'semi_annual' | 'custom'
- `plan_name`: display name of current plan
- `plan_end_date`: YYYY-MM-DD
- `max_students`: number (600, 750, 1000). System blocks adding students above this count via `checkStudentLimit()`.
- `max_assistants`: number (2, 4, 5).
- `marketing_enabled`: boolean (WhatsApp campaigns gated to Golden plan).

Any AI working on this repository MUST maintain this contract and NEVER combine the two codebases or delete the subscription lock/limit logic.

