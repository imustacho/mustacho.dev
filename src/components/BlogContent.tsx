import ReactMarkdown from "react-markdown";

export default function BlogContent({ content }: { content: string }) {
    return (
        <ReactMarkdown
            components={{
                pre: ({ children }) => <>{children}</>,
                h1: ({ children }) => (
                    <h1
                        className="font-heading text-3xl md:text-4xl mt-8 mb-4"
                        style={{ color: "var(--accent)" }}
                    >
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2
                        className="font-heading text-2xl md:text-3xl mt-8 mb-3"
                        style={{ color: "var(--accent)" }}
                    >
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3
                        className="font-heading text-xl md:text-2xl mt-6 mb-2"
                        style={{ color: "var(--accent)" }}
                    >
                        {children}
                    </h3>
                ),
                p: ({ children }) => (
                    <p className="leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
                        {children}
                    </p>
                ),
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-medium transition-opacity hover:opacity-70"
                        style={{ color: "var(--accent)" }}
                    >
                        {children}
                    </a>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-5 flex flex-col gap-2">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-5 flex flex-col gap-2">{children}</ol>
                ),
                li: ({ children }) => (
                    <li className="pl-1 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
                        {children}
                    </li>
                ),
                blockquote: ({ children }) => (
                    <blockquote
                        className="border-l-4 pl-4 py-1 italic my-5 rounded-r-lg"
                        style={{
                            borderColor: "var(--border-strong)",
                            backgroundColor: "var(--border)",
                            color: "var(--text-faint)",
                        }}
                    >
                        {children}
                    </blockquote>
                ),
                code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                        <pre
                            className="p-4 rounded-xl font-mono text-xs md:text-sm overflow-x-auto my-5 w-full leading-normal border"
                            style={{
                                backgroundColor: "var(--bg-surface)",
                                borderColor: "var(--border-strong)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <code className={className} {...props}>{children}</code>
                        </pre>
                    ) : (
                        <code
                            className="px-1.5 py-0.5 rounded font-mono text-xs md:text-sm font-semibold border"
                            style={{
                                backgroundColor: "var(--border)",
                                borderColor: "var(--border-strong)",
                                color: "var(--accent)",
                            }}
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
