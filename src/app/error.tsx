"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
            <h1 className="font-heading text-3xl">This page couldn&apos;t load.</h1>
            <p>Please try again or reload the page.</p>
            <div className="flex gap-4">
                <button onClick={reset} className="rounded-xl border px-5 py-3 cursor-pointer">Try again</button>
                <button onClick={() => window.location.reload()} className="rounded-xl border px-5 py-3 cursor-pointer">Reload page</button>
            </div>
        </main>
    );
}
