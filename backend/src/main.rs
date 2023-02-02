use std::{io, env::var};

use axum::{Router, routing::get_service, response::IntoResponse, http::StatusCode};
use sacredsakura::{FRONTEND_PATH, PORT, HOST};
use tower_http::services::ServeDir;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(EnvFilter::new(var("RUST_LOG").unwrap_or_else(|_| "sacredsakura=debug".into())))
        .with(tracing_subscriber::fmt::layer())
        .init();
        

    let app = Router::new()
        .fallback_service(get_service(ServeDir::new(FRONTEND_PATH).append_index_html_on_directories(true)).handle_error(handle_error));

    let (host, port) = from_env();

    let addr = format!("{}:{}", host, port).parse().expect("Can not parse address and port.");

    tracing::debug!("Listening on http://{addr}");

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handle_error(_err: io::Error) -> impl IntoResponse {
    (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong accessing static files.")
}

fn from_env() -> (String, String) {
    (var("SERVER_HOST").unwrap_or_else(|_| HOST.into()), var("SERVER_PORT").unwrap_or_else(|_| PORT.to_string()))
}
