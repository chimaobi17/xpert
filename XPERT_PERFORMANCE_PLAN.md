# 🚀 Xpert Performance Optimization & Latency Reduction Plan

This plan outlines the automated steps to optimize data retrieval and reduce latency across the Xpert platform.

## 1. Data Retrieval Strategy: Eager Loading
Based on analysis of the Laravel backend, **Eager Loading** is the core strategy for performance.

> [!IMPORTANT]
> **Why Eager Loading?**
> Xpert relies on listing multiple AI Agents and stored Prompts. Lazy loading would trigger an "N+1" query problem (e.g., 50 separate queries to fetch templates for 50 agents). Eager loading reduces this to a single optimized query.

### Implementation Status:
- [x] `AgentController`: Eager loading `latestTemplate`.
- [x] `LibraryController`: Eager loading `agent:id,name`.
- [x] `UserAgentController`: Added eager loading for `latestTemplate`.

---

## 2. Automated Infrastructure Alignment
To minimize cross-continent latency, both backend and frontend must reside in the same physical region.

| Service | Provider | Recommended Region |
| :--- | :--- | :--- |
| **Backend API** | Render.com | `us-east-1` (North Virginia) |
| **Frontend App** | Vercel | `iad1` (Washington, D.C. - us-east-1) |
| **Database** | Supabase/RDS | `us-east-1` |

**Action**: Verify and update the "Region" setting in Render and Vercel dashboard to match.

---

## 3. Automated Warm-up Routine (Anti-Cold Start)
Render's free/starter tiers spin down after inactivity. We implement a "heartbeat" to keep the service responsive.

### Step 1: Create Health Endpoint
Create an `api/health` route that performs a lightweight DB check.
```php
// routes/api.php
Route::get('/health', function() {
    return response()->json(['status' => 'healthy', 'timestamp' => now()]);
});
```

### Step 2: Automated Heartbeat
Configure a GitHub Action or Cron-job to ping this endpoint every 5 minutes.
```yaml
# .github/workflows/warmup.yml
name: Backend Warm-up
on:
  schedule:
    - cron: '*/5 * * * *'
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping API
        run: curl -s https://xpert-api.onrender.com/api/health
```

---

## 4. Caching Strategy
Automate caching for static and semi-static assets.

### Backend (Laravel Redis)
- **Agent List**: Cached for 5 minutes (`Cache::remember('agents_list', 300, ...)`).
- **Static Configurations**: Loaded into application memory on boot.

### Frontend (Edge Caching)
- Configure `vercel.json` to cache static assets and specific API responses at the edge.
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 5. Payload & Query Monitoring
Automated checks to ensure API responses remain lean.

- **Eloquent Resources**: Ensure all API responses use Resources to avoid sending unnecessary table columns (e.g., `password_hash`, `raw_internal_metadata`) to the frontend.
- **Latency Logging**: In `AppServiceProvider.php`, log any query taking longer than 500ms.
```php
DB::listen(function ($query) {
    if ($query->time > 500) {
        Log::warning('Slow query detected', [
            'sql' => $query->sql,
            'time' => $query->time
        ]);
    }
});
```

---

## 6. Real-time Monitoring & Alerts
Use a lightweight monitoring tool (e.g., **Sentry** or **Laravel Pulse**) to automatically alert via Slack/Email if:
- Latency exceeds **800ms**.
- Error rate exceeds **1%**.
- 404/500 peaks.
