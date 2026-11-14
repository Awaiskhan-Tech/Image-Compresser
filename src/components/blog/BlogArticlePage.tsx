import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { Link, useParams } from 'react-router-dom';
import { absoluteSiteUrl, formatPublicationDate, getPostCanonicalUrl } from './blogUtils';
import { usePageMetadata } from './usePageMetadata';
import { getSanityImageUrl } from '../../lib/sanity/images';
import { sanityClient } from '../../lib/sanity/client';
import { POST_BY_SLUG_QUERY } from '../../lib/sanity/queries';
import type { BlogPost, PortableTextBlock } from '../../lib/sanity/types';

function ArticleBodyImage({ value }: { value: Record<string, unknown> }) {
  const image = value as unknown as BlogPost['coverImage'];
  const imageUrl = getSanityImageUrl(image, { width: 1120, fit: 'max' });
  if (!imageUrl) return null;

  return (
    <figure className="my-10">
      <img
        src={imageUrl}
        alt={image.alt || ''}
        loading="lazy"
        className="h-auto max-h-[680px] w-full rounded-2xl bg-[#1C1F21] object-contain"
      />
      {image.caption && (
        <figcaption className="mt-3 text-center text-xs leading-5 text-[#E8DFC9]/50">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

const portableTextComponents: PortableTextComponents = {
  types: {
    articleImage: ({ value }) => (
      <ArticleBodyImage value={value as unknown as Record<string, unknown>} />
    ),
    codeBlock: ({ value }) => {
      const codeBlock = value as unknown as {
        code?: string;
        filename?: string;
        language?: string;
      };
      return (
        <figure className="my-8 overflow-hidden rounded-xl border border-[#E8DFC9]/10 bg-[#1C1F21]">
          {codeBlock.filename && (
            <figcaption className="border-b border-[#E8DFC9]/10 px-4 py-2 text-xs text-[#E8DFC9]/55">
              {codeBlock.filename}
            </figcaption>
          )}
          <pre className="overflow-x-auto p-5 text-sm leading-6 text-[#E8DFC9]/85">
            <code className={`language-${codeBlock.language || 'text'}`}>
              {codeBlock.code}
            </code>
          </pre>
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }) => <h2 className="mb-5 mt-12 text-3xl font-bold leading-tight text-[#E8DFC9]">{children}</h2>,
    h2: ({ children }) => <h2 className="mb-4 mt-11 text-2xl font-bold leading-tight text-[#E8DFC9]">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-3 mt-8 text-xl font-bold leading-snug text-[#E8DFC9]">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[#2563FF] pl-5 text-lg italic leading-8 text-[#E8DFC9]/80">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="my-5 leading-8 text-[#E8DFC9]/80">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const href =
        value && typeof value === 'object' && 'href' in value && typeof value.href === 'string'
          ? value.href
          : undefined;
      if (!href) return <>{children}</>;
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer noopener' : undefined}
          className="font-medium text-[#7FA2FF] underline decoration-[#7FA2FF]/40 underline-offset-4 hover:text-white"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 leading-7 text-[#E8DFC9]/80">{children}</ul>,
    number: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 leading-7 text-[#E8DFC9]/80">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
};

function PostCard({ post }: { post: BlogPost }) {
  const imageUrl = getSanityImageUrl(post.coverImage, {
    width: 640,
    height: 400,
    fit: 'crop',
  });

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E8DFC9]/12 bg-[#2D3033] transition-colors hover:border-[#2563FF]/50">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden bg-[#1C1F21]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.coverImage.alt || post.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#E8DFC9]/35">
              <BookOpen className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7FA2FF]">
            {post.category}
          </p>
          <h3 className="mt-2 text-lg font-bold leading-snug group-hover:text-white">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#E8DFC9]/60">{post.excerpt}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#7FA2FF]">
            Read article <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function BlogArticlePage() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(false);
    setPost(null);

    sanityClient
      .fetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug })
      .then((result) => {
        if (active) setPost(result);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        console.error(`Unable to load blog article "${slug}" from Sanity:`, cause);
        setError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const canonicalUrl = post
    ? getPostCanonicalUrl(post.slug, post.canonicalUrl)
    : absoluteSiteUrl(`/blog/${slug}`);
  const title = post ? post.seoTitle || post.title : 'Article not found | Webistic Blog';
  const description = post?.seoDescription || post?.excerpt || 'Read the latest image optimization insights from Webistic.';
  const socialImage = post
    ? getSanityImageUrl(post.openGraphImage || post.coverImage, { width: 1200, height: 630, fit: 'crop' })
    : undefined;
  const jsonLd = useMemo(() => {
    if (!post) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      image: socialImage ? [socialImage] : undefined,
      datePublished: post.publishedAt,
      dateModified: post._updatedAt,
      author: { '@type': 'Person', name: post.authorName },
      publisher: { '@type': 'Organization', name: 'Webistic' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      articleSection: post.category,
      keywords: post.tags?.join(', '),
    };
  }, [canonicalUrl, post, socialImage]);

  usePageMetadata({
    title,
    description,
    canonicalUrl,
    imageUrl: socialImage,
    imageAlt: post?.openGraphImage?.alt || post?.coverImage.alt || post?.title,
    robots: !post && !isLoading ? 'noindex, nofollow' : 'index, follow',
    type: 'article',
    jsonLd,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen flex-1 bg-[#25282B] px-4 py-16 sm:px-6" aria-label="Loading article">
        <div className="mx-auto max-w-3xl">
          <div className="h-4 w-28 animate-pulse rounded bg-[#E8DFC9]/10" />
          <div className="mt-8 h-14 animate-pulse rounded bg-[#E8DFC9]/10" />
          <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-[#E8DFC9]/10" />
          <div className="mt-10 aspect-[16/8] animate-pulse rounded-2xl bg-[#E8DFC9]/10" />
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-[65vh] flex-1 bg-[#25282B] px-4 py-16 text-[#E8DFC9] sm:px-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#E8DFC9]/10 bg-[#2D3033] p-8 text-center sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7FA2FF]">
            {error ? 'A temporary issue' : '404 · Article not found'}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold">
            {error ? 'This article could not be loaded.' : 'This story isn’t here.'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#E8DFC9]/60">
            {error
              ? 'Please try again, or return to the journal to explore other articles.'
              : 'The article may have moved or is no longer published.'}
          </p>
          <Link to="/blog" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#2563FF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2563FF]/90">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the blog
          </Link>
        </div>
      </main>
    );
  }

  const coverImageUrl = getSanityImageUrl(post.coverImage, {
    width: 1440,
    height: 820,
    fit: 'crop',
  });
  const authorImageUrl = getSanityImageUrl(post.authorImage, {
    width: 96,
    height: 96,
    fit: 'crop',
  });

  return (
    <main className="min-h-screen flex-1 bg-[#25282B] text-[#E8DFC9]">
      <article>
        <header className="mx-auto max-w-5xl px-4 pb-9 pt-10 sm:px-6 sm:pb-12 sm:pt-14">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-[#7FA2FF] transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All articles
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em]">
            <Link to="/blog" className="rounded-full bg-[#2563FF]/15 px-3 py-1.5 text-[#7FA2FF] hover:bg-[#2563FF]/25">
              {post.category}
            </Link>
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full border border-[#E8DFC9]/15 px-3 py-1.5 text-[#E8DFC9]/50">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#E8DFC9]/65 sm:text-lg">
            {post.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[#E8DFC9]/10 pt-5">
            <div className="flex items-center gap-3">
              {authorImageUrl ? (
                <img
                  src={authorImageUrl}
                  alt={post.authorImage?.alt || post.authorName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563FF]/20 text-sm font-bold text-[#7FA2FF]">
                  {post.authorName.slice(0, 1)}
                </span>
              )}
              <span className="text-sm font-semibold">{post.authorName}</span>
            </div>
            <span className="flex items-center gap-2 text-xs text-[#E8DFC9]/55">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.publishedAt}>{formatPublicationDate(post.publishedAt)}</time>
            </span>
          </div>
        </header>

        {coverImageUrl && (
          <figure className="mx-auto max-w-6xl px-4 sm:px-6">
            <img
              src={coverImageUrl}
              alt={post.coverImage.alt || post.title}
              fetchPriority="high"
              className="max-h-[640px] w-full rounded-2xl bg-[#1C1F21] object-cover"
            />
            {post.coverImage.caption && (
              <figcaption className="mt-3 text-center text-xs text-[#E8DFC9]/50">
                {post.coverImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16">
          <div className="min-w-0">
            {post.body?.length ? (
              <div className="prose max-w-none text-[16px] sm:text-[17px] [&_strong]:font-bold [&_strong]:text-[#E8DFC9] [&_em]:italic [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-[#E8DFC9]/10 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-sm [&_a]:break-words">
                <PortableText
                  value={post.body as PortableTextBlock[]}
                  components={portableTextComponents}
                />
              </div>
            ) : (
              <p className="text-[#E8DFC9]/60">This article has no published body content yet.</p>
            )}

            <div className="mt-12 rounded-2xl border border-[#2563FF]/20 bg-[#2563FF]/[0.07] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7FA2FF]">Put it into practice</p>
              <h2 className="mt-3 text-xl font-bold">Make your images lighter, right in your browser.</h2>
              <p className="mt-2 text-sm leading-6 text-[#E8DFC9]/65">
                Compress images to a target size without uploading your files to a server.
              </p>
              <Link to="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7FA2FF] hover:text-white">
                Try the free image compressor <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-[#E8DFC9]/10 bg-[#2D3033] p-5 lg:sticky lg:top-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8DFC9]/45">In this story</p>
            <p className="mt-3 text-sm font-semibold leading-6">{post.title}</p>
            <p className="mt-3 text-xs leading-5 text-[#E8DFC9]/55">
              Published {formatPublicationDate(post.publishedAt)}
            </p>
            <Link to="/blog" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#7FA2FF] hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              More from the journal
            </Link>
          </aside>
        </div>
      </article>

      {!!post.relatedPosts?.length && (
        <section className="border-t border-[#E8DFC9]/10 bg-[#222527] px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7FA2FF]">Keep exploring</p>
                <h2 className="mt-2 text-2xl font-bold">Related articles</h2>
              </div>
              <Link to="/blog" className="hidden items-center gap-2 text-sm font-semibold text-[#7FA2FF] hover:text-white sm:inline-flex">
                All articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {post.relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost._id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
