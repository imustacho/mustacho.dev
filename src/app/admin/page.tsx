"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
    FaPlus, FaTrash, FaEdit, FaLock, FaSave, FaEye,
} from "react-icons/fa";
import { HiRocketLaunch, HiDocumentText } from "react-icons/hi2";

/* ─── Types ─────────────────────────────────────────────────── */
interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    codeUrl: string;
    demoUrl: string;
    icon: string;
    status: "active" | "archived" | "wip";
    featured: boolean;
}

type Tab = "blogs" | "projects";

/* ─── Admin Page ─────────────────────────────────────────────── */
export default function AdminPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [passcodeError, setPasscodeError] = useState("");
    const [tab, setTab] = useState<Tab>("blogs");

    const [notification, setNotification] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    /* ── Blog state ── */
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [blogForm, setBlogForm] = useState({
        title: "", excerpt: "", content: "",
        category: "General", readTime: "3 min read", date: ""
    });

    /* ── Project state ── */
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [projectForm, setProjectForm] = useState({
        title: "", description: "", tags: "",
        codeUrl: "", demoUrl: "", icon: "✨",
        status: "active" as Project["status"], featured: false
    });

    /* ─── Auth check ─────────────────────────────────────────── */
    useEffect(() => {
        // Check if we have a valid server-side session by pinging a protected endpoint
        fetch("/api/admin/verify")
            .then((r) => { if (r.ok) setIsUnlocked(true); })
            .catch(() => { });
    }, []);

    useEffect(() => { if (isUnlocked) { fetchBlogs(); fetchProjects(); } }, [isUnlocked]);

    /* ─── Helpers ────────────────────────────────────────────── */
    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    /* ─── Auth ───────────────────────────────────────────────── */
    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ passcode }),
            });
            if (!res.ok) {
                const data = await res.json();
                setPasscodeError(data.error || "Incorrect passcode.");
                return;
            }
            setIsUnlocked(true);
            setPasscodeError("");
            setPasscode("");
        } catch {
            setPasscodeError("Something went wrong. Try again.");
        }
    };

    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        setIsUnlocked(false);
    };

    /* ─── Blog CRUD ──────────────────────────────────────────── */
    const fetchBlogs = () => {
        setBlogsLoading(true);
        fetch("/api/blogs")
            .then((r) => r.json())
            .then((data) => { setPosts(data); setBlogsLoading(false); })
            .catch(() => { setBlogsLoading(false); showNotification("Failed to load blogs.", "error"); });
    };

    const openCreateBlog = () => {
        setEditingPost(null);
        setBlogForm({
            title: "", excerpt: "", content: "", category: "General",
            readTime: "3 min read",
            date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        });
        setIsBlogFormOpen(true);
    };

    const openEditBlog = (post: BlogPost) => {
        setEditingPost(post);
        setBlogForm({
            title: post.title, excerpt: post.excerpt, content: post.content,
            category: post.category, readTime: post.readTime, date: post.date
        });
        setIsBlogFormOpen(true);
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blogForm.title || !blogForm.content) {
            showNotification("Title and content are required.", "error"); return;
        }
        try {
            const url = editingPost ? `/api/blogs/${editingPost.id}` : "/api/blogs";
            const method = editingPost ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...blogForm,
                    excerpt: blogForm.excerpt || blogForm.content.slice(0, 120) + "..."
                }),
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
            showNotification(editingPost ? "Post updated!" : "Post published!", "success");
            setIsBlogFormOpen(false);
            fetchBlogs();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : "Failed to save.", "error");
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm("Delete this blog post?")) return;
        const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
        if (res.ok) { showNotification("Post deleted.", "success"); fetchBlogs(); }
        else showNotification("Failed to delete.", "error");
    };

    /* ─── Project CRUD ───────────────────────────────────────── */
    const fetchProjects = () => {
        setProjectsLoading(true);
        fetch("/api/projects")
            .then((r) => r.json())
            .then((data) => { setProjects(data); setProjectsLoading(false); })
            .catch(() => { setProjectsLoading(false); showNotification("Failed to load projects.", "error"); });
    };

    const openCreateProject = () => {
        setEditingProject(null);
        setProjectForm({ title: "", description: "", tags: "", codeUrl: "", demoUrl: "", icon: "✨", status: "active", featured: false });
        setIsProjectFormOpen(true);
    };

    const openEditProject = (p: Project) => {
        setEditingProject(p);
        setProjectForm({
            title: p.title, description: p.description,
            tags: p.tags.join(", "),
            codeUrl: p.codeUrl, demoUrl: p.demoUrl,
            icon: p.icon, status: p.status, featured: p.featured
        });
        setIsProjectFormOpen(true);
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectForm.title || !projectForm.description) {
            showNotification("Title and description are required.", "error"); return;
        }
        try {
            const payload = {
                ...projectForm,
                tags: projectForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
            };
            const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
            const method = editingProject ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
            showNotification(editingProject ? "Project updated!" : "Project created!", "success");
            setIsProjectFormOpen(false);
            fetchProjects();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : "Failed to save.", "error");
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (res.ok) { showNotification("Project deleted.", "success"); fetchProjects(); }
        else showNotification("Failed to delete.", "error");
    };

    /* ─── Shared input/field styles ─────────────────────────── */
    const inputCls = "w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors"
        + " bg-[#955623]/5 dark:bg-[rgba(149,86,35,0.08)] border-[#955623]/20 focus:border-[#955623]/50 text-[#7a451b]";
    const labelCls = "text-xs font-bold uppercase text-[#955623]/80";

    /* ─── Render ─────────────────────────────────────────────── */
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#f5efe6] py-32 px-6" style={{ color: "#955623" }}>
            <div className="max-w-4xl mx-auto w-full relative z-10">

                {/* Notification toast */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={`fixed top-28 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full text-white font-medium text-sm shadow-lg ${notification.type === "success" ? "bg-[#34a853]" : "bg-[#ea4335]"}`}
                        >
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {/* ── Lock screen ── */}
                    {!isUnlocked ? (
                        <motion.div
                            key="lock"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="max-w-md mx-auto bg-[#f5efe6] border-4 border-[#955623]/25 p-8 md:p-12 rounded-[2.5rem] shadow-[0_24px_60px_rgba(149,86,35,0.18)] text-center flex flex-col items-center gap-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#955623]/10 flex items-center justify-center text-[#955623] border border-[#955623]/25">
                                <FaLock size={24} />
                            </div>
                            <div>
                                <h1 className="font-heading text-3xl text-[#955623] tracking-tight">Admin Gateway</h1>
                                <p className="text-sm text-[#7a451b] mt-2">Enter passcode to manage site content.</p>
                            </div>
                            <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
                                <input
                                    type="password"
                                    placeholder="Enter passcode"
                                    value={passcode}
                                    onChange={(e) => setPasscode(e.target.value)}
                                    className="w-full px-5 py-3 rounded-2xl bg-[#955623]/5 border-2 border-[#955623]/20 focus:border-[#955623]/50 focus:outline-none text-[#7a451b] text-center font-mono text-lg tracking-widest placeholder:font-sans placeholder:tracking-normal"
                                    autoFocus
                                />
                                {passcodeError && <p className="text-xs font-semibold text-[#ea4335]">{passcodeError}</p>}
                                <button type="submit" className="w-full bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] font-bold py-3.5 px-6 rounded-2xl cursor-pointer transition-colors shadow-md">
                                    Access Panel
                                </button>
                            </form>
                        </motion.div>

                    ) : (
                        /* ── Dashboard ── */
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col gap-6 w-full"
                        >
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#955623]/15 pb-6">
                                <div>
                                    <h1 className="font-heading text-4xl text-[#955623] tracking-tight">Admin Panel</h1>
                                    <p className="text-sm text-[#7a451b] mt-1">Manage blogs and projects.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-bold text-[#955623] bg-[#955623]/8 border border-[#955623]/15 px-4 py-2.5 rounded-full hover:bg-[#955623]/15 transition-all select-none">
                                        <FaEye size={12} /> View Site
                                    </Link>
                                    <button onClick={handleLogout} className="inline-flex items-center gap-2 text-xs font-bold bg-[#ea4335]/8 text-[#ea4335] border border-[#ea4335]/15 px-4 py-2.5 rounded-full hover:bg-[#ea4335]/15 transition-all cursor-pointer select-none">
                                        Lock Panel
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 bg-[#955623]/6 p-1 rounded-2xl border border-[#955623]/10 w-fit">
                                {(["blogs", "projects"] as Tab[]).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer select-none ${tab === t ? "bg-[#955623] text-[#f5efe6] shadow-sm" : "text-[#7a451b] hover:bg-[#955623]/10"}`}
                                    >
                                        {t === "blogs" ? <HiDocumentText size={14} /> : <HiRocketLaunch size={14} />}
                                        {t}
                                    </button>
                                ))}
                            </div>

                            {/* ── BLOGS TAB ── */}
                            <AnimatePresence mode="wait">
                                {tab === "blogs" && (
                                    <motion.div key="blogs-tab" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex flex-col gap-6">
                                        {/* Blog toolbar */}
                                        <div className="flex justify-between items-center bg-[#955623]/5 p-4 rounded-2xl border border-[#955623]/10">
                                            <span className="text-sm font-semibold text-[#7a451b]">
                                                Posts: <strong className="text-[#955623] font-mono">{posts.length}</strong>
                                            </span>
                                            <button onClick={openCreateBlog} className="inline-flex items-center gap-2 bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer select-none">
                                                <FaPlus size={10} /> New Post
                                            </button>
                                        </div>

                                        {/* Blog form */}
                                        <AnimatePresence>
                                            {isBlogFormOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden bg-white border border-[#955623]/15 rounded-3xl p-6 shadow-[0_12px_45px_rgba(149,86,35,0.08)] flex flex-col gap-5"
                                                >
                                                    <div className="flex items-center justify-between border-b border-[#955623]/10 pb-3">
                                                        <h2 className="font-heading text-xl text-[#955623]">
                                                            {editingPost ? "Edit Post" : "Create Post"}
                                                        </h2>
                                                        <button onClick={() => setIsBlogFormOpen(false)} className="text-xs font-semibold text-[#7a451b]/70 hover:text-[#955623] cursor-pointer">Cancel</button>
                                                    </div>
                                                    <form onSubmit={handleBlogSubmit} className="flex flex-col gap-4 text-left">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                                <label className={labelCls}>Title</label>
                                                                <input type="text" value={blogForm.title} onChange={(e) => setBlogForm(f => ({ ...f, title: e.target.value }))} placeholder="Blog title..." className={inputCls} required />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <label className={labelCls}>Category</label>
                                                                <select value={blogForm.category} onChange={(e) => setBlogForm(f => ({ ...f, category: e.target.value }))} className={inputCls}>
                                                                    {["Web Dev", "Animation", "Tech", "Life", "General"].map(c => <option key={c}>{c}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex flex-col gap-1">
                                                                <label className={labelCls}>Read Time</label>
                                                                <input type="text" value={blogForm.readTime} onChange={(e) => setBlogForm(f => ({ ...f, readTime: e.target.value }))} placeholder="e.g. 5 min read" className={inputCls} />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <label className={labelCls}>Date</label>
                                                                <input type="text" value={blogForm.date} onChange={(e) => setBlogForm(f => ({ ...f, date: e.target.value }))} placeholder="e.g. August 6, 2026" className={inputCls} />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <label className={labelCls}>Excerpt</label>
                                                            <input type="text" value={blogForm.excerpt} onChange={(e) => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary..." className={inputCls} />
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <label className={labelCls}>Content (Markdown)</label>
                                                            <textarea rows={8} value={blogForm.content} onChange={(e) => setBlogForm(f => ({ ...f, content: e.target.value }))} placeholder="Write in Markdown. Use ### for headings." className={`${inputCls} font-mono resize-y`} required />
                                                        </div>
                                                        <button type="submit" className="mt-1 w-full md:w-auto self-end bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] font-bold py-3 px-8 rounded-xl cursor-pointer transition-colors shadow-sm inline-flex items-center justify-center gap-2 select-none">
                                                            <FaSave size={14} /> {editingPost ? "Update" : "Publish"}
                                                        </button>
                                                    </form>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Blog list */}
                                        {blogsLoading ? (
                                            <div className="text-center py-12 font-heading text-xl text-[#955623]">Loading...</div>
                                        ) : posts.length === 0 ? (
                                            <div className="text-center py-16 border border-dashed border-[#955623]/30 rounded-3xl">
                                                <p className="text-[#7a451b]">No posts yet.</p>
                                                <button onClick={openCreateBlog} className="mt-2 text-xs font-bold text-[#955623] underline cursor-pointer">Write your first post!</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                {posts.map((post) => (
                                                    <div key={post.id} className="bg-white border border-[#955623]/12 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 text-xs font-semibold">
                                                                <span className="px-2.5 py-0.5 bg-[#955623]/8 border border-[#955623]/12 rounded-full text-[#955623]">{post.category}</span>
                                                                <span className="text-[#7a451b]/60 font-mono">{post.date}</span>
                                                            </div>
                                                            <h3 className="font-heading text-lg text-[#955623]">{post.title}</h3>
                                                            <p className="text-xs text-[#7a451b]/80 line-clamp-1 max-w-xl">{post.excerpt}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 self-end md:self-auto">
                                                            <button onClick={() => openEditBlog(post)} className="p-2.5 text-xs font-bold text-[#955623] hover:bg-[#955623]/8 border border-[#955623]/15 rounded-xl cursor-pointer transition-colors" title="Edit">
                                                                <FaEdit size={13} />
                                                            </button>
                                                            <button onClick={() => handleDeleteBlog(post.id)} className="p-2.5 text-xs font-bold text-[#ea4335] hover:bg-[#ea4335]/8 border border-[#ea4335]/15 rounded-xl cursor-pointer transition-colors" title="Delete">
                                                                <FaTrash size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* ── PROJECTS TAB ── */}
                                {tab === "projects" && (
                                    <motion.div key="projects-tab" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="flex flex-col gap-6">
                                        {/* Project toolbar */}
                                        <div className="flex justify-between items-center bg-[#955623]/5 p-4 rounded-2xl border border-[#955623]/10">
                                            <span className="text-sm font-semibold text-[#7a451b]">
                                                Projects: <strong className="text-[#955623] font-mono">{projects.length}</strong>
                                            </span>
                                            <button onClick={openCreateProject} className="inline-flex items-center gap-2 bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer select-none">
                                                <FaPlus size={10} /> New Project
                                            </button>
                                        </div>

                                        {/* Project form */}
                                        <AnimatePresence>
                                            {isProjectFormOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden bg-white border border-[#955623]/15 rounded-3xl p-6 shadow-[0_12px_45px_rgba(149,86,35,0.08)] flex flex-col gap-5"
                                                >
                                                    <div className="flex items-center justify-between border-b border-[#955623]/10 pb-3">
                                                        <h2 className="font-heading text-xl text-[#955623]">
                                                            {editingProject ? "Edit Project" : "Create Project"}
                                                        </h2>
                                                        <button onClick={() => setIsProjectFormOpen(false)} className="text-xs font-semibold text-[#7a451b]/70 hover:text-[#955623] cursor-pointer">Cancel</button>
                                                    </div>
                                                    <form onSubmit={handleProjectSubmit} className="flex flex-col gap-4 text-left">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                                <label className={labelCls}>Title</label>
                                                                <input type="text" value={projectForm.title} onChange={(e) => setProjectForm(f => ({ ...f, title: e.target.value }))} placeholder="Project name..." className={inputCls} required />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <label className={labelCls}>Icon (emoji)</label>
                                                                <input type="text" value={projectForm.icon} onChange={(e) => setProjectForm(f => ({ ...f, icon: e.target.value }))} placeholder="✨" className={inputCls} />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <label className={labelCls}>Description</label>
                                                            <textarea rows={3} value={projectForm.description} onChange={(e) => setProjectForm(f => ({ ...f, description: e.target.value }))} placeholder="Short project description..." className={`${inputCls} resize-y`} required />
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex flex-col gap-1">
                                                                <label className={labelCls}>GitHub URL</label>
                                                                <input type="url" value={projectForm.codeUrl} onChange={(e) => setProjectForm(f => ({ ...f, codeUrl: e.target.value }))} placeholder="https://github.com/..." className={inputCls} />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <label className={labelCls}>Demo URL</label>
                                                                <input type="url" value={projectForm.demoUrl} onChange={(e) => setProjectForm(f => ({ ...f, demoUrl: e.target.value }))} placeholder="https://..." className={inputCls} />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                                <label className={labelCls}>Tags (comma-separated)</label>
                                                                <input type="text" value={projectForm.tags} onChange={(e) => setProjectForm(f => ({ ...f, tags: e.target.value }))} placeholder="React, TypeScript, AI" className={inputCls} />
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <label className={labelCls}>Status</label>
                                                                <select value={projectForm.status} onChange={(e) => setProjectForm(f => ({ ...f, status: e.target.value as Project["status"] }))} className={inputCls}>
                                                                    <option value="active">Active</option>
                                                                    <option value="wip">WIP</option>
                                                                    <option value="archived">Archived</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <label className="flex items-center gap-3 cursor-pointer select-none">
                                                            <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-[#955623]" />
                                                            <span className="text-sm font-semibold text-[#7a451b]">Mark as Featured</span>
                                                        </label>
                                                        <button type="submit" className="mt-1 w-full md:w-auto self-end bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] font-bold py-3 px-8 rounded-xl cursor-pointer transition-colors shadow-sm inline-flex items-center justify-center gap-2 select-none">
                                                            <FaSave size={14} /> {editingProject ? "Update" : "Create"}
                                                        </button>
                                                    </form>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Project list */}
                                        {projectsLoading ? (
                                            <div className="text-center py-12 font-heading text-xl text-[#955623]">Loading...</div>
                                        ) : projects.length === 0 ? (
                                            <div className="text-center py-16 border border-dashed border-[#955623]/30 rounded-3xl">
                                                <p className="text-[#7a451b]">No projects yet.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                {projects.map((project) => (
                                                    <div key={project.id} className="bg-white border border-[#955623]/12 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">{project.icon}</span>
                                                            <div className="flex flex-col gap-0.5">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-heading text-lg text-[#955623]">{project.title}</h3>
                                                                    {project.featured && <span className="text-[10px] font-bold px-2 py-0.5 bg-[#955623]/10 text-[#955623] rounded-full border border-[#955623]/15">Featured</span>}
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#955623]/8 text-[#7a451b] rounded-full capitalize">{project.status}</span>
                                                                </div>
                                                                <p className="text-xs text-[#7a451b]/80 line-clamp-1 max-w-xl">{project.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 self-end md:self-auto">
                                                            <button onClick={() => openEditProject(project)} className="p-2.5 text-[#955623] hover:bg-[#955623]/8 border border-[#955623]/15 rounded-xl cursor-pointer transition-colors" title="Edit">
                                                                <FaEdit size={13} />
                                                            </button>
                                                            <button onClick={() => handleDeleteProject(project.id)} className="p-2.5 text-[#ea4335] hover:bg-[#ea4335]/8 border border-[#ea4335]/15 rounded-xl cursor-pointer transition-colors" title="Delete">
                                                                <FaTrash size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}