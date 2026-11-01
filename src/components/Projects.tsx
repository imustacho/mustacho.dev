export default function Projects() {
    return (
        <section
            className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center sm:py-20"
            aria-labelledby="projects-title"
        >
            <h1
                id="projects-title"
                className="font-heading text-5xl tracking-tight sm:text-6xl"
                style={{ color: "var(--accent)" }}
            >
                Projects
            </h1>
            <div
                className="flex min-h-64 w-full items-center justify-center rounded-[2rem] border border-dashed px-6 py-16"
                style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-strong)",
                }}
            >
                <p
                    lang="tr"
                    className="font-heading text-3xl tracking-tight sm:text-4xl"
                    style={{ color: "var(--text-muted)" }}
                >
                    çalışıyorum...
                </p>
            </div>
        </section>
    );
}
