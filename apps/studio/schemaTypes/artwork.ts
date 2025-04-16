import {ImageIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'

export const artworkType = defineType({
  name: 'artwork',
  icon: ImageIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'artist',
      type: 'reference',
      to: [{type: 'person'}],
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
      name: 'description',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    }),
    defineField({
      name: 'year',
      type: 'number',
      description: 'The year the artwork was created',
    }),
    defineField({
      name: 'medium',
      type: 'string',
      description: 'The medium of the artwork (e.g., oil on canvas, digital, etc.)',
    }),
    defineField({
      name: 'dimensions',
      type: 'object',
      description: 'Dimensions of the artwork in inches',
      fields: [
        defineField({
          name: 'width',
          type: 'number',
        }),
        defineField({
          name: 'height',
          type: 'number',
        }),
        // defineField({
        //   name: 'depth',
        //   type: 'number',
        // }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      images: 'images',
      subtitle: 'artist.name',
    },
    prepare(selection) {
      const {title, images, subtitle} = selection

      return {
        title,
        media: images && images.length > 0 ? images[0] : null,
        subtitle: `by ${subtitle}`,
      }
    },
  },
})
