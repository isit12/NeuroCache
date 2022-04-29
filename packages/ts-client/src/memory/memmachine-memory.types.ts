
export type MemoryType = 'episodic' | 'semantic'


export type MemoryProducerRole = 'user' | 'assistant' | 'system'


export interface EpisodicMemory {
  uid: string
  score: number
  content: string
  created_at: string

  producer_id: string
  producer_role: string
  produced_for_id?: string

  episode_type: string
  metadata?: Record<string, unknown>
}


export interface SemanticMemory {
  set_id: string
  category: string
  tag: string
  feature_name: string
  value: string
  metadata: {
    citations?: string[]
    id?: string
    other?: Record<string, unknown>
  }
}


export interface MemoryContext {
  session_id?: string
  user_id?: string
  group_id?: string
  agent_id?: string
}


export interface AddMemoryOptions {
  producer?: string
  role?: MemoryProducerRole
  produced_for?: string
  episode_type?: string
  timestamp?: string
  metadata?: Record<string, string>
  types?: MemoryType[]
}


export interface AddMemoryResult {
  results: { uid: string }[]
}


export interface SearchMemoriesOptions {
  top_k?: number
  filter?: string
  expand_context?: number
  score_threshold?: number
  types?: MemoryType[]
  agent_mode?: boolean
}


export interface SearchMemoriesResult {
  status: number
  content: {
    episodic_memory: {
      long_term_memory: {
        episodes: EpisodicMemory[]
      }
      short_term_memory: {
        episodes: EpisodicMemory[]
        episode_summary: string[]
      }
    }
    semantic_memory: SemanticMemory[]
  }
}


export interface ListMemoriesOptions {
  page_size?: number
  page_num?: number
  filter?: string
  type?: MemoryType
}
