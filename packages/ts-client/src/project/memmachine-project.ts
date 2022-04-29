import type { AxiosInstance } from 'axios'

import { handleAPIError, MemMachineAPIError } from '@/errors'
import { MemMachineMemory, type MemoryContext } from '@/memory'
import type { CreateProjectOptions, Project, ProjectContext } from './memmachine-project.types'


export class MemMachineProject {
  client: AxiosInstance
  projectContext: ProjectContext

  constructor(client: AxiosInstance, projectContext: ProjectContext) {
    this.client = client

    const { org_id, project_id } = projectContext
    if (typeof org_id !== 'string' || !org_id.trim()) {
      throw new MemMachineAPIError('Organization ID must be a non-empty string')
    }
    if (typeof project_id !== 'string' || !project_id.trim()) {
      throw new MemMachineAPIError('Project ID must be a non-empty string')
    }

    this.projectContext = projectContext
  }

  
  memory(memoryContext?: MemoryContext): MemMachineMemory {
    return new MemMachineMemory(this.client, this.projectContext, memoryContext)
  }

  
  async create(options?: CreateProjectOptions): Promise<Project> {
    const { description = '', reranker = '', embedder = '' } = options ?? {}

    const payload = {
      ...this.projectContext,
      description,
      config: {
        reranker,
        embedder
      }
    }

    try {
      const response = await this.client.post('/projects', payload)
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, `Failed to create project with payload: ${JSON.stringify(payload)}`)
    }
  }

  
  async get(): Promise<Project> {
    const payload = {
      ...this.projectContext
    }

    try {
      const response = await this.client.post('/projects/get', payload)
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, `Failed to get project with payload: ${JSON.stringify(payload)}`)
    }
  }

  
  async getEpisodicCount(): Promise<number> {
    const payload = {
      ...this.projectContext
    }

    try {
      const response = await this.client.post('/projects/episode_count/get', payload)
      return response.data?.count ?? 0
    } catch (error: unknown) {
      handleAPIError(error, `Failed to get episodic memory count with payload: ${JSON.stringify(payload)}`)
    }
  }

  
  async delete(): Promise<null> {
    const payload = {
      ...this.projectContext
    }

    try {
      const response = await this.client.post('/projects/delete', payload)
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, `Failed to delete project with payload: ${JSON.stringify(payload)}`)
    }
  }
}
