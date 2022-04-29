import { AxiosError } from 'axios'

import { MemMachineAPIError } from './memmachine-api-error'


export function handleAPIError(error: unknown, message: string): never {
  if (error instanceof AxiosError && error.response?.data?.detail) {
    throw new MemMachineAPIError(`${message}: ${error.message} - ${error.response.data.detail}`)
  }
  if (error instanceof Error) {
    throw new MemMachineAPIError(`${message}: ${error.message}`)
  }
  throw new MemMachineAPIError(`${message}: ${JSON.stringify(error)}`)
}
