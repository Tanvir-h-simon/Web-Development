# Uptime Monitoring Application

A RESTful uptime monitoring API built with **raw Node.js** — no Express, no frameworks, no external HTTP libraries. Data is persisted as flat JSON files on disk.

---

## Features

- **User accounts** — create, read, update, delete
- **Token-based authentication** — login / logout / extend session
- **Uptime checks** — monitor any HTTP or HTTPS URL (up to 5 per user)
- **Background worker** — pings every registered URL once per minute and updates its state
- **SMS alerts** — notifies the user via Twilio when a check flips between `up` and `down`

---

## Project Structure

```
.
├── app.js                          # Entry point — starts server + workers
├── config.js                       # Per-environment settings (port, secret, Twilio)
├── routes.js                       # Route map
├── lib/
│   ├── server.js                   # HTTP server setup
│   └── workers.js                  # Background URL checker loop
├── handlers/
│   └── routesHandlers/
│       ├── userHandler.js          # POST/GET/PUT/DELETE /users
│       ├── tokenHandler.js         # POST/GET/PUT/DELETE /tokens
│       ├── checkHandler.js         # POST/GET/PUT/DELETE /checks
│       ├── notFoundHandler.js      # 404 fallback
│       └── sampleHandlers.js       # Health-check route
├── helpers/
│   ├── handleReqRes.js             # Core request parser & router
│   ├── fileData.js                 # File-based CRUD (create/read/update/delete/list)
│   ├── hash.js                     # SHA-256 password hashing + random token generator
│   └── notifications.js            # Twilio SMS helper
└── .data/
    ├── users/                      # One JSON file per user (phone number as filename)
    ├── tokens/                     # One JSON file per active session token
    └── checks/                     # One JSON file per uptime check
```

---

## Getting Started

### Prerequisites

- Node.js v18 or newer

### Install dependencies

```bash
npm install
```

### Run (development — auto-restart on file change)

```bash
npm run dev
```

### Run (production)

```bash
NODE_ENV=production node app.js
```

| Environment | Port |
|-------------|------|
| staging (default) | 3000 |
| production | 5000 |

---

## API Reference

All requests and responses use `Content-Type: application/json`.  
Protected routes require a `token` header with a valid session token.

---

### Users

#### Create a user
```
POST /users
```
Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "01812345678",
  "password": "yourPassword",
  "tosAgreement": true
}
```

#### Get a user *(auth required)*
```
GET /users?phone=01812345678
Headers: token: <tokenId>
```

#### Update a user *(auth required)*
```
PUT /users
Headers: token: <tokenId>
```
Body (any subset):
```json
{
  "phone": "01812345678",
  "firstName": "Jane",
  "password": "newPassword"
}
```

#### Delete a user *(auth required)*
```
DELETE /users?phone=01812345678
Headers: token: <tokenId>
```

---

### Tokens (Authentication)

#### Login — create a token
```
POST /tokens
```
Body:
```json
{
  "phone": "01812345678",
  "password": "yourPassword"
}
```
Response includes `id`, `phone`, and `expires` (Unix ms).

#### Get a token
```
GET /tokens?id=<tokenId>
```

#### Extend a token by 1 hour
```
PUT /tokens
```
Body:
```json
{
  "id": "<tokenId>",
  "extend": true
}
```

#### Logout — delete a token
```
DELETE /tokens?id=<tokenId>
```

---

### Checks

#### Create a check *(auth required, max 5 per user)*
```
POST /checks
Headers: token: <tokenId>
```
Body:
```json
{
  "protocol": "https",
  "url": "google.com",
  "method": "get",
  "successCodes": [200, 301],
  "timeoutSeconds": 3
}
```

#### Get a check *(auth required)*
```
GET /checks?id=<checkId>
Headers: token: <tokenId>
```

#### Update a check *(auth required)*
```
PUT /checks
Headers: token: <tokenId>
```
Body (`id` required, rest optional):
```json
{
  "id": "<checkId>",
  "url": "example.com",
  "timeoutSeconds": 5
}
```

#### Delete a check *(auth required)*
```
DELETE /checks?id=<checkId>
Headers: token: <tokenId>
```

---

## SMS Alerts (Twilio)

To receive SMS notifications when a check changes state, add your Twilio credentials to `config.js`:

```js
twilio: {
  accountSid: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authToken:  'your_auth_token',
  fromPhone:  '+1xxxxxxxxxx',
}
```

If credentials are not set, the worker logs the would-be alert to the console instead of failing.

---

## License

MIT
