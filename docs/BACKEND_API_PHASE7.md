# Backend API Phase 7

Goal: align frontend screens with real backend read endpoints, one module at a time.

## Current completed endpoints

```text
GET /api/dashboard/summary
GET /api/dashboard/overview
GET /api/routes
GET /api/routes/data
GET /api/routes/customers/data
GET /api/mcp-day/current
GET /api/mcp-day/data
GET /api/orders
GET /api/tests
GET /api/market-checks
GET /api/market-checks/data
```

These endpoints return wrapped payloads:

```json
{
  "data": {},
  "receivedAt": "2026-07-03T00:00:00.000Z"
}
```

The frontend API client recognizes this shape and marks the result as `source: api`.

## VPS deploy

From local, sync upstream to origin first, then deploy backend on VPS using the existing backend deploy script.

On VPS:

```bash
/var/www/deploy-mcp-backend.sh
```

## Quick checks on VPS

```bash
curl -fsS http://127.0.0.1:3001/api/health
curl -fsS http://127.0.0.1:3001/api/dashboard/summary
curl -fsS http://127.0.0.1:3001/api/dashboard/overview
curl -fsS http://127.0.0.1:3001/api/routes
curl -fsS http://127.0.0.1:3001/api/routes/data
curl -fsS http://127.0.0.1:3001/api/routes/customers/data
curl -fsS 'http://127.0.0.1:3001/api/routes/customers/data?routeId=route-cho-gao-center'
curl -fsS http://127.0.0.1:3001/api/mcp-day/current
curl -fsS http://127.0.0.1:3001/api/mcp-day/data
curl -fsS http://127.0.0.1:3001/api/orders
curl -fsS 'http://127.0.0.1:3001/api/orders?status=confirmed'
curl -fsS 'http://127.0.0.1:3001/api/orders?search=Minh'
curl -fsS http://127.0.0.1:3001/api/tests
curl -fsS http://127.0.0.1:3001/api/market-checks
curl -fsS http://127.0.0.1:3001/api/market-checks/data
curl -fsS 'http://127.0.0.1:3001/api/market-checks?status=risk'
curl -fsS 'http://127.0.0.1:3001/api/market-checks/data?search=Sua'

curl -fsS http://165.22.109.61/api/dashboard/summary
curl -fsS http://165.22.109.61/api/dashboard/overview
curl -fsS http://165.22.109.61/api/routes
curl -fsS http://165.22.109.61/api/routes/data
curl -fsS http://165.22.109.61/api/routes/customers/data
curl -fsS http://165.22.109.61/api/mcp-day/current
curl -fsS http://165.22.109.61/api/mcp-day/data
curl -fsS http://165.22.109.61/api/orders
curl -fsS http://165.22.109.61/api/tests
curl -fsS http://165.22.109.61/api/market-checks
curl -fsS http://165.22.109.61/api/market-checks/data
```

Expected dashboard summary shape:

```json
{
  "data": {
    "routeCount": 8,
    "accountCount": 51,
    "visitCount": 73,
    "orderAmount": 403000,
    "actionCount": 9
  },
  "receivedAt": "..."
}
```

Expected dashboard overview shape:

```text
data.kpis
data.routeHealth
data.actions
data.insights
receivedAt
```

Expected routes list shape:

```text
data[]
data[].id
data[].name
data[].area
data[].owner
data[].active
receivedAt
```

Expected routes data shape:

```text
data.kpis
data.routes
receivedAt
```

Expected route customers data shape:

```text
data.kpis
data.customers
data.customers[].routeId
data.customers[].accountName
data.customers[].status
data.customers[].gps optional
receivedAt
```

Expected MCP current day shape:

```text
data.id
data.routeName
data.date
data.owner
data.status
receivedAt
```

Expected MCP day data shape:

```text
data.run
data.kpis
data.lines
data.results
receivedAt
```

Expected orders shape:

```text
data[]
data[].id
data[].code
data[].date
data[].accountName
data[].routeName
data[].owner
data[].source
data[].skuCount
data[].quantity
data[].totalAmount
data[].status
receivedAt
```

Expected tests and market checks data shape:

```text
data.kpis
data.checks
data.checks[].id
data.checks[].date
data.checks[].routeName
data.checks[].accountName
data.checks[].productName
data.checks[].competitorName
data.checks[].shelfPrice
data.checks[].stockStatus
data.checks[].note
data.checks[].status
receivedAt
```

Expected market checks list shape:

```text
data[]
data[].id
data[].date
data[].routeName
data[].accountName
data[].productName
data[].status
receivedAt
```

Supported query params:

```text
status
search
```

## Next endpoint order

```text
1. /api/dashboard/summary - done
2. /api/dashboard/overview - done
3. /api/routes - done
4. /api/routes/data - done
5. /api/routes/customers/data - done
6. /api/mcp-day/current - done
7. /api/mcp-day/data - done
8. /api/orders - done
9. /api/tests - done
10. /api/market-checks - done
11. /api/market-checks/data - done
12. /api/actions
```

## Important rule

This phase only adds read endpoints first. Do not tighten Supabase RLS or move browser writes until backend write APIs exist and are tested.
