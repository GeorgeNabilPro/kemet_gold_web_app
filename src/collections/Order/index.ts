import type { CollectionConfig } from 'payload'

import { isAdmin, authenticated } from '@/access'

import { slugField } from '@/fields/slug'

export const Order: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: isAdmin,
    read: authenticated,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
