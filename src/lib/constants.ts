export const SITE = {
  name: "Eyal MorYosef",
  url: "https://eyalmoryosef.com",
  description: "Builder, Trader, Writer",
  email: "eyaloosh110@gmail.com",
  formspreeId: "REPLACE_WITH_FORMSPREE_ID",
  analytics: {
    provider: "plausible" as const,
    siteId: "eyalmoryosef.com",
  },
};

export const SOCIAL_LINKS = [
  { platform: "github", url: "https://github.com/eyalmoryosef", label: "GitHub" },
  { platform: "linkedin", url: "https://linkedin.com/in/eyalmoryosef", label: "LinkedIn" },
  { platform: "email", url: "mailto:eyaloosh110@gmail.com", label: "Email" },
] as const;

export const SKILLS = [
  "Python", "TypeScript", "Astro", "Tailwind CSS",
  "Obsidian", "Claude / AI", "Git", "Data Analysis",
  "Algorithmic Trading", "System Architecture",
] as const;
