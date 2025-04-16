import {type StructureResolver} from 'sanity/structure'
const hiddenTypes = ['media.tag']
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items(
      // List all document types except "siteSettings"
      S.documentTypeListItems().filter((item) => !hiddenTypes.includes(item.getId()!)),
    )
