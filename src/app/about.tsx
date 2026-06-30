"use client";

import { motion } from "motion/react";
import { FaHeart, FaCode, FaRocket } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";

interface AboutProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function About({ isOpen, onClose }: AboutProps) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 110, damping: 17 }}
            className="fixed inset-0 z-40 bg-[#f5efe6] flex flex-col items-center justify-center px-6 py-20 overflow-y-auto"
            style={{
                backgroundImage: `
                  radial-gradient(circle, rgba(149,86,35,0.14) 1.6px, transparent 1.6px),
                  radial-gradient(circle, rgba(149,86,35,0.14) 1.6px, transparent 1.6px)
                `,
                backgroundSize: "35px 35px",
                backgroundPosition: "0 0, 13.5px 13.5px",
            }}
        >
            {/* Close Button */}
            <motion.button
                onClick={onClose}
                className="absolute top-24 right-8 md:right-16 text-4xl text-[#955623] hover:text-[#7a451b] cursor-pointer bg-transparent border-none outline-none"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
                <IoCloseCircle />
            </motion.button>

            {/* Content Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#f5efe6] border-4 border-[#955623]/25 p-8 md:p-12 rounded-[2.5rem] max-w-2xl w-full text-center shadow-[0_24px_60px_rgba(149,86,35,0.18)] flex flex-col items-center gap-6"
            >
                <motion.div
                    className="w-24 h-24 rounded-full bg-[#955623]/15 border-2 border-[#955623] flex items-center justify-center overflow-hidden"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                    <img 
                        src="/mustacho_wave.png" 
                        alt="Mustacho" 
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Title */}
                <h2 className="font-heading text-4xl md:text-5xl text-[#955623] tracking-tight">
                    Merhaba, Ben Mustacho!
                </h2>

                {/* Subtitle */}
                <p className="font-medium text-lg text-[#7a451b] max-w-lg">
                    Fikirleri gerçeğe dönüştüren, kodlamayı ve eğlenceli animasyonları seven bir geliştiriciyim.
                </p>

                {/* Divider Line */}
                <div className="w-16 h-1 bg-[#955623]/20 rounded-full" />

                {/* Details list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-2">
                    <div className="flex flex-col items-center text-center p-4 bg-[#955623]/5 rounded-2xl border border-[#955623]/10">
                        <FaCode className="text-2xl text-[#955623] mb-2" />
                        <h3 className="font-heading text-lg text-[#955623] mb-1">Temiz Kod</h3>
                        <p className="text-sm text-[#7a451b]">Okunabilir, sürdürülebilir ve performanslı geliştirme yapıyorum.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 bg-[#955623]/5 rounded-2xl border border-[#955623]/10">
                        <FaHeart className="text-2xl text-[#955623] mb-2" />
                        <h3 className="font-heading text-lg text-[#955623] mb-1">Kullanıcı Deneyimi</h3>
                        <p className="text-sm text-[#7a451b]">Kullanıcıyı yormayan, akıcı ve keyifli arayüzler tasarlıyorum.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 bg-[#955623]/5 rounded-2xl border border-[#955623]/10">
                        <FaRocket className="text-2xl text-[#955623] mb-2" />
                        <h3 className="font-heading text-lg text-[#955623] mb-1">Hızlı Çözümler</h3>
                        <p className="text-sm text-[#7a451b]">Modern kütüphaneler kullanarak projeleri hızla ayağa kaldırıyorum.</p>
                    </div>
                </div>

                <p className="text-sm text-[#7a451b]/70 italic mt-4">
                    "Çekiştirilmeyi bekleyen bir bıyık, her zaman iyi bir fikirdir."
                </p>
            </motion.div>
        </motion.div>
    );
}
