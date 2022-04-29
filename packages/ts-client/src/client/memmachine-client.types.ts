
export interface ClientOptions {
  base_url?: string
  api_key?: string
  timeout?: number
  max_retries?: number
}


export interface HealthStatus {
  status: string
  service: string
  version: string
  memory_managers: {
    profile_memory: boolean
    episodic_memory: boolean
  }
}
