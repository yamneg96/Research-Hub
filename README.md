# Research Hub

## Run Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Run Backend

```bash
cd Backend
npm install
npm start
```

## Notes

- Copy `Backend/.env.example` to `Backend/.env` and set `MONGO_URI`.
- Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `JWT_SECRET` for admin login.
- Add Cloudinary credentials to enable image uploads.
- Frontend expects the API at `http://localhost:5000` by default.
