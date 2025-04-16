import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const exhibitionType = defineType({
  name: 'exhibition',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required().error('A page title is required'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The unique part of the URL for this page (e.g., "/exhibitions/your-slug-here")',
      options: {
        source: 'name',
      },
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'artworks',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artwork'}],
        },
      ],
      description: 'Artworks included in this exhibition',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'datesOpen',
      type: 'object',
      fields: [
        defineField({
          name: 'startDate',
          type: 'date',
          title: 'Start Date',
          description: 'The date when the exhibition starts',
        }),
        defineField({
          name: 'endDate',
          type: 'date',
          title: 'End Date',
          description: 'The date when the exhibition ends',
        }),
      ],
    }),
    defineField({
      name: 'location',
      type: 'string',
    }),
    defineField({
      name: 'curators',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
    }),
    defineField({
      name: 'artists',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      artists: 'artists',
      firstArtist: 'artists.0.name',
      images: 'images',
    },
    prepare: ({title, artists, firstArtist, images}) => {
      const media = (images && images.length && images[0]) || null
      const subtitle = firstArtist
        ? `${firstArtist}  ${
            artists.length - 1 > 0
              ? `and ${artists.length - 1} other${artists.length > 2 ? 's' : ''}`
              : ''
          } `
        : 'No artists listed'
      return {
        title: `${title || 'Untitled Exhibition'}`,
        subtitle,
        media,
      }
    },
  },
})
