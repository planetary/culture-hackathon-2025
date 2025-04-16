import {BlockContentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const newsType = defineType({
  name: 'news',
  type: 'document',
  title: 'News',
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {type: 'image'},
      ],
    }),
    defineField({
      name: 'relatedContent',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artwork'}, {type: 'exhibition'}, {type: 'person'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      subtitle: 'slug.current',
    },
    prepare({title, media, subtitle}) {
      return {
        title,
        media,
        subtitle,
      }
    },
  },
})
