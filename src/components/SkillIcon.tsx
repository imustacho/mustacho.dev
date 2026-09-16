import type { IconType } from "react-icons";
import {
    SiTypescript,
    SiJavascript,
    SiHtml5,
    SiNextdotjs,
    SiReact,
    SiFramer,
    SiTailwindcss,
    SiNodedotjs,
    SiPostman,
    SiDiscord,
    SiHuggingface,
    SiGit,
    SiVercel,
    SiRust,
    SiTauri,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaBrain, FaWandMagicSparkles, FaRobot } from "react-icons/fa6";
import { LuBrainCircuit, LuSparkles, LuBot } from "react-icons/lu";
import { TbApi } from "react-icons/tb";

export const skillIconMap: Record<string, IconType> = {
    SiTypescript,
    SiJavascript,
    SiHtml5,
    SiRust,
    SiNextdotjs,
    SiReact,
    SiTauri,
    SiFramer,
    SiTailwindcss,
    SiNodedotjs,
    SiPostman,
    TbApi,
    SiDiscord,
    SiHuggingface,
    FaBrain,
    FaWandMagicSparkles,
    FaRobot,
    LuBrainCircuit,
    LuSparkles,
    LuBot,
    SiGit,
    SiVercel,
    VscVscode,
    SiVscodium: VscVscode,
};

export default function SkillIcon({
    name,
    size = 16,
    className = "",
}: {
    name: string;
    size?: number;
    className?: string;
}) {
    const Icon = skillIconMap[name];
    if (!Icon) return null;
    return <Icon size={size} className={className} />;
}

