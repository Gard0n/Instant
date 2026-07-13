import { useCallback, useEffect, useRef, useState } from 'react'

export type FacingMode = 'user' | 'environment'
export type CameraStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [videoReady, setVideoReady] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }, [])

  const startStream = useCallback(
    async (mode: FacingMode) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        return
      }

      setStatus('requesting')
      setVideoReady(false)
      stopStream()

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1920 }, height: { ideal: 1920 } },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => setVideoReady(true)
        }
        setStatus('granted')
      } catch {
        setStatus('denied')
      }
    },
    [stopStream],
  )

  useEffect(() => {
    startStream(facingMode)
    return stopStream
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode])

  const flipCamera = useCallback(() => {
    setFacingMode((mode) => (mode === 'user' ? 'environment' : 'user'))
  }, [])

  const retry = useCallback(() => startStream(facingMode), [startStream, facingMode])

  return { videoRef, status, facingMode, videoReady, flipCamera, retry }
}
