import {defineType, defineField} from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'floor',
      type: 'number',
      description: 'floor number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}) 