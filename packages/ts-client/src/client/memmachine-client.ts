import axios, { type AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'

import { handleAPIError } from '@/errors'
import { MemMachineProject, type Project, type ProjectContext } from '@/project'
import { VERSION } from '@/version'
import type { ClientOptions, HealthStatus } from './memmachine-client.types'


export class MemMachineClient {
  client: AxiosInstance

  constructor(options?: ClientOptions) {
    const { base_url = 'https://api.memmachine.ai/v2', api_key, timeout, max_retries } = options ?? {}

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'user-agent': `memmachine-ts-client/${VERSION}`
    }
    if (api_key) {
      headers['Authorization'] = `Bearer ${api_key}`
    }

    this.client = axios.create({
      baseURL: base_url,
      headers,
      timeout: timeout ?? 60000
    })

    axiosRetry(this.client, {
      retries: max_retries ?? 3,
      retryDelay: (retryCount, error) => axiosRetry.exponentialDelay(retryCount, error, 1000),
      retryCondition: error =>
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        (typeof error?.response?.status === 'number' &&
          [429, 500, 502, 503, 504].includes(error.response.status))
    })
  }

  
  project(projectContext: ProjectContext): MemMachineProject {
    return new MemMachineProject(this.client, projectContext)
  }

  
  async getProjects(): Promise<Project[]> {
    try {
      const response = await this.client.post('/projects/list')
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, 'Failed to get projects')
    }
  }

  
  async getMetrics(): Promise<string> {
    try {
      const response = await this.client.get('/metrics')
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, 'Failed to get metrics')
    }
  }

  
  async healthCheck(): Promise<HealthStatus> {
    try {
      const response = await this.client.get('/health')
      return response.data
    } catch (error: unknown) {
      handleAPIError(error, 'Failed to check health status')
    }
  }
}
