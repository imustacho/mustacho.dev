import skillsData from "@/data/skills.json";
import { getProjects, type Project } from "./projects";

export interface Skill {
    name: string;
    icon: string;
    projects?: string[];
}

export interface SkillCategory {
    category: string;
    icon: string;
    skills: Skill[];
}

export function getSkillCategories(): SkillCategory[] {
    return skillsData as SkillCategory[];
}

export function getAllSkills(): Skill[] {
    return getSkillCategories().flatMap((cat) => cat.skills);
}

export function getSkillByName(name: string): Skill | undefined {
    const normalized = name.toLowerCase().trim();
    return getAllSkills().find((s) => s.name.toLowerCase().trim() === normalized);
}

export function getProjectsForSkill(skillName: string): Project[] {
    const skill = getSkillByName(skillName);
    const projects = getProjects();
    const normalizedName = skillName.toLowerCase().trim();

    return projects.filter((project) => {
        const matchesProjectList = skill?.projects?.includes(project.id);
        const matchesSkillInProject = project.skills?.some(
            (s) => s.toLowerCase().trim() === normalizedName
        );
        return matchesProjectList || matchesSkillInProject;
    });
}

export function getSkillsForProject(project: Project): Skill[] {
    const allSkills = getAllSkills();
    const projectSkillNames = (project.skills || []).map((s) => s.toLowerCase().trim());

    return allSkills.filter((skill) => {
        const hasProjectInSkill = skill.projects?.includes(project.id);
        const hasSkillInProject = projectSkillNames.includes(skill.name.toLowerCase().trim());
        return hasProjectInSkill || hasSkillInProject;
    });
}

