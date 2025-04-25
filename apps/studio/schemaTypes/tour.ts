import {defineType, defineField} from 'sanity'

export const tourType = defineType({
  name: 'tour',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'startDate',
      type: 'datetime',
    }),
    defineField({
      name: 'endDate',
      type: 'datetime',
    }),
    defineField({
        name: 'tags',
        type: 'string',
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
    }),
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
    },
    prepare({title, startDate}) {
      return {
        title,
        subtitle: startDate ? new Date(startDate).toLocaleDateString() : 'No date set',
      }
    },
  },
}) 