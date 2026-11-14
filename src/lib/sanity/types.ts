export interface SanityImage {
  _type: 'image';
  asset?: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export interface PortableTextBlock {
  _key: string;
  _type: string;
  [key: string]: unknown;
}

export interface BlogPost {
  _id: string;
  _updatedAt: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  featured?: boolean;
  authorName: string;
  authorImage?: SanityImage;
  coverImage: SanityImage;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  openGraphImage?: SanityImage;
  body?: PortableTextBlock[];
  relatedPosts?: BlogPost[];
}
