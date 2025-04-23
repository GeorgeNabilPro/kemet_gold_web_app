import type { CollectionConfig } from 'payload'
// import { deleteFromSearch } from '@/search/hooks/deleteFromSearch'

import { isAdmin, isEditor, anyone } from '@/access'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { getServerSideURL } from '@/utilities/getURL'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: isEditor,
    delete: isAdmin,
    read: anyone,
    update: isEditor,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
        })

        return `${getServerSideURL()}${path}`
      },
    },
    preview: (data) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
      })

      return `${getServerSideURL()}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: '',
    },
    {
      name: 'pageType',
      type: 'select',
      options: [
        {
          label: 'News/Events',
          value: 'news-events',
        },
        {
          label: 'Form',
          value: 'form',
        },
        {
          label: 'Basic',
          value: 'basic',
        },
      ],
      defaultValue: 'basic',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      revalidatePage,
      // async ({ doc, req, operation }) => {
      //   console.log('operation', operation)
      //   if (!doc.title) return
      //   const collectionId = doc.pageType === 'news-events' ? 3 : 4

      //   const docs = await req.payload.find({
      //     collection: 'searchItems',
      //     where: {
      //       docId: {
      //         equals: doc.id,
      //       },
      //     },
      //   })

      //   // await req.payload.create({
      //   //   collection: 'searchItems',
      //   //   data: {
      //   //     title: doc.title,
      //   //     slug: doc.slug,
      //   //     collection,
      //   //     description: doc.meta.description,
      //   //     categories: [],
      //   //   },
      //   // })
      // },
    ],
    beforeChange: [populatePublishedAt],
    // beforeDelete: [revalidateDelete],
    afterDelete: [revalidateDelete],
    // afterDelete: [
    //   async ({ doc, req }) => {
    //     const collectionID = doc.pageType === 'news-events' ? 3 : 4
    //     deleteFromSearch({
    //       searchItemID: doc.id * 100 + collectionID,
    //       req,
    //       collectionID,
    //     })
    //   },
    // ],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 5000, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}

/*

We need to change it based on:

*/
