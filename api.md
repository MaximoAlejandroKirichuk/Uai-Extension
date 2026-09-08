# Events API

This backend exposes a small JSON API for event discovery and event sources. The current implementation is intentionally simple: it has no authentication, uses MongoDB through Mongoose, and serves all routes under `/api`.

## Quick integration

Use this base URL in the frontend:

```txt
http://localhost:3000/api
```

If `PORT` is configured, replace `3000` with that value.

Example frontend environment variable:

```env
VITE_API_URL=http://localhost:3000/api
```

Example request:

```js
const API_URL = import.meta.env.VITE_API_URL;

const events = await fetch(`${API_URL}/events`).then((response) => response.json());
```

## Runtime behavior

| Topic | Current behavior |
| --- | --- |
| Framework | Express 5 |
| Response format | JSON |
| Request body format | JSON, parsed with `express.json()` |
| API prefix | `/api` |
| Default port | `3000` |
| CORS | Open to all origins via `cors()` |
| Authentication | Not implemented |
| Authorization | Not implemented |
| Validation | Minimal; most fields are passed directly to Mongoose |
| Persistence | MongoDB via Mongoose |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | HTTP server port. Defaults to `3000`. |
| `MONGODB_URI` | No | Full MongoDB connection string. Takes precedence over the split Mongo variables. |
| `MONGOHOST` | No | MongoDB host when `MONGODB_URI` is not set. Defaults to `localhost`. |
| `MONGOPORT` | No | MongoDB port when `MONGODB_URI` is not set. Defaults to `27017`. |
| `MONGODATABASE` | No | MongoDB database name when `MONGODB_URI` is not set. Defaults to `events_db`. |
| `EMAIL_USER` | Only for sync email notifications | Gmail account used by the sync script. |
| `EMAIL_PASS` | Only for sync email notifications | Gmail password/app password used by the sync script. |
| `EMAIL_NOTIFY` | Only for sync email notifications | Email recipient for new-event notifications. |

## Endpoints

### Health check

There is currently no health-check endpoint.

### Events

Base path:

```txt
/api/events
```

#### `GET /api/events`

Returns all events sorted by `createdAt` ascending.

Response: `200 OK`

```json
[
  {
    "nombre": "Example event",
    "url": "https://example.com/event",
    "descripcion": "Event description",
    "fecha_inicio": "2026-09-08T00:00:00.000Z",
    "fecha_fin": null,
    "ubicacion": "Buenos Aires",
    "categoria": "Entrepreneurship",
    "modalidad": "Online",
    "costo_entrada": "Free",
    "fuente_id": "66f000000000000000000001",
    "url_detalles": "https://example.com/event/details",
    "finalizado": false,
    "createdAt": "2026-09-08T12:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z",
    "id": "66f000000000000000000002",
    "fuente": {
      "id": "66f000000000000000000001",
      "nombre": "Endeavor",
      "url": "https://www.endeavor.org.ar"
    }
  }
]
```

Error response: `500 Internal Server Error`

```json
{ "error": "Error al obtener eventos" }
```

#### `GET /api/events/:id`

Returns one event by MongoDB ObjectId.

Path parameters:

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes | Must be a valid MongoDB ObjectId. Invalid ids are treated as not found. |

Response: `200 OK`

```json
{
  "nombre": "Example event",
  "url": "https://example.com/event",
  "descripcion": "Event description",
  "fecha_inicio": "2026-09-08T00:00:00.000Z",
  "fecha_fin": null,
  "ubicacion": "Buenos Aires",
  "categoria": "Entrepreneurship",
  "modalidad": "Online",
  "costo_entrada": "Free",
  "fuente_id": "66f000000000000000000001",
  "url_detalles": "https://example.com/event/details",
  "finalizado": false,
  "createdAt": "2026-09-08T12:00:00.000Z",
  "updatedAt": "2026-09-08T12:00:00.000Z",
  "id": "66f000000000000000000002",
  "fuente": {
    "id": "66f000000000000000000001",
    "nombre": "Endeavor",
    "url": "https://www.endeavor.org.ar"
  }
}
```

Not found response: `404 Not Found`

```json
{ "error": "Evento no encontrado" }
```

Error response: `500 Internal Server Error`

