/** Base MCP error */
export class MCPError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'MCP_ERROR',
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = 'MCPError'
  }
}

/** MCP request timed out */
export class MCPTimeoutError extends MCPError {
  constructor(timeoutMs: number) {
    super(`MCP request timed out after ${timeoutMs}ms`, 'MCP_TIMEOUT', 504)
    this.name = 'MCPTimeoutError'
  }
}

/** Could not reach the MCP server */
export class MCPConnectionError extends MCPError {
  constructor(url: string, cause?: Error) {
    super(
      `Failed to connect to MCP server at ${url}${cause ? `: ${cause.message}` : ''}`,
      'MCP_CONNECTION',
      503,
    )
    this.name = 'MCPConnectionError'
    if (cause) this.cause = cause
  }
}

/** MCP returned a non-2xx response */
export class MCPResponseError extends MCPError {
  constructor(status: number, body?: string) {
    super(
      `MCP server returned ${status}${body ? `: ${body}` : ''}`,
      'MCP_RESPONSE',
      status,
    )
    this.name = 'MCPResponseError'
  }
}

/** Determines whether an error is retryable */
export function isRetryable(err: unknown): boolean {
  if (err instanceof MCPTimeoutError) return true
  if (err instanceof MCPConnectionError) return true
  if (err instanceof MCPResponseError) {
    // retry on 5xx but not 4xx
    return err.statusCode >= 500
  }
  return false
}
