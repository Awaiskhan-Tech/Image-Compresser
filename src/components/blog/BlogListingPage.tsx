import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMetadata } from './usePageMetadata';
import { absoluteSiteUrl, formatPublicationDate } from './blogUtils';
import { getSanityImageUrl } from '../../lib/sanity/images';
import { sanityClient } from '../../lib/sanity/client';
import {
  CATEGORIES_QUERY,
  POST_COUNT_QUERY,
  POSTS_QUERY,
} from '../../lib/sanity/queries';
import type { BlogPost } from '../../lib/sanity/types';

const PAGE_SIZE = 9;
const pageMetadata = {
  title: 'Image Optimization Insights & Guides | Webistic Blog',
  description:
    'Practical image optimization guides, product insights, and privacy-first workflows from the Webistic team.',
};

function ArticleCard({ post }: { post: BlogPost }) {
  const imageUrl = getSanityImageUrl(post.coverImage, {
    width: 720,
    height: 440,
    fit: 'crop',
  });

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E8DFC9]/12 bg-[#2D3033] transition duration-300 hover:-translate-y-1 hover:border-[#2563FF]/50 hover:shadow-xl hover:shadow-black/20">
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
              <BookOpen className="h-10 w-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
            <span className="rounded-full bg-[#2563FF]/15 px-2.5 py-1 text-[#7FA2FF]">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-[#E8DFC9]/50 normal-case tracking-normal">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {formatPublicationDate(post.publishedAt)}
            </span>
          </div>
          <h2 className="text-xl font-bold leading-snug text-[#E8DFC9] transition-colors group-hover:text-white">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#E8DFC9]/65">
            {post.excerpt}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E8DFC9]/10 pt-4 text-xs text-[#E8DFC9]/60">
            <span>By {post.authorName}</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#7FA2FF]">
              Read article
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('all');
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  usePageMetadata({ ...pageMetadata, canonicalUrl: absoluteSiteUrl('/blog') });

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    setPosts([]);
    setTotal(0);

    Promise.all([
      sanityClient.fetch<BlogPost[]>(POSTS_QUERY, {
        offset: 0,
        limit: PAGE_SIZE,
        category,
      }),
      sanityClient.fetch<number>(POST_COUNT_QUERY, { category }),
      sanityClient.fetch<string[]>(CATEGORIES_QUERY),
    ])
      .then(([nextPosts, nextTotal, nextCategories]) => {
        if (!active) return;
        setPosts(nextPosts);
        setTotal(nextTotal);
        setCategories(nextCategories.filter(Boolean).sort((a, b) => a.localeCompare(b)));
      })
      .catch((cause: unknown) => {
        if (!active) return;
        console.error('Unable to load blog posts from Sanity:', cause);
        setError('We couldn’t load the articles right now. Please try again in a moment.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category, retryToken]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    setError(null);
    try {
      const nextPosts = await sanityClient.fetch<BlogPost[]>(POSTS_QUERY, {
        offset: posts.length,
        limit: PAGE_SIZE,
        category,
      });
      setPosts((current) => [...current, ...nextPosts]);
    } catch (cause) {
      console.error('Unable to load more blog posts from Sanity:', cause);
      setError('More articles could not be loaded. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const featuredPost = posts.find((post) => post.featured);
  const remainingPosts = featuredPost
    ? posts.filter((post) => post._id !== featuredPost._id)
    : posts;
  const featuredImageUrl = featuredPost
    ? getSanityImageUrl(featuredPost.coverImage, {
        width: 1280,
        height: 760,
        fit: 'crop',
      })
    : undefined;

  return (
    <main className="min-h-screen flex-1 bg-[#25282B] text-[#E8DFC9]">
      <section className="border-b border-[#E8DFC9]/10 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,255,0.18),_transparent_48%)] px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-[#7FA2FF]">
            The Webistic Journal
          </p>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.55fr)] md:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Make every image work harder.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#E8DFC9]/65">
                Field-tested ideas for faster, lighter images and better digital experiences.
              </p>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#E8DFC9]/55 md:justify-self-end">
              Clear advice on image optimization, practical tutorials, and the details behind a more thoughtful web.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2" aria-label="Filter articles by category">
            {['all', ...categories].map((item) => {
              const isSelected = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  disabled={isLoading || isLoadingMore}
                  aria-pressed={isSelected}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${
                    isSelected
                      ? 'border-[#2563FF] bg-[#2563FF] text-white'
                      : 'border-[#E8DFC9]/15 text-[#E8DFC9]/65 hover:border-[#E8DFC9]/35 hover:text-[#E8DFC9]'
                  }`}
                >
                  {item === 'all' ? 'All articles' : item}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading articles">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-[390px] animate-pulse rounded-2xl border border-[#E8DFC9]/10 bg-[#2D3033]" />
            ))}
          </div>
        ) : error && posts.length === 0 ? (
          <div role="alert" className="rounded-2xl border border-red-300/20 bg-red-950/20 p-6 text-sm text-red-100">
            <p>{error}</p>
            <button type="button" onClick={() => setRetryToken((value) => value + 1)} className="mt-4 font-semibold underline">
              Retry
            </button>
          </div>
        ) : total === 0 ? (
          <div className="rounded-2xl border border-[#E8DFC9]/10 bg-[#2D3033] px-6 py-14 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-[#7FA2FF]" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">Fresh ideas are on the way</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#E8DFC9]/60">
              There are no published articles in this category yet. Check back soon.
            </p>
            <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7FA2FF] hover:text-white">
              Explore the image compressor <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            {featuredPost && (
              <article className="mb-8 grid overflow-hidden rounded-3xl border border-[#E8DFC9]/12 bg-[#2D3033] lg:grid-cols-[1.05fr_0.95fr]">
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  aria-label={`Read featured article: ${featuredPost.title}`}
                  className="group min-h-64 overflow-hidden bg-[#1C1F21] lg:min-h-[390px]"
                >
                  {featuredImageUrl && (
                    <img
                      src={featuredImageUrl}
                      alt={featuredPost.coverImage.alt || featuredPost.title}
                      className="h-full min-h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03] lg:min-h-[390px]"
                    />
                  )}
                </Link>
                <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-11">
                  <span className="mb-4 w-fit rounded-full bg-[#2563FF]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7FA2FF]">
                    Featured · {featuredPost.category}
                  </span>
                  <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                    <Link to={`/blog/${featuredPost.slug}`} className="transition-colors hover:text-white">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#E8DFC9]/65">{featuredPost.excerpt}</p>
                  <div className="mt-6 text-xs text-[#E8DFC9]/55">
                    By {featuredPost.authorName} <span className="mx-2">·</span>
                    {formatPublicationDate(featuredPost.publishedAt)}
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#7FA2FF] hover:text-white">
                    Read the story <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )}

            {remainingPosts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post) => <ArticleCard key={post._id} post={post} />)}
              </div>
            )}

            {error && <p role="alert" className="mt-6 text-sm text-red-200">{error}</p>}

            {posts.length < total && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl border border-[#E8DFC9]/20 px-5 py-3 text-sm font-semibold transition-colors hover:border-[#7FA2FF] hover:text-white disabled:cursor-wait disabled:opacity-60"
                >
                  {isLoadingMore ? 'Loading…' : 'Load more articles'}
                  {!isLoadingMore && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