```json
{ "error": "Error al obtener el evento" }
```

#### `POST /api/events`

Creates an event.

Authentication is not required in the current code, so this endpoint is publicly callable while the API is exposed.

Request body:

| Field | Type | Required by code | Notes |
| --- | --- | --- | --- |
| `nombre` | string | Yes | Required by the Mongoose schema. |
| `url` | string | No | Trimmed by Mongoose. |
| `descripcion` | string | No | Trimmed by Mongoose. |
| `fecha_inicio` | string/date/null | No | Empty string is converted to `null`. |
| `fecha_fin` | string/date/null | No | Empty string is converted to `null`. |
| `ubicacion` | string/null | No | Defaults to `null`. |
| `categoria` | string/null | No | Defaults to `null`. |
| `modalidad` | string/null | No | Defaults to `null`. |
| `costo_entrada` | string/null | No | Defaults to `null`. |
| `fuente_id` | string/null | No | Must be a valid MongoDB ObjectId. Invalid values are saved as `null`. |
| `url_detalles` | string/null | No | Defaults to `null`. |
| `finalizado` | boolean | No | Defaults to `false`. |

Example request:

```json
{
  "nombre": "Example event",
  "url": "https://example.com/event",
  "descripcion": "Event description",
  "fecha_inicio": "2026-09-08T00:00:00.000Z",
  "fecha_fin": null,
  "ubicacion": "Buenos Aires",
  "categoria": "Entrepreneurship",
  "modalidad": "Online",
  "costo_entrada": "Free",
  "fuente_id": "66f000000000000000000001",
  "url_detalles": "https://example.com/event/details",
  "finalizado": false
}
```

Response: `201 Created`

```json
{
  "nombre": "Example event",
  "url": "https://example.com/event",
  "descripcion": "Event description",
  "fecha_inicio": "2026-09-08T00:00:00.000Z",
  "fecha_fin": null,
  "ubicacion": "Buenos Aires",
  "categoria": "Entrepreneurship",
  "modalidad": "Online",
  "costo_entrada": "Free",
  "fuente_id": "66f000000000000000000001",
  "url_detalles": "https://example.com/event/details",
  "finalizado": false,
  "createdAt": "2026-09-08T12:00:00.000Z",
  "updatedAt": "2026-09-08T12:00:00.000Z",
  "id": "66f000000000000000000002"
}
```

Error response: `500 Internal Server Error`

```json
{ "error": "Error al crear evento" }
```

### Sources

Base path:

```txt
/api/sources
```

#### `GET /api/sources`

Returns all event sources sorted by `createdAt` ascending.

Response: `200 OK`

```json
[
  {
    "nombre": "Endeavor",
    "url": "https://www.endeavor.org.ar",
    "createdAt": "2026-09-08T12:00:00.000Z",
    "updatedAt": "2026-09-08T12:00:00.000Z",
    "id": "66f000000000000000000001"
  }
]
```

Error response: `500 Internal Server Error`

```json
{ "error": "Error al obtener las fuentes" }
```

#### `POST /api/sources`

Creates an event source.

Authentication is not required in the current code, so this endpoint is publicly callable while the API is exposed.

Request body:

| Field | Type | Required by code | Notes |
| --- | --- | --- | --- |
| `nombre` | string | Yes, unless `name` is provided | Stored as `nombre`. |
| `name` | string | Yes, unless `nombre` is provided | Compatibility alias for `nombre`. |
| `url` | string | No | Trimmed by Mongoose. |

Example request:

```json
{
  "nombre": "Endeavor",
  "url": "https://www.endeavor.org.ar"
}
```

Response: `201 Created`

```json
{
  "nombre": "Endeavor",
  "url": "https://www.endeavor.org.ar",
  "createdAt": "2026-09-08T12:00:00.000Z",
  "updatedAt": "2026-09-08T12:00:00.000Z",
  "id": "66f000000000000000000001"
}
```

Error response: `500 Internal Server Error`

```json
{ "error": "Error al crear la fuente" }
```

## Data model notes

### Event

