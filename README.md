# Open music API

# Run
- clone repo

- install node module
```sh
npm install
```

- copy `.env.example` to `.env` and fill credential
```sh
cp .env.example .env
cat <<EOENV > .env
HOST=localhost
PORT=5000
PGUSER=user        # Ganti dengan username PostgreSQL Anda
PGPASSWORD=password           # Ganti dengan password PostgreSQL Anda
PGDATABASE=openmusicapi# Ganti dengan nama database Anda
PGHOST=localhost      # Biasanya localhost jika database Anda berjalan di komputer yang sama
PGPORT=5432         # Port default PostgreSQL adalah 5432

ACCESS_TOKEN_KEY=abc123xyz # Ganti dengan secret key yang kuat
REFRESH_TOKEN_KEY=abc123xyz
EOENV
```

- run docker compose
```sh
docker compose up -d
```

- run migration
```sh
npm run migrate up
```
