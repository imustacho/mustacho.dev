"use client";

import { motion } from "motion/react";
import { FaHeart, FaCode, FaRocket } from "react-icons/fa";

export default function AboutPage() {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ color: "#955623" }}>
            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen">
                {/* Content Card */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="bg-[#f5efe6] border-4 border-[#955623]/25 p-8 md:p-12 rounded-[2.5rem] w-full text-center shadow-[0_24px_60px_rgba(149,86,35,0.18)] flex flex-col items-center gap-6"
                >
                    {/* Avatar Icon */}
                    <motion.div 
                        className="w-24 h-24 rounded-full bg-[#955623]/15 border-2 border-[#955623] flex items-center justify-center overflow-hidden"
                        animate={{ rotate: [0, -4, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    >
                        <img 
                            src="/mustacho_wave.png" 
                            alt="Mustacho" 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Title */}
                    <h2 className="font-heading text-4xl md:text-5xl text-[#955623] tracking-tight">
                        Hello, I'm Mustacho!
                    </h2>

                    {/* Subtitle */}
                    <p className="font-medium text-lg text-[#7a451b] max-w-xl">
                        I'm a developer who loves turning ideas into reality, coding, and playful animations.
                    </p>

                    {/* Divider Line */}
                    <div className="w-16 h-1 bg-[#955623]/20 rounded-full" />

                    {/* Details list */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-2">
                        <div className="flex flex-col items-center text-center p-5 bg-[#955623]/5 rounded-3xl border border-[#955623]/10 hover:bg-[#955623]/10 transition-colors duration-200">
                            <FaCode className="text-2xl text-[#955623] mb-2" />
                            <h3 className="font-heading text-lg text-[#955623] mb-1">Clean Code</h3>
                            <p className="text-sm text-[#7a451b]">I write readable, maintainable, and highly performant code.</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-5 bg-[#955623]/5 rounded-3xl border border-[#955623]/10 hover:bg-[#955623]/10 transition-colors duration-200">
                            <FaHeart className="text-2xl text-[#955623] mb-2" />
                            <h3 className="font-heading text-lg text-[#955623] mb-1">User Experience</h3>
                            <p className="text-sm text-[#7a451b]">I design smooth, intuitive, and delightful interfaces.</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-5 bg-[#955623]/5 rounded-3xl border border-[#955623]/10 hover:bg-[#955623]/10 transition-colors duration-200">
                            <FaRocket className="text-2xl text-[#955623] mb-2" />
                            <h3 className="font-heading text-lg text-[#955623] mb-1">Fast Solutions</h3>
                            <p className="text-sm text-[#7a451b]">I spin up projects quickly utilizing modern frontend libraries.</p>
                        </div>
                    </div>

                    <p className="text-sm text-[#7a451b]/70 italic mt-4">
                        "A mustache waiting to be dragged is always a good idea."
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
