

- [ ] **13.3 Cyber Attack & Distributed Error Logging**:
  - Consolidate logging of suspected cyber attacks: Brute-force login attempts, massive 404 scans, repeated 429s (Rate Limit Exceeded), SQL injection attempts, and 401/403 anomalies.
  - Create a dedicated `security` logging channel in `config/logging.php` to securely preserve threat data including Timestamp, Source IP, Target Path, and Attack Type.
  - Stream critical cyber attack and unhandled error logs (`CRITICAL` and `EMERGENCY`) directly to the designated Discord webhook to notify admins in real time about potential breaches or application crashes.

---

## Post-MVP Roadmap (Deferred)

| Feature | Trigger |
|---|---|
| Capacitor/Ionic mobile wrapper | User demand for app store presence |
| Paystack live payments | First paying customer intent |
| Redis + Horizon | Queue depth > 100 / writes > 50/sec |
| S3 / R2 file storage | Disk > 80% |
| Sentry / Datadog | Team > 3 devs |
| PostgreSQL | SQLite write contention |
| Multi-language prompts | User feedback |
| Team workspaces | Premium demand |
