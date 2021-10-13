
type CurrentTimestamp = number
type DurationInMilliseconds = number | null

const stopwatchesMap = new Map<string, number[]>()
const clearingTimeoutsMap = new Map<string, NodeJS.Timeout>()

/**
 * Push the current timestamp to
 * the given stopwatch
 */
function addTimestamp(label: string) {
  const now = Date.now()
  stopwatchesMap.get(label)?.push(now)
  return now
}

/**
 * Create a stopwatch with the given label
 */
function start(label: string): CurrentTimestamp {
  const existingTimeout = clearingTimeoutsMap.get(label)
  existingTimeout && clearTimeout(existingTimeout)
  stopwatchesMap.set(label, [])
  return addTimestamp(label)
}

/**
 * Clear the stopwatch with the given label
 */
function stop(label: string): CurrentTimestamp {
  const TIMEOUT = 60 * 60 * 1000 // 1 hour
  clearingTimeoutsMap.set(label, setTimeout(() => {
    stopwatchesMap.delete(label)
    clearingTimeoutsMap.delete(label)
  }, TIMEOUT))
  return addTimestamp(label)
}

/**
 * Return the duration in milliseconds
 */
function get(label: string): DurationInMilliseconds {
  const timestamps = stopwatchesMap.get(label)

  if (!timestamps) {
    return null
  }

  const begin = timestamps[0]
  const end = timestamps[timestamps.length - 1]

  return end - begin
}

export default {
  start,
  stop,
  get,
}
