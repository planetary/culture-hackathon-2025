import {type SanityConfig} from '@sanity/sdk'
import {SanityApp} from '@sanity/sdk-react'
import {ExampleComponent} from './ExampleComponent'
import {ArtworkList} from './ArtworkList'
import './App.css'

// apps can access many different projects or other sources of data
const sanityConfigs: SanityConfig[] = [
  {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
  },
]

export function App() {
  return (
    <div className="app-container">
      <SanityApp config={sanityConfigs} fallback={<div>Loading...</div>}>
        <ArtworkList />
        <ExampleComponent />
      </SanityApp>
    </div>
  )
}

export default App
