export type Locale = "en" | "he";
export type BlogCategory = "tech" | "sport" | "human-nature";
export type ProjectCategory = "ai" | "trading" | "edtech" | "academic";
export type ProjectStatus = "active" | "in-progress" | "shipped" | "ongoing";
export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: "github" | "linkedin" | "email" | "twitter";
  url: string;
  label: string;
}
