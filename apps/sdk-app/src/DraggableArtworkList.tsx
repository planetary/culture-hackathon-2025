import {useState, useEffect} from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import imageUrlBuilder from '@sanity/image-url'
import {toPlainText} from '@portabletext/react'
import './DraggableArtworkList.css'
import {ArtworkSearch} from './ArtworkSearch'
import {useProjection} from '@sanity/sdk-react'

interface SanityImage {
  asset: {
    _ref: string
  }
}

interface SanityBlock {
  _type: string
  children: Array<{
    _type: string
    text: string
  }>
}

interface SanityArtwork {
  _id: string
  name: string
  images?: SanityImage[]
  description?: SanityBlock[]
}

interface SanityDocumentHandle {
  documentId: string
  documentType: string
}

interface ProjectionResult {
  name: string
  artist: {
    _ref: string
    name: string
  }
  year?: string
  images: Array<{
    asset: {
      _ref: string
    }
  }>
  description?: SanityBlock[]
}

interface ArtworkSearchData {
  name: string
  artistName: string
  year?: string
}

interface ArtworkWithSearchData extends ArtworkSearchData {
  handle: SanityDocumentHandle
}

function useArtworkSearchData(handles: SanityDocumentHandle[] | undefined) {
  const [searchData, setSearchData] = useState<ArtworkWithSearchData[]>([])

  useEffect(() => {
    if (!handles?.length) {
      setSearchData([])
      return
    }

    const fetchData = async () => {
      const results = await Promise.all(
        handles.map(async (handle) => {
          try {
            const response = await fetch('/api/artwork', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                handle,
                projection: `{
                  name,
                  "artistName": artist->name,
                  year
                }`,
              }),
            })
            const data = await response.json()
            return {
              handle,
              name: data?.name || '',
              artistName: data?.artistName || '',
              year: data?.year,
            }
          } catch (error) {
            console.error('Error fetching artwork data:', error)
            return {
              handle,
              name: '',
              artistName: '',
              year: undefined,
            }
          }
        }),
      )
      setSearchData(results)
    }

    fetchData()
  }, [handles])

  return searchData
}

interface DraggableArtworkListProps {
  handles: SanityDocumentHandle[]
  onRemove?: (id: string) => void
}

function ArtworkItem({
  handle,
  onRemove,
}: {
  handle: SanityDocumentHandle
  onRemove?: (id: string) => void
}) {
  const {
    data: {name, artist, images, description},
  } = useProjection<ProjectionResult>({
    ...handle,
    projection: `{
      name,
      artist-> {
        _ref,
        name
      },
      images[] {
        asset {
          _ref
        }
      },
      description
    }`,
  })

  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
    id: handle.documentId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const imageUrl = images?.[0]?.asset?._ref
    ? imageUrlBuilder({
        projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
        dataset: process.env.SANITY_STUDIO_DATASET!,
      })
        .image(images[0].asset._ref)
        .width(400)
        .height(400)
        .fit('max')
        .url()
    : null

  return (
    <div ref={setNodeRef} style={style} className={`artwork-item ${isDragging ? 'dragging' : ''}`}>
      <div className="drag-handle" {...attributes} {...listeners}>
        ⋮⋮
      </div>
      {imageUrl && (
        <div className="artwork-image">
          <img src={imageUrl} alt={name || 'Untitled'} />
        </div>
      )}
      <div className="artwork-content">
        {artist?.name && <div className="artwork-artist">{artist.name}</div>}
        <h3>{name || 'Untitled'}</h3>
        <p className="artwork-description">{description && toPlainText(description)}</p>
      </div>
      {onRemove && (
        <button className="remove-button" onClick={() => onRemove(handle.documentId)}>
          ×
        </button>
      )}
    </div>
  )
}

export function DraggableArtworkList({handles, onRemove}: DraggableArtworkListProps) {
  const [items, setItems] = useState(handles)

  useEffect(() => {
    setItems(handles)
  }, [handles])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.documentId === active.id)
        const newIndex = items.findIndex((item) => item.documentId === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="draggable-artwork-list">
      <h2>Artwork List ({items.length} total)</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((h) => h.documentId)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((handle) => (
            <ArtworkItem key={handle.documentId} handle={handle} onRemove={onRemove} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
