# Research Hub Backend

## Setup

1. Copy `.env.example` to `.env` and update `MONGO_URI` plus admin and Cloudinary settings.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

## API Endpoints

- `GET /api/research`
- `GET /api/research/:id` (requires `?pin=XXXX` if PIN is set)
- `POST /api/auth/login`
- `POST /api/research`
- `PUT /api/research/:id`
- `DELETE /api/research/:id`
