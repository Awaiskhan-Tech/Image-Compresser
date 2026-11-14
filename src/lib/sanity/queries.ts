export const POSTS_QUERY = `*[
  _type == "post" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  dateTime(publishedAt) <= dateTime(now()) &&
  ($category == "all" || category == $category)
] | order(featured desc, publishedAt desc) [$offset...$limit] {
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  category,
  tags,
  publishedAt,
  featured,
  authorName,
  authorImage { _type, asset, alt },
  coverImage { _type, asset, alt, caption },
  seoTitle,
  seoDescription,
  canonicalUrl,
  openGraphImage { _type, asset, alt }
}`;

export const POST_COUNT_QUERY = `count(*[
  _type == "post" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  dateTime(publishedAt) <= dateTime(now()) &&
  ($category == "all" || category == $category)
])`;

export const CATEGORIES_QUERY = `array::unique(*[
  _type == "post" &&
  defined(category) &&
  defined(publishedAt) &&
  dateTime(publishedAt) <= dateTime(now())
].category)`;

export const POST_BY_SLUG_QUERY = `*[
  _type == "post" &&
  slug.current == $slug &&
  defined(publishedAt) &&
  dateTime(publishedAt) <= dateTime(now())
][0] {
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  excerpt,
  category,
  tags,
  publishedAt,
  featured,
  authorName,
  authorImage { _type, asset, alt },
  coverImage { _type, asset, alt, caption },
  seoTitle,
  seoDescription,
  canonicalUrl,
  openGraphImage { _type, asset, alt },
  body[] {
    ...,
    _type == "articleImage" => { _type, _key, asset, alt, caption },
    _type == "codeBlock" => { _type, _key, language, filename, code }
  },
  "relatedPosts": *[
    _type == "post" &&
    category == ^.category &&
    _id != ^._id &&
    defined(slug.current) &&
    defined(publishedAt) &&
    dateTime(publishedAt) <= dateTime(now())
  ] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    publishedAt,
    authorName,
    coverImage { _type, asset, alt }
  }
}`;
