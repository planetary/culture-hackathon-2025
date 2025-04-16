import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

export const personType = defineType({
  name: 'person',
  icon: UserIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Full name of the person',
    }),
    defineField({
      name: 'bio',
      type: 'array',
      of: [{type: 'block', styles: [{title: 'Normal', value: 'normal'}], lists: []}],
      description: 'A short biography of the person',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
})
