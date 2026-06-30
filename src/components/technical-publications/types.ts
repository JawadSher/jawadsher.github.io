export type MediumArticle = {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  description: string;
  categories: string[];
  thumbnail: string;
};

export type RSSItem = {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  description?: string;
  content?: string;
  categories?: string[];
  thumbnail?: string;
};
