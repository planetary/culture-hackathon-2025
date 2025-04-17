import './ExampleComponent.css'
import {useDocuments} from '@sanity/sdk-react'
/**
 * Example component that fetches and displays a list of artworks from the Sanity dataset.
 */
export function ArtworkList() {
  const {data, hasMore, isPending, loadMore, count} = useDocuments({
    filter: '_type == "artwork"',
    batchSize: 5,
  })
  console.log('dta', data)
  return (
    <div>
      Total documents: {count}
      <ol>
        {data.map((doc) => (
          <li key={doc._id}>
            <code>{JSON.stringify(doc, null, 2)}</code>
          </li>
        ))}
      </ol>
      {hasMore && (
        <button onClick={loadMore} disabled={isPending}>
          {isPending ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
