export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Eyal MorYosef",
    url: "https://eyalmoryosef.com",
    description: "Builder, Trader, Writer",
    inLanguage: ["en", "he"],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Eyal MorYosef",
    url: "https://eyalmoryosef.com",
    jobTitle: "AI Developer & Algorithmic Trader",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Open University of Israel",
    },
    sameAs: [
      "https://github.com/eyalmoryosef",
      "https://linkedin.com/in/eyalmoryosef",
    ],
  };
}

export function blogPostJsonLd(post: {
  title: string;
  description: string;
  date: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: post.url,
    image: post.image,
    author: {
      "@type": "Person",
      name: "Eyal MorYosef",
      url: "https://eyalmoryosef.com",
    },
  };
}
