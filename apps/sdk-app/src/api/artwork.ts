import {createClient} from '@sanity/client'
import type {NextApiRequest, NextApiResponse} from 'next'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: '2024-03-19',
  useCdn: true,
})

interface ArtworkRequest {
  handle: {
    documentId: string
    documentType: string
  }
  projection: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method not allowed'})
  }

  try {
    const {handle, projection} = req.body as ArtworkRequest
    const query = `*[_id == $id][0]${projection}`
    const params = {id: handle.documentId}

    const data = await client.fetch(query, params)
    res.status(200).json(data)
  } catch (error) {
    console.error('Error in artwork API:', error)
    res.status(500).json({message: 'Internal server error'})
  }
}
