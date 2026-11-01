export default function Projects() {
    return (
        <section
            className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-6 py-16 text-center sm:py-20"
            aria-labelledby="projects-title"
        >
            <h1
                id="projects-title"
                className="font-heading text-5xl tracking-tight sm:text-6xl"
                style={{ color: "var(--accent)" }}
            >
                Projects
            </h1>
            <p
                className="text-lg sm:text-xl"
                style={{ color: "var(--text-muted)" }}
            >
                New projects are coming soon.
            </p>
        </section>
    );
}