MongoDB collection: `eventos`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | string | Generated | JSON alias for MongoDB `_id`. |
| `nombre` | string | None | Required. |
| `url` | string | Undefined | Optional. |
| `descripcion` | string | Undefined | Optional. |
| `fecha_inicio` | date/null | `null` | Optional. |
| `fecha_fin` | date/null | `null` | Optional. |
| `ubicacion` | string/null | `null` | Optional. |
| `categoria` | string/null | `null` | Optional. |
| `modalidad` | string/null | `null` | Optional. |
| `costo_entrada` | string/null | `null` | Optional. |
| `fuente_id` | ObjectId/null | `null` | References a source document. |
| `fuente` | object/null | Derived | Present on event read endpoints after population. Not stored as a separate field by the service. |
| `url_detalles` | string/null | `null` | Optional. |
| `finalizado` | boolean | `false` | Optional. |
| `createdAt` | date | Generated | Added by Mongoose timestamps. |
| `updatedAt` | date | Generated | Added by Mongoose timestamps. |

### Source

MongoDB collection: `fuentes`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `id` | string | Generated | JSON alias for MongoDB `_id`. |
| `nombre` | string | None | Required. |
| `url` | string | Undefined | Optional. |
| `createdAt` | date | Generated | Added by Mongoose timestamps. |
| `updatedAt` | date | Generated | Added by Mongoose timestamps. |

## External integrations

### MongoDB

The API connects to MongoDB as soon as `config/db.js` is imported. If the connection fails, the process exits.

Connection priority:

1. Use `MONGODB_URI` when defined.
2. Otherwise build a local URI from `MONGOHOST`, `MONGOPORT`, and `MONGODATABASE`.

### Endeavor scraper

The sync script imports `getEndeavorEvents()` from `scraper/endeavorScraper.js` and scrapes events from Endeavor Argentina.

Script:

```bash
npm run sync
```

The script:

1. Creates or finds a source named `Endeavor`.
2. Scrapes current Endeavor events.
3. Inserts events that do not already exist by matching `nombre` and `url`.
4. Sends an email notification for each inserted event.

### Gmail notifications

The sync script sends email through Nodemailer using Gmail service configuration.

Required only when running sync notifications:

- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_NOTIFY`

## Frontend contract

For a frontend integration, assume this contract:

1. Configure a frontend API URL that points to `/api`.
2. Use JSON requests and responses.
3. No auth token or cookie is currently required.
4. The frontend can read events with `GET /events` and event details with `GET /events/:id`.
5. Admin/create screens would call `POST /events` and `POST /sources`, but those endpoints are currently unprotected.
6. Dates arrive as ISO strings or `null`.
7. MongoDB ids arrive as strings in the `id` field.
8. `fuente_id` may be `null`; `fuente` may also be `null`.

## Closed ambiguities

These decisions are based on the current code:

| Ambiguity | Documented decision |
| --- | --- |
| Is there API documentation? | No `api.md`, README, Swagger, or OpenAPI document is currently present. This file is the API reference for the current code. |
| What is the API base path? | `/api`, because `app.js` mounts `/api/events` and `/api/sources`. |
| What is the default port? | `3000`, despite one comment mentioning `4000`. The executable code uses `process.env.PORT || 3000`. |
| Is auth required? | No. There is no auth middleware or route-level authorization. |
| Is CORS restricted? | No. `cors()` is used with default options, so all origins are allowed by default. |
| Are create endpoints safe to expose publicly? | No. They currently work without auth, but a production frontend should not expose write operations unless auth/authorization is added. |
| Is `fuente` stored on events? | No. It is derived from `fuente_id` population in read services. |
| Is `fuente_id` always valid? | No. Invalid `fuente_id` values sent to `POST /api/events` are converted to `null`. |
| Can `POST /api/sources` receive `name`? | Yes. The service accepts `name` as a compatibility alias and stores it as `nombre`. |
| Is there pagination/filtering/search? | No. `GET /api/events` returns all events. |
| Is there a cron job running in the API process? | Not in the current `app.js`. `node-cron` is installed, but no active cron schedule was found in the API entrypoint. |

## Known gaps before production use

- Add authentication and authorization before exposing write endpoints.
- Restrict CORS to the frontend origin in production.
- Add request validation for create endpoints.
- Add a health-check endpoint.
- Add pagination/filtering for `GET /api/events` if the event list grows.
- Add automated tests.
- Consider generating OpenAPI documentation from this contract once the API stabilizes.