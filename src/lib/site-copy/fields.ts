/** Editable site copy — labels describe where text appears on the live site */
export interface SiteCopyField {
  key: string;
  label: string;
  hint?: string;
  multiline?: boolean;
}

export interface SiteCopySection {
  id: string;
  title: string;
  fields: SiteCopyField[];
}

export const SITE_COPY_SECTIONS: SiteCopySection[] = [
  {
    id: "hero",
    title: "דף הבית — אזור השם (Hero)",
    fields: [
      {
        key: "home.hero.eyebrow",
        label: "תיבה מעל השם",
        hint: 'למשל: "סטודנט · סוחר · בונה" / "Student · Trader · Builder"',
      },
      {
        key: "home.hero.headline",
        label: "משפט ראשי מתחת לשם",
        multiline: true,
      },
      {
        key: "home.hero.subdescription",
        label: "תיאור משני (פסקה)",
        multiline: true,
      },
      {
        key: "home.hero.tagline",
        label: "סלוגן מודגש בסוף",
        hint: 'למשל: "עובד קשה. בונה חכם."',
      },
      { key: "home.hero.cta", label: "כפתור ראשי" },
      { key: "home.hero.aboutCta", label: "כפתור אודות" },
    ],
  },
  {
    id: "site",
    title: "תיאור כללי של האתר",
    fields: [
      {
        key: "site.tagline",
        label: "תגית קצרה (Builder, Trader, Writer)",
        hint: "מופיע ב-SEO, RSS ומטא-תיאורים",
      },
      {
        key: "home.pageDescription",
        label: "תיאור דף הבית (מטא)",
        multiline: true,
      },
      {
        key: "home.now.strip",
        label: "פס ״עובד עכשיו על״ בדף הבית",
      },
    ],
  },
  {
    id: "home-sections",
    title: "כותרות סקשנים — דף הבית",
    fields: [
      { key: "home.featured.title", label: "כותרת פרויקטים מובילים" },
      { key: "home.latest.title", label: "כותרת אחרון בבלוג" },
      { key: "home.now.prefix", label: "תווית לפני פס העבודה" },
      { key: "home.now.link", label: "קישור לדף Now" },
    ],
  },
  {
    id: "blog",
    title: "דף בלוג",
    fields: [
      { key: "blog.title", label: "כותרת עמוד" },
      { key: "blog.subtitle", label: "תת-כותרת / תיאור", multiline: true },
    ],
  },
  {
    id: "projects",
    title: "דף פרויקטים",
    fields: [
      { key: "projects.title", label: "כותרת עמוד" },
      { key: "projects.subtitle", label: "תת-כותרת / תיאור", multiline: true },
    ],
  },
  {
    id: "nav",
    title: "תפריט ניווט",
    fields: [
      { key: "nav.home", label: "בית" },
      { key: "nav.projects", label: "פרויקטים" },
      { key: "nav.blog", label: "בלוג" },
      { key: "nav.now", label: "עכשיו" },
      { key: "nav.about", label: "אודות" },
    ],
  },
];

export const ALL_SITE_COPY_KEYS = SITE_COPY_SECTIONS.flatMap((s) => s.fields.map((f) => f.key));
