set dotenv-load

build: format test check build-front build-back

format: format-front format-back

format-front:
    cd ./frontend && npx prettier --write .

format-back:
    cargo fmt

test:
    cargo test

check:
    cd ./frontend && npm run check
    cargo check

build-front:
    cd ./frontend && npm run build

watch-front:
    cd ./frontend && npm run build:watch

build-back:
    cargo build

run: build-front
    cargo run
