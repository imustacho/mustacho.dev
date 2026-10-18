export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                backgroundColor: "var(--bg)",
                backgroundImage: `
                  radial-gradient(circle, var(--dot-color) 0.8px, transparent 2.5px),
                  radial-gradient(circle, var(--dot-color) 0.8px, transparent 2.5px)
                `,
                backgroundSize: "35px 35px",
                backgroundPosition: "0 0, 17.5px 17.5px",
            }}
            className="min-h-screen w-full relative transition-colors duration-300"
        >
            {children}
        </div>
    );
}
