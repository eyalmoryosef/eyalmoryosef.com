import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { parseContentId } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", (entry) => {
    const { locale } = parseContentId(entry.id);
    return locale === "en" && !entry.data.draft;
  });

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!.toString(),
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/en/blog/${parseContentId(post.id).slug}/`,
      })),
  });
}
