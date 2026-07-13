import { useEffect, useState } from 'react'

interface Countdown {
  isPast: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
}

function computeCountdown(target: string): Countdown {
  const diffMs = new Date(target).getTime() - Date.now()

  if (diffMs <= 0) {
    return { isPast: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const totalSeconds = Math.floor(diffMs / 1000)
  return {
    isPast: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function useCountdown(target: string): Countdown {
  const [countdown, setCountdown] = useState(() => computeCountdown(target))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(computeCountdown(target))
    }, 1000)

    return () => clearInterval(interval)
  }, [target])

  return countdown
}
