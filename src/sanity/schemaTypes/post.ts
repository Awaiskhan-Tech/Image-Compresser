import { defineArrayMember, defineField, defineType } from 'sanity';

const categories = [
  'Image Optimization',
  'Tutorials',
  'Product Updates',
  'Privacy & Security',
];

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().min(8).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'A concise summary used on cards and in search results.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().min(30).max(240),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().max(160),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          validation: (rule) => rule.max(180),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'authorImage',
      title: 'Author image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required().max(160),
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: { list: categories.map((title) => ({ title, value: title })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      validation: (rule) => rule.max(8),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Paragraph', value: 'normal' },
            { title: 'Heading 1', value: 'h1' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              defineField({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({
                        scheme: ['http', 'https', 'mailto'],
                        allowRelative: true,
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          name: 'articleImage',
          title: 'Article image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (rule) => rule.required().max(160),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              validation: (rule) => rule.max(180),
            }),
          ],
        }),
        defineArrayMember({
          name: 'codeBlock',
          title: 'Code block',
          type: 'object',
          fields: [
            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: ['bash', 'css', 'html', 'javascript', 'json', 'text', 'typescript'],
              },
              initialValue: 'typescript',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'filename',
              title: 'Filename',
              type: 'string',
            }),
            defineField({
              name: 'code',
              title: 'Code',
              type: 'text',
              rows: 10,
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'featured',
      title: 'Featured article',
      description: 'Promote this article in the featured area on the blog.',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      description: 'Optional; defaults to the article title.',
      type: 'string',
      group: 'seo',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      description: 'Optional; defaults to the excerpt.',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Open Graph image',
      description: 'Optional social share image; defaults to the cover image.',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      description: 'Optional absolute URL. Leave empty to use this article URL.',
      type: 'url',
      group: 'seo',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
  orderings: [
    {
      title: 'Publication date, newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Title, A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
});
