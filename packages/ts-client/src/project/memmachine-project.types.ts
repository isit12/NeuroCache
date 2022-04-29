
export interface Project {
  org_id: string
  project_id: string
  description?: string
  config?: {
    reranker: string
    embedder: string
  }
}


export interface ProjectContext {
  org_id: string
  project_id: string
}


export interface CreateProjectOptions {
  description?: string
  reranker?: string
  embedder?: string
}
