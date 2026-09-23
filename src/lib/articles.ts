import { ARTICLES_PART_1, type Article } from "./articles-1";
import { ARTICLES_PART_2 } from "./articles-2";

export type { Article, ArticleSection } from "./articles-1";

export const ARTICLES: Article[] = [...ARTICLES_PART_1, ...ARTICLES_PART_2];

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}

export const RESOURCE_CATEGORIES = [
  "All",
  ...Array.from(new Set(ARTICLES.map((article) => article.category))),
] as const;
