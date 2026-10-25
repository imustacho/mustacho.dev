"use client";

export default function GlobalError() {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f5efe6", color: "#49382d" }}>
                <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: 20, padding: 24, textAlign: "center" }}>
                    <h1>This page couldn&apos;t load.</h1>
                    <p>Reload the page to start again.</p>
                    <button onClick={() => window.location.reload()} style={{ padding: "12px 24px", cursor: "pointer" }}>Reload page</button>
                </main>
            </body>
        </html>
    );
}
