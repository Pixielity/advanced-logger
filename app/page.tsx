"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  textFormatter,
  jsonFormatter,
  prettyFormatter,
  simpleFormatter,
  MemoryTransport,
  type Logger,
  loggerManager,
  addToGlobalContext,
  clearGlobalContext,
} from "@/lib/logger"

export default function Home() {
  const [logs, setLogs] = useState<string[]>([])
  // Create a client-side logger instance that we can modify
  const [clientLogger, setClientLogger] = useState<Logger | null>(null)
  const [memoryTransport, setMemoryTransport] = useState<MemoryTransport | null>(null)

  // Initialize the client logger once the component mounts
  useEffect(() => {
    // Create a memory transport to capture logs for display
    const transport = new MemoryTransport({ maxLogs: 100 })
    setMemoryTransport(transport)

    // Set some global context
    addToGlobalContext({ app: "NextJS Logger Demo", environment: "browser" })

    // Create a new logger instance using the manager
    const newLogger = loggerManager.createMemoryDriver({
      prefix: "Client",
      formatter: textFormatter,
    })
    setClientLogger(newLogger)

    // Log something when the page loads
    newLogger.info("Home page mounted", { timestamp: Date.now() })
    setLogs((prev) => [...prev, `[INFO] ${new Date().toISOString()} - Home page mounted`])

    // Cleanup
    return () => {
      clearGlobalContext()
    }
  }, [])

  // Update the logs display when memory transport changes
  useEffect(() => {
    if (!memoryTransport) return

    const updateLogs = async () => {
      const storedLogs = await memoryTransport.getLogs()
      setLogs(storedLogs.map((log) => log.message))
    }

    updateLogs()
  }, [memoryTransport])

  const handleInfoLog = () => {
    if (!clientLogger) return

    clientLogger.info("Info button clicked", {
      action: "click",
      component: "InfoButton",
    })
    updateLogsFromTransport()
  }

  const handleWarnLog = () => {
    if (!clientLogger) return

    clientLogger.warn("This is a warning", {
      severity: "medium",
      code: "WARN001",
    })
    updateLogsFromTransport()
  }

  const handleErrorLog = () => {
    if (!clientLogger) return

    clientLogger.error("This is an error", {
      error: "Sample error",
      code: "ERR001",
      details: {
        component: "ErrorButton",
        recoverable: true,
      },
    })
    updateLogsFromTransport()
  }

  const handleWithContext = () => {
    if (!clientLogger) return

    // Create a new logger with context
    const contextLogger = clientLogger.withContext({
      user: { id: 123, name: "Test User" },
      session: "abc-123",
    })

    contextLogger.info("Log with context")
    updateLogsFromTransport()
  }

  const handleWithoutContext = () => {
    if (!clientLogger) return

    // Create a logger with context first
    const contextLogger = clientLogger.withContext({
      user: { id: 123, name: "Test User" },
      session: "abc-123",
      requestId: "req-456",
    })

    // Then create a new logger without specific context keys
    const reducedContextLogger = contextLogger.withoutContext(["requestId"])

    reducedContextLogger.info("Log with reduced context")
    updateLogsFromTransport()
  }

  const handleChangeFormatter = (formatterName: string) => {
    if (!clientLogger) return

    switch (formatterName) {
      case "text":
        clientLogger.setFormatter(textFormatter)
        break
      case "json":
        clientLogger.setFormatter(jsonFormatter)
        break
      case "pretty":
        clientLogger.setFormatter(prettyFormatter)
        break
      case "simple":
        clientLogger.setFormatter(simpleFormatter)
        break
    }

    // Log something to demonstrate the new formatter
    clientLogger.info("Formatter changed", {
      formatter: formatterName,
      timestamp: Date.now(),
    })

    updateLogsFromTransport()
  }

  const updateLogsFromTransport = async () => {
    if (!memoryTransport) return

    const storedLogs = await memoryTransport.getLogs()
    setLogs(storedLogs.map((log) => log.message))
  }

  const clearLogs = async () => {
    if (!memoryTransport) return

    await memoryTransport.clear()
    setLogs([])
  }

  if (!clientLogger) {
    return <div className="flex min-h-screen items-center justify-center">Loading logger...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Next.js with Advanced Logger</CardTitle>
          <CardDescription>A demonstration of a flexible logger utility with multiple transports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={handleInfoLog}>Log Info</Button>
              <Button onClick={handleWarnLog} variant="outline">
                Log Warning
              </Button>
              <Button onClick={handleErrorLog} variant="destructive">
                Log Error
              </Button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Context Operations:</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleWithContext} variant="secondary" size="sm">
                  With Context
                </Button>
                <Button onClick={handleWithoutContext} variant="secondary" size="sm">
                  Without Context
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Change Formatter:</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleChangeFormatter("text")} variant="secondary" size="sm">
                  Text
                </Button>
                <Button onClick={() => handleChangeFormatter("json")} variant="secondary" size="sm">
                  JSON
                </Button>
                <Button onClick={() => handleChangeFormatter("pretty")} variant="secondary" size="sm">
                  Pretty
                </Button>
                <Button onClick={() => handleChangeFormatter("simple")} variant="secondary" size="sm">
                  Simple
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Log Output:</h3>
                <Button onClick={clearLogs} variant="outline" size="sm">
                  Clear Logs
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">No logs yet. Click a button above to generate logs.</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="w-full text-center">
            This logger demo uses the LoggerManager to create and manage logger instances
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
