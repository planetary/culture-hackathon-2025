import {useState} from 'react'
import {useProjection} from '@sanity/sdk-react'

interface ArtworkSearchProps {
  onSearch: (query: string) => void
  hasResults?: boolean
}

export function ArtworkSearch({onSearch, hasResults}: ArtworkSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleClear = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <div className="search-container">
      <div className={`search-input-container ${hasResults ? 'has-results' : ''}`}>
        <input
          type="text"
          placeholder="Search by artist, title, or year..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
        {searchQuery && (
          <button className="search-clear-button" onClick={handleClear}>
            ×
          </button>
        )}
      </div>
    </div>
  )
}
