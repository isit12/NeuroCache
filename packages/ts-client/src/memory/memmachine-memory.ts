import type { AxiosInstance } from 'axios'

import { handleAPIError, MemMachineAPIError } from '@/errors'
import type { ProjectContext } from '@/project'
import type {
  MemoryContext,
  AddMemoryOptions,
  MemoryType,
  SearchMemoriesOptions,
  SearchMemoriesResult,
  AddMemoryResult,
  ListMemoriesOptions
} from './memmachine-memory.types'


export class MemMachineMemory {
  client: AxiosInstance
  projectContext: ProjectContext
  memoryContext: MemoryContext

  constructor(client: AxiosInstance, projectContext: ProjectContext, memoryContext?: MemoryContext) {
    this.client = client
    this.projectContext = projectContext
    this.memoryContext = memoryContext ?? {}
  }

  
  add(content: string, options?: AddMemoryOptions): Promise<AddMemoryResult> {
    return this._addMemory(content, options)
  }

  
  search(query: string, options?: SearchMemoriesOptions): Promise<SearchMemoriesResult> {
    return this._searchMemories(query, options)
  }

  
  list(options?: ListMemoriesOptions): Promise<SearchMemoriesResult> {
    return this._listMemories(options)
  }

  
  delete(id: string, type: MemoryType): Promise<void> {
    return this._deleteMemory(id, type)
  }

  
  getContext(): ProjectContext & MemoryContext {
    return {
      ...this.projectContext,
      ...this.memoryContext
    }
  }

  
  private async _addMemory(content: string, options?: AddMemoryOptions): Promise<AddMemoryResult> {
    const {
      producer,
      role = 'user',
      produced_for,
      episode_type,
      timestamp,
      metadata = {},
      types = ['episodic', 'semantic']
    } = options ?? {}

    this._validateMemoryRole(role)

    const isoTimestamp = this._parseToIsoTimestamp(timestamp)

    const payload = {
      ...this.projectContext,
      types,
      messages: [
        {
          content,
          producer,
          role,
          produced_for,
          episode_type,
          timestamp: isoTimestamp,
          metadata: {
            ...this.memoryContext,
            ...metadata
          }
        }
      ]
    }

    try {
      const response = await this.client.post('/memories', payload)
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, `Failed to add memory with payload: ${JSON.stringify(payload)}`)
    }
  }

  
  private async _searchMemories(
    query: string,
    options?: SearchMemoriesOptions
  ): Promise<SearchMemoriesResult> {
    if (!query || !query.trim()) {
      throw new MemMachineAPIError('Search query must be a non-empty string')
    }

    const {
      top_k = 10,
      filter = '',
      expand_context = 0,
      score_threshold,
      types = ['episodic', 'semantic'],
      agent_mode = false
    } = options ?? {}

    const payload = {
      ...this.projectContext,
      query,
      top_k,
      filter,
      expand_context,
      ...(score_threshold != null ? { score_threshold } : {}),
      agent_mode,
      types
    }

    try {
      const response = await this.client.post('/memories/search', payload)
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, `Failed to search memories with payload: ${JSON.stringify(payload)}`)
    }
  }

  
  private async _listMemories(options?: ListMemoriesOptions): Promise<SearchMemoriesResult> {
    const { page_size = 10, page_num = 0, filter = '', type = 'episodic' } = options ?? {}

    const payload = {
      ...this.projectContext,
      page_size,
      page_num,
      filter,
      type
    }

    try {
      const response = await this.client.post('/memories/list', payload)
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, `Failed to list memories with payload: ${JSON.stringify(payload)}`)
    }
  }

  
  private async _deleteMemory(id: string, memoryType: MemoryType): Promise<void> {
    if (!id || !id.trim()) {
      throw new MemMachineAPIError('Memory ID must be a non-empty string')
    }

    this._validateMemoryType(memoryType)

    const urlMap: Record<MemoryType, string> = {
      episodic: '/memories/episodic/delete',
      semantic: '/memories/semantic/delete'
    }

    const payload = {
      ...this.projectContext,
      ...(memoryType === 'episodic' ? { episodic_id: id } : {}),
      ...(memoryType === 'semantic' ? { semantic_id: id } : {})
    }

    try {
      await this.client.post(urlMap[memoryType], payload)
    } catch (error: unknown) {
      handleAPIError(error, `Failed to delete ${memoryType} memory with payload: ${JSON.stringify(payload)}`)
    }
  }

  
  private _validateMemoryType(type: MemoryType): void {
    const validTypes: MemoryType[] = ['episodic', 'semantic']
    if (!validTypes.includes(type)) {
      throw new MemMachineAPIError(`Invalid memory type: ${type}. Valid types are: ${validTypes.join(', ')}`)
    }
  }

  
  private _validateMemoryRole(role: string): void {
    const validRoles = ['user', 'system', 'assistant']
    if (!validRoles.includes(role)) {
      throw new MemMachineAPIError(`Invalid memory role: ${role}. Valid roles are: ${validRoles.join(', ')}`)
    }
  }

  
  private _parseToIsoTimestamp(timestamp?: string): string {
    if (timestamp) {
      const parsed = Date.parse(timestamp)
      return !isNaN(parsed) ? new Date(parsed).toISOString() : new Date().toISOString()
    }
    return new Date().toISOString()
  }
}
