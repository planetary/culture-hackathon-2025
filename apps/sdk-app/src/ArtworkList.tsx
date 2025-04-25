import './ExampleComponent.css'
import {useDocuments, useDocument, useEditDocument} from '@sanity/sdk-react'
import {useState, useMemo, useEffect} from 'react'
import {useProjection, type DocumentHandle, type SanityDocumentLike} from '@sanity/sdk-react'
import {DraggableArtworkList} from './DraggableArtworkList'
import {ArtworkSearch} from './ArtworkSearch'
import imageUrlBuilder from '@sanity/image-url'
import './ArtworkList.css'

function ArtworkTitleInput({handle}) {
  console.log('handle', handle)
  const name = useDocument(handle, 'name')
  // console.log('name', name)
  const editName = useEditDocument(handle, 'name')

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    editName(event.target.value)
  }

  return (
    <>
      <label>Name:&nbsp;</label>
      <input type="text" value={name} onChange={handleNameChange} />
    </>
  )
}

interface ArtworkData {
  name: string
  artist: {
    name: string
  }
  year?: string
  images?: Array<{
    asset: {
      _ref: string
    }
  }>
}

function ArtworkItem({
  handle,
  onClick,
}: {
  handle: DocumentHandle<SanityDocumentLike>
  onClick?: () => void
}) {
  const {data} = useProjection<ArtworkData>({
    documentId: handle.documentId,
    documentType: 'artwork',
    projection: `{
      name,
      artist-> {
        name
      },
      year,
      images[] {
        asset {
          _ref
        }
      }
    }`,
  })

  const imageUrl = data?.images?.[0]?.asset?._ref
    ? imageUrlBuilder({
        projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
        dataset: process.env.SANITY_STUDIO_DATASET!,
      })
        .image(data.images[0].asset._ref)
        .width(400)
        .height(400)
        .fit('max')
        .url()
    : null

  return (
    <div className="search-result-item" onClick={onClick}>
      {imageUrl && (
        <div className="search-result-image">
          <img src={imageUrl} alt={data?.name || 'Untitled'} />
        </div>
      )}
      <div className="search-result-details">
        <h3 className="search-result-title">{data?.name || 'Untitled'}</h3>
        <p className="search-result-artist">{data?.artist?.name}</p>
        {data?.year && <p className="search-result-year">{data.year}</p>}
      </div>
    </div>
  )
}

/**
 * Example component that fetches and displays a list of artworks from the Sanity dataset.
 */
export function ArtworkList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHandles, setSelectedHandles] = useState<DocumentHandle<SanityDocumentLike>[]>([])

  // Get all artwork handles for initial state
  const {data: allArtworkHandles, isPending: isInitialLoading} = useDocuments({
    filter: '_type == "artwork"',
    batchSize: 100,
  })

  useEffect(() => {
    if (allArtworkHandles) {
      setSelectedHandles(allArtworkHandles)
    }
  }, [allArtworkHandles])

  // Create a dynamic GROQ filter based on the search query
  const filter = useMemo(() => {
    if (!searchQuery) return '_type == "artwork"'

    const searchLower = searchQuery.toLowerCase()
    return `_type == "artwork" && (
      name match "${searchLower}*" ||
      artist->name match "${searchLower}*" ||
      year match "${searchLower}*"
    )`
  }, [searchQuery])

  // Search results
  const {
    data: searchResults,
    hasMore: searchHasMore,
    isPending: searchIsPending,
    loadMore: searchLoadMore,
  } = useDocuments({
    filter,
    batchSize: 10,
    orderings: [{field: '_createdAt', direction: 'desc'}],
  })

  const hasResults = Boolean(searchQuery && searchResults && searchResults.length > 0)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleAddArtwork = (handle: DocumentHandle<SanityDocumentLike>) => {
    setSelectedHandles((prev) => [...prev, handle])
  }

  const handleRemove = (id: string) => {
    setSelectedHandles((prev) => prev.filter((h) => h.documentId !== id))
  }

  return (
    <div className="artwork-container">
      <div className="search-section">
        <ArtworkSearch onSearch={handleSearch} hasResults={hasResults} />
        {hasResults && (
          <div className="search-results">
            {searchResults.map((handle) => (
              <ArtworkItem
                key={handle.documentId}
                handle={handle}
                onClick={() => handleAddArtwork(handle)}
              />
            ))}
            {searchHasMore && (
              <button
                className="load-more-button"
                onClick={searchLoadMore}
                disabled={searchIsPending}
              >
                {searchIsPending ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="draggable-section">
        {isInitialLoading ? (
          <div>Loading artworks...</div>
        ) : (
          <DraggableArtworkList handles={selectedHandles} onRemove={handleRemove} />
        )}
      </div>
    </div>
  )
}
