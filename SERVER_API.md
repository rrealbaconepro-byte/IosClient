# Rovival client API contract

The client works with the existing endpoints:

- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `GET /api/health`
- `GET /api/games`
- `GET /api/avatar`
- `POST /api/avatar`
- `GET /api/inventory`
- `GET /api/catalog`
- `GET /api/players`

For full multiplayer features, the client optionally calls:

- `GET /api/friends`
- `GET /api/friends/requests`
- `POST /api/friends/request`
- `GET /api/world/:gameId`
- `POST /api/world/:gameId/position`
- `GET /api/chat/:gameId`
- `POST /api/chat/:gameId`

If those optional endpoints are not present yet, the app remains playable locally and simply shows no remote players/messages.
