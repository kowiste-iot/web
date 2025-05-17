// Define log levels with numerical values
enum LogLevel {
  NONE = 0, // No logs
  ERROR = 1, // Only errors
  WARN = 2, // Errors and warnings
  INFO = 3, // Errors, warnings, and info
  DEBUG = 4, // All logs
}

interface LoggerOptions {
  enabled?: boolean
  colors?: boolean
  level?: LogLevel
}

class Logger {
  private options: LoggerOptions

  // Browser console color styles
  private colors = {
    red: 'color: #FF5252;',
    yellow: 'color: #FFC107;',
    blue: 'color: #2196F3;',
    reset: '',
  }

  constructor(options: LoggerOptions = {}) {
    this.options = {
      enabled: options.enabled ?? true,
      colors: options.colors ?? true,
      level: options.level ?? LogLevel.DEBUG, // Default to showing all logs
    }
  }

  // Set log level dynamically
  setLevel(level: LogLevel): void {
    if (this.options) {
      this.options.level = level
    }
  }

  // Get current log level
  getLevel(): LogLevel {
    return this.options?.level ?? LogLevel.DEBUG
  }

  private getFileInfo(): string {
    try {
      const err = new Error()
      const stack = err.stack || ''
      const stackLines = stack.split('\n')

      // Find the caller line - should be after debug/info/error/warn methods
      let callerLine = 'unknown:0'
      for (let i = 0; i < stackLines.length; i++) {
        if (
          !stackLines[i].includes('logger.ts') &&
          stackLines[i].trim() !== ''
        ) {
          callerLine = stackLines[i]
          break
        }
      }

      // Handle the direct @fs format
      // Pattern like: [@fs/Users/path/to/file.ts?t=1747476530340:317]
      let match = callerLine.match(/@fs\/(.+?)(\?|:|$)/)
      if (match) {
        // Extract the full path and then get the filename
        const fullPath = match[1]
        const pathParts = fullPath.split('/')
        let fileName = pathParts[pathParts.length - 1]

        // Remove query parameters like ?t=1747476684970
        fileName = fileName.split('?')[0]

        // Try to get line number if available
        const lineMatch = callerLine.match(/:(\d+)(:|\]|\)|$)/)
        const lineNumber = lineMatch ? lineMatch[1] : '0'

        return `${fileName}:${lineNumber}`
      }

      // Handle the main.ts format from your stack trace
      // Format: @http://localhost:5173/main.ts:30:8
      match = callerLine.match(/@http:\/\/localhost:\d+\/(.+?):(\d+):(\d+)/)
      if (match) {
        const [, filePath, lineNumber] = match
        // The filePath is already just the filename in this case
        // Remove query parameters
        const fileName = filePath.split('?')[0]
        return `${fileName}:${lineNumber}`
      }

      // Handle Vite dev server format with @fs
      match = callerLine.match(/@http:\/\/localhost:\d+\/@fs\/(.+?)(\?|$)/)
      if (match) {
        // Extract the full path and then get the filename
        const fullPath = match[1]
        const pathParts = fullPath.split('/')
        let fileName = pathParts[pathParts.length - 1]

        // Remove query parameters
        fileName = fileName.split('?')[0]

        // Try to get line number if available
        const lineMatch = callerLine.match(/:(\d+):(\d+)/)
        const lineNumber = lineMatch ? lineMatch[1] : '0'

        return `${fileName}:${lineNumber}`
      }

      // For .vue files which might have a ?t= query param
      match = callerLine.match(/\[(.+?)(\?t=|\?|$)(.+?)?:(\d+)(\]|$)/)
      if (match) {
        const filePathWithParams = match[1]
        const fileName =
          filePathWithParams.split('/').pop() || filePathWithParams
        // Remove query parameters
        const cleanFileName = fileName.split('?')[0]
        const lineNumber = match[4]
        return `${cleanFileName}:${lineNumber}`
      }

      // Try standard Node.js/browser formats as fallback
      match = callerLine.match(/at\s+.+\s+\((.+):(\d+):(\d+)\)/)
      if (!match) {
        match = callerLine.match(/at\s+(.+):(\d+):(\d+)/)
      }

      if (match) {
        const [, pathOrFile, lineNumber] = match
        // Extract just the filename from the path
        let fileName = pathOrFile.split('/').pop() || pathOrFile
        // Remove query parameters
        fileName = fileName.split('?')[0]
        return `${fileName}:${lineNumber}`
      }

      return 'unknown:0'
    } catch (e) {
      return 'unknown:0'
    }
  }

  private format(level: string, color: string | null, args: any[]): any[] {
    const fileInfo = this.getFileInfo()
    const fileInfoFormatted = `[${fileInfo}]`

    if (!this.options.colors || !color) {
      // Without colors
      if (typeof args[0] === 'string') {
        return [` ${level} ${fileInfoFormatted}: ${args[0]}`, ...args.slice(1)]
      }
      return [`${fileInfoFormatted} ${level}:`, ...args]
    }

    // With colors - just color the fileInfo part
    if (typeof args[0] === 'string') {
      return [
        `%c${level} ${fileInfoFormatted}%c : ${args[0]}`,
        color,
        this.colors.reset,
        ...args.slice(1),
      ]
    }
    return [
      `%c ${level} ${fileInfoFormatted}%c :`,
      color,
      this.colors.reset,
      ...args,
    ]
  }

  info(...args: any[]): void {
    if (
      !this.options.enabled ||
      (this.options.level ?? LogLevel.DEBUG) < LogLevel.INFO
    )
      return
    console.info(...this.format('INFO', null, args)) // No color for info
  }

  warn(...args: any[]): void {
    if (
      !this.options.enabled ||
      (this.options.level ?? LogLevel.DEBUG) < LogLevel.WARN
    )
      return
    console.warn(...this.format('WARN', this.colors.yellow, args))
  }

  error(...args: any[]): void {
    if (
      !this.options.enabled ||
      (this.options.level ?? LogLevel.DEBUG) < LogLevel.ERROR
    )
      return
    console.error(...this.format('ERROR', this.colors.red, args))
  }

  debug(...args: any[]): void {
    if (
      !this.options.enabled ||
      (this.options.level ?? LogLevel.DEBUG) < LogLevel.DEBUG
    )
      return
    console.debug(...this.format('DEBUG', this.colors.blue, args))
  }
}

// Export the LogLevel enum so it can be used by importers
export { LogLevel }

// Create a singleton instance
const logger = new Logger()

export default logger
