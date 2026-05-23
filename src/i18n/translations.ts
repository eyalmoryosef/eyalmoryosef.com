export const translations = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.projects": "Projects",
    "nav.blog": "Blog",
    "nav.now": "Now",
    "nav.about": "About",

    // Home
    "home.hero.eyebrow": "Student · Trader · Builder",
    "home.hero.headline": "I trade algorithmically, build digital tools, and write about what I learn.",
    "home.hero.subdescription": "CS & Physics student, algorithmic trader, handcycle rider, and digital tool builder.",
    "home.hero.tagline": "Work hard. Build smart.",
    "home.hero.cta": "See Projects",
    "home.hero.aboutCta": "About Me",
    "site.tagline": "Builder, Trader, Writer",
    "home.pageDescription": "Eyal MorYosef — Builder, Trader, Writer. Building AI systems, trading algorithms, and writing about what I learn.",
    "home.now.strip": "Algorithmic Trading, SmartPhysio, Handcycle Riding",
    "home.featured.title": "Featured Projects",
    "home.latest.title": "Latest from the Blog",
    "home.now.prefix": "Currently working on:",
    "home.now.link": "See what I'm up to",

    // Projects
    "projects.title": "Projects",
    "projects.subtitle": "Things I'm building.",

    // Blog
    "blog.title": "Blog",
    "blog.subtitle": "Sport. Tech. Human Nature.",
    "blog.all": "All",
    "blog.readMore": "Read more",
    "blog.minRead": "min read",
    "blog.relatedPosts": "Related Posts",

    // Now
    "now.title": "Now",
    "now.lastUpdated": "Last updated",
    "now.building": "Currently Building",
    "now.studying": "Currently Studying",
    "now.reading": "Currently Reading",
    "now.thinking": "Currently Thinking About",

    // About
    "about.title": "About",
    "about.skills": "Skills & Tech Stack",
    "about.contact": "Get in Touch",
    "about.contactDescription": "Have a question or want to collaborate? Reach out.",
    "about.form.name": "Name",
    "about.form.email": "Email",
    "about.form.message": "Message",
    "about.form.send": "Send Message",
    "about.form.success": "Message sent! I'll get back to you soon.",
    "about.form.error": "Something went wrong. Please try email instead.",

    // Footer
    "footer.credit": "Built with Astro + Tailwind. Hosted on Vercel.",

    // Categories
    "category.tech": "Tech",
    "category.sport": "Sport",
    "category.human-nature": "Human Nature",

    // Status
    "status.active": "Active",
    "status.in-progress": "In Progress",
    "status.shipped": "Shipped",
    "status.ongoing": "Ongoing",

    // Share
    "share.twitter": "Share on X",
    "share.linkedin": "Share on LinkedIn",
    "share.copy": "Copy link",
    "share.copied": "Copied!",
  },

  he: {
    "nav.home": "בית",
    "nav.projects": "פרויקטים",
    "nav.blog": "בלוג",
    "nav.now": "עכשיו",
    "nav.about": "אודות",

    "home.hero.eyebrow": "סטודנט · סוחר · בונה",
    "home.hero.headline": "אני סוחר אלגוריתמית, בונה כלים דיגיטליים, וכותב על מה שאני לומד.",
    "home.hero.subdescription": "סטודנט למדמ\"ח ופיזיקה, סוחר אלגוריתמי, רוכב אופני ידיים, ובונה כלים דיגיטליים.",
    "home.hero.tagline": "עובד קשה. בונה חכם.",
    "home.hero.cta": "לפרויקטים",
    "home.hero.aboutCta": "אודותיי",
    "site.tagline": "בונה, סוחר, כותב",
    "home.pageDescription": "אייל מוריוסף — בונה, סוחר, כותב. בונה מערכות AI, אלגוריתמי מסחר, וכותב על מה שאני לומד.",
    "home.now.strip": "מסחר אלגוריתמי, SmartPhysio, רכיבת אופני יד",
    "home.featured.title": "פרויקטים מובילים",
    "home.latest.title": "אחרון בבלוג",
    "home.now.prefix": "עובד עכשיו על:",
    "home.now.link": "מה אני עושה עכשיו",

    "projects.title": "פרויקטים",
    "projects.subtitle": "דברים שאני בונה.",

    "blog.title": "בלוג",
    "blog.subtitle": "ספורט. טכנולוגיה. טבע אנושי.",
    "blog.all": "הכל",
    "blog.readMore": "קרא עוד",
    "blog.minRead": "דקות קריאה",
    "blog.relatedPosts": "פוסטים קשורים",

    "now.title": "עכשיו",
    "now.lastUpdated": "עודכן לאחרונה",
    "now.building": "בונה כרגע",
    "now.studying": "לומד כרגע",
    "now.reading": "קורא כרגע",
    "now.thinking": "חושב על",

    "about.title": "אודות",
    "about.skills": "כישורים וטכנולוגיות",
    "about.contact": "צרו קשר",
    "about.contactDescription": "שאלה או הצעת שיתוף פעולה? כתבו לי.",
    "about.form.name": "שם",
    "about.form.email": "אימייל",
    "about.form.message": "הודעה",
    "about.form.send": "שלח הודעה",
    "about.form.success": "ההודעה נשלחה! אחזור אליך בקרוב.",
    "about.form.error": "משהו השתבש. נסו לשלוח מייל במקום.",

    "footer.credit": "נבנה עם Astro + Tailwind. מאוחסן ב-Vercel.",

    "category.tech": "טכנולוגיה",
    "category.sport": "ספורט",
    "category.human-nature": "טבע אנושי",

    "status.active": "פעיל",
    "status.in-progress": "בפיתוח",
    "status.shipped": "הושק",
    "status.ongoing": "מתמשך",

    "share.twitter": "שתף ב-X",
    "share.linkedin": "שתף ב-LinkedIn",
    "share.copy": "העתק קישור",
    "share.copied": "הועתק!",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
