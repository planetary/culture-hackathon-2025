import {type StructureResolver} from 'sanity/structure'

// Types we never want to show
const hiddenTypes = ['media.tag']

export const structure: StructureResolver = (S) => {
  const allItems = S.documentTypeListItems().filter((item) => !hiddenTypes.includes(item.getId()!))
  const filterItems = (arr: string[]) => allItems.filter((item) => arr.includes(item.getId()!))
  const artworkItems = ['artwork', 'exhibition']
  const editorialItems = ['news']
  const personItems = ['person']
  const galleryItems = ['gallery']
  const contextItems = ['assist.instruction.context']
  const tourItems = ['tour']
  return (
    S.list()
      .title('Content')
      // todo: could probably just be a loop
      .items([
        ...filterItems(artworkItems),
        S.divider(),
        ...filterItems(editorialItems),
        S.divider(),
        ...filterItems(personItems),
        S.divider(),
        ...filterItems(contextItems),
        S.divider(),
        ...filterItems(galleryItems),
        S.divider(),
        ...filterItems(tourItems),
      ])
  )
}
