import {defineCliConfig} from 'sanity/cli'
const studioHost = `culture-hackathon-${process.env.SANITY_STUDIO_DATASET}`
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
  studioHost,
})
