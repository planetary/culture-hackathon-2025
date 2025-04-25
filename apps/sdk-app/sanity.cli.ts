import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  app: {
    organizationId: process.env.SANITY_STUDIO_ORGANIZATION_ID!,
    entry: './src/App.tsx',
  },
  // temporary fix to allow dev outside of dashboard
  vite: {
    server: {
      fs: {
        strict: false,
      },
    },
  },
})
