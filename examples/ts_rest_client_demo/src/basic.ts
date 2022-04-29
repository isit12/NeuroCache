import MemMachineClient, { MemMachineAPIError } from '@memmachine/client'

function handleError(error: unknown, context?: string) {
  if (error instanceof MemMachineAPIError) {
    console.error(`[MemMachineAPIError]${context ? ' [' + context + ']' : ''}:`, error.message)
  } else {
    console.error(`[UnknownError]${context ? ' [' + context + ']' : ''}:`, error)
  }
}

export async function basic() {

  const client = new MemMachineClient({
    base_url: 'http://127.0.0.1:8080/api/v2' 
  })
  const project = client.project({ org_id: 'my_org', project_id: 'my_project' })
  const memory = project.memory()

  const memoriesToAdd = [
    {
      content: 'I like pizza and pasta',
      metadata: { type: 'preference', category: 'food' }
    },
    {
      content: 'I work as a software engineer',
      metadata: { type: 'fact', category: 'work' }
    }
  ]

  console.log('Adding memories...')
  for (const { content, metadata } of memoriesToAdd) {
    try {
      await memory.add(content, { metadata })
      console.log('Added memory:', content)
    } catch (error) {
      handleError(error, 'Adding memory')
    }
  }

  console.log('Searching memories...')
  const searchQueries = ['What do I like to eat?', 'Tell me about my work']

  for (const query of searchQueries) {
    try {
      const result = await memory.search(query)
      console.log(`Search results for "${query}":`)
      console.dir(result, { depth: null })
    } catch (error) {
      handleError(error, 'Searching memory')
    }
  }

  const episodicCount = await project.getEpisodicCount()
  console.log(`Episodic memory count: ${episodicCount}`)

  const projects = await client.getProjects()
  console.log('All projects:')
  console.dir(projects, { depth: null })

  const healthCheck = await client.healthCheck()
  console.log('Health check:')
  console.dir(healthCheck, { depth: null })

  await project.delete()
  console.log('Project deleted.')
}
