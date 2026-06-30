"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { FaPlus, FaTrash, FaEdit, FaLock, FaArrowLeft, FaSave, FaEye } from "react-icons/fa";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
}

export default function AdminPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passcode, setPasscode] = useState("");
    const [passcodeError, setPasscodeError] = useState("");

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Form states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formTitle, setFormTitle] = useState("");
    const [formExcerpt, setFormExcerpt] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formCategory, setFormCategory] = useState("General");
    const [formReadTime, setFormReadTime] = useState("3 min read");
    const [formDate, setFormDate] = useState("");

    // Lock screen check on load
    useEffect(() => {
        const adminAuth = sessionStorage.getItem("adminAuth");
        if (adminAuth === "true") {
            setIsUnlocked(true);
        }
    }, []);

    // Load blogs when unlocked
    useEffect(() => {
        if (!isUnlocked) return;
        fetchBlogs();
    }, [isUnlocked]);

    const fetchBlogs = () => {
        setLoading(true);
        fetch("/api/blogs")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                showNotification("Failed to load blog posts.", "error");
            });
    };

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (passcode.toLowerCase() === "mustacho") {
            setIsUnlocked(true);
            setPasscodeError("");
            sessionStorage.setItem("adminAuth", "true");
        } else {
            setPasscodeError("Incorrect passcode. Try again!");
        }
    };

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 4000);
    };

    const openCreateForm = () => {
        setEditingPost(null);
        setFormTitle("");
        setFormExcerpt("");
        setFormContent("");
        setFormCategory("General");
        setFormReadTime("3 min read");
        setFormDate(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
        setIsFormOpen(true);
    };

    const openEditForm = (post: BlogPost) => {
        setEditingPost(post);
        setFormTitle(post.title);
        setFormExcerpt(post.excerpt);
        setFormContent(post.content);
        setFormCategory(post.category);
        setFormReadTime(post.readTime);
        setFormDate(post.date);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return;

        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error();
            showNotification("Blog post deleted successfully!", "success");
            fetchBlogs();
        } catch (error) {
            showNotification("Failed to delete blog post.", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle || !formContent) {
            showNotification("Title and content are required fields.", "error");
            return;
        }

        const postData = {
            title: formTitle,
            excerpt: formExcerpt || formContent.slice(0, 120) + "...",
            content: formContent,
            category: formCategory,
            readTime: formReadTime,
            date: formDate
        };

        try {
            if (editingPost) {
                // Update (PUT)
                const res = await fetch(`/api/blogs/${editingPost.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postData),
                });
                if (!res.ok) throw new Error();
                showNotification("Blog post updated successfully!", "success");
            } else {
                // Create (POST)
                const res = await fetch("/api/blogs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postData),
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to create post.");
                }
                showNotification("Blog post created successfully!", "success");
            }
            setIsFormOpen(false);
            fetchBlogs();
        } catch (error: any) {
            showNotification(error.message || "Failed to save blog post.", "error");
        }
    };

    const handleLogout = () => {
        setIsUnlocked(false);
        setPasscode("");
        sessionStorage.removeItem("adminAuth");
    };

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
                            className={`fixed top-28 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-full text-white font-medium text-sm shadow-lg flex items-center gap-2 ${notification.type === "success" ? "bg-[#34a853]" : "bg-[#ea4335]"
                                }`}
                        >
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Password Screen */}
                <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                        <motion.div
                            key="lock-screen"
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
                                <p className="text-sm text-[#7a451b] mt-2">Enter passcode to manage blog database.</p>
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
                                {passcodeError && (
                                    <p className="text-xs font-semibold text-[#ea4335]">{passcodeError}</p>
                                )}
                                <p className="text-[10px] text-[#7a451b]/40 italic font-mono">Hint: mustacho</p>

                                <button
                                    type="submit"
                                    className="w-full bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] font-bold py-3.5 px-6 rounded-2xl cursor-pointer transition-colors shadow-md hover:shadow-lg active:scale-98"
                                >
                                    Access Panel
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        /* Main Dashboard Screen */
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col gap-8 w-full"
                        >
                            {/* Dashboard Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#955623]/15 pb-6">
                                <div>
                                    <h1 className="font-heading text-4xl text-[#955623] tracking-tight">Mustacho Blogs Admin</h1>
                                    <p className="text-sm text-[#7a451b] mt-1">Add, update, or remove blog posts directly.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/blogs"
                                        className="inline-flex items-center gap-2 text-xs font-bold text-[#955623] bg-[#955623]/8 border border-[#955623]/15 px-4 py-2.5 rounded-full hover:bg-[#955623]/15 transition-all select-none"
                                    >
                                        <FaEye size={12} /> View Page
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="inline-flex items-center gap-2 text-xs font-bold bg-[#ea4335]/8 text-[#ea4335] border border-[#ea4335]/15 px-4 py-2.5 rounded-full hover:bg-[#ea4335]/15 transition-all cursor-pointer select-none"
                                    >
                                        Lock Dashboard
                                    </button>
                                </div>
                            </div>

                            {/* Control Bar */}
                            <div className="flex justify-between items-center bg-[#955623]/5 p-4 rounded-2xl border border-[#955623]/10">
                                <span className="text-sm font-semibold text-[#7a451b]">
                                    Total Posts: <strong className="text-[#955623] font-mono text-base">{posts.length}</strong>
                                </span>
                                <button
                                    onClick={openCreateForm}
                                    className="inline-flex items-center gap-2 bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] px-4 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer select-none"
                                >
                                    <FaPlus size={10} /> Create New Post
                                </button>
                            </div>

                            {/* Dynamic Form Drawer (Create/Edit) */}
                            <AnimatePresence>
                                {isFormOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden bg-[#ffffff] border border-[#955623]/15 rounded-3xl p-6 shadow-[0_12px_45px_rgba(149,86,35,0.08)] flex flex-col gap-6"
                                    >
                                        <div className="flex items-center justify-between border-b border-[#955623]/10 pb-3">
                                            <h2 className="font-heading text-xl text-[#955623]">
                                                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
                                            </h2>
                                            <button
                                                onClick={() => setIsFormOpen(false)}
                                                className="text-xs font-semibold text-[#7a451b]/70 hover:text-[#955623] cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Title */}
                                                <div className="flex flex-col gap-1 md:col-span-2">
                                                    <label className="text-xs font-bold uppercase text-[#955623]/80">Title</label>
                                                    <input
                                                        type="text"
                                                        value={formTitle}
                                                        onChange={(e) => setFormTitle(e.target.value)}
                                                        placeholder="Enter blog title..."
                                                        className="px-4 py-2.5 rounded-xl border border-[#955623]/20 bg-[#955623]/2 text-sm text-[#7a451b] focus:outline-none focus:border-[#955623]"
                                                        required
                                                    />
                                                </div>

                                                {/* Category */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold uppercase text-[#955623]/80">Category</label>
                                                    <select
                                                        value={formCategory}
                                                        onChange={(e) => setFormCategory(e.target.value)}
                                                        className="px-4 py-2.5 rounded-xl border border-[#955623]/20 bg-[#955623]/2 text-sm text-[#7a451b] focus:outline-none focus:border-[#955623]"
                                                    >
                                                        <option value="Web Dev">Web Dev</option>
                                                        <option value="Animation">Animation</option>
                                                        <option value="Tech">Tech</option>
                                                        <option value="Life">Life</option>
                                                        <option value="General">General</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Read Time */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold uppercase text-[#955623]/80">Read Time</label>
                                                    <input
                                                        type="text"
                                                        value={formReadTime}
                                                        onChange={(e) => setFormReadTime(e.target.value)}
                                                        placeholder="e.g. 5 min read"
                                                        className="px-4 py-2.5 rounded-xl border border-[#955623]/20 bg-[#955623]/2 text-sm text-[#7a451b] focus:outline-none focus:border-[#955623]"
                                                    />
                                                </div>

                                                {/* Date */}
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-bold uppercase text-[#955623]/80">Date</label>
                                                    <input
                                                        type="text"
                                                        value={formDate}
                                                        onChange={(e) => setFormDate(e.target.value)}
                                                        placeholder="e.g. June 30, 2026"
                                                        className="px-4 py-2.5 rounded-xl border border-[#955623]/20 bg-[#955623]/2 text-sm text-[#7a451b] focus:outline-none focus:border-[#955623]"
                                                    />
                                                </div>
                                            </div>

                                            {/* Excerpt */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-bold uppercase text-[#955623]/80">Excerpt / Short Summary</label>
                                                <input
                                                    type="text"
                                                    value={formExcerpt}
                                                    onChange={(e) => setFormExcerpt(e.target.value)}
                                                    placeholder="Short one-sentence summary shown on list page..."
                                                    className="px-4 py-2.5 rounded-xl border border-[#955623]/20 bg-[#955623]/2 text-sm text-[#7a451b] focus:outline-none focus:border-[#955623]"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-bold uppercase text-[#955623]/80">Content Body</label>
                                                <textarea
                                                    rows={8}
                                                    value={formContent}
                                                    onChange={(e) => setFormContent(e.target.value)}
                                                    placeholder="Write blog content here... Use double Enter for new paragraphs. Start sub-headings with ###."
                                                    className="px-4 py-3 rounded-xl border border-[#955623]/20 bg-[#955623]/2 text-sm text-[#7a451b] focus:outline-none focus:border-[#955623] font-mono leading-relaxed resize-y"
                                                    required
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="mt-2 w-full md:w-auto self-end bg-[#955623] hover:bg-[#7a451b] text-[#f5efe6] font-bold py-3 px-8 rounded-xl cursor-pointer transition-colors shadow-sm inline-flex items-center justify-center gap-2 select-none"
                                            >
                                                <FaSave size={14} /> {editingPost ? "Update Post" : "Publish Post"}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Posts Table */}
                            {loading ? (
                                <div className="text-center py-20 font-heading text-xl text-[#955623]">
                                    Fetching blog database...
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-[#955623]/30 rounded-3xl bg-[#955623]/3">
                                    <p className="text-lg text-[#7a451b] font-medium">No blog posts found.</p>
                                    <button
                                        onClick={openCreateForm}
                                        className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#955623] underline"
                                    >
                                        Write your first post!
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="bg-[#ffffff] border border-[#955623]/12 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-[0_8px_30px_rgba(149,86,35,0.06)] transition-all duration-300"
                                        >
                                            <div className="flex flex-col gap-1.5 text-left">
                                                <div className="flex items-center gap-3 text-xs font-semibold">
                                                    <span className="px-2.5 py-0.5 bg-[#955623]/8 border border-[#955623]/12 rounded-full text-[#955623]">
                                                        {post.category}
                                                    </span>
                                                    <span className="text-[#7a451b]/60 font-mono">{post.date}</span>
                                                </div>
                                                <h3 className="font-heading text-xl text-[#955623] leading-tight">
                                                    {post.title}
                                                </h3>
                                                <p className="text-xs text-[#7a451b]/80 line-clamp-1 max-w-xl">
                                                    {post.excerpt}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 self-end md:self-auto">
                                                <button
                                                    onClick={() => openEditForm(post)}
                                                    className="p-3 text-xs font-bold text-[#955623] hover:bg-[#955623]/8 border border-[#955623]/15 rounded-xl cursor-pointer transition-colors"
                                                    title="Edit Post"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-3 text-xs font-bold text-[#ea4335] hover:bg-[#ea4335]/8 border border-[#ea4335]/15 rounded-xl cursor-pointer transition-colors"
                                                    title="Delete Post"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
