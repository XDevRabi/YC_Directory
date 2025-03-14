import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation. This means that the sanity will cache the content for 60 sec and then revalidate it every 60sec. and when it is true the content will be cached on cdn.
})
