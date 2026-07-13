import { useCallback, useEffect, useRef, useState } from 'react'

export type FacingMode = 'user' | 'environment'
export type CameraStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [videoReady, setVideoReady] = useState(false)

  const attachStreamToVideo = useCallback((video: HTMLVideoElement) => {
    if (!streamRef.current) return
    video.srcObject = streamRef.current
    video.onloadedmetadata = () => setVideoReady(true)
    // Safari n'enclenche pas toujours la lecture depuis l'attribut autoPlay
    // quand srcObject est assigné dynamiquement : il faut l'appeler explicitement.
    video.play().catch(() => {})
  }, [])

  // Ref en callback plutôt qu'un simple useRef : le composant CameraView ne monte
  // le <video> qu'une fois le statut 'granted', donc au moment où le flux getUserMedia
  // se résout, l'élément DOM n'existe pas encore et une simple assignation échouerait
  // silencieusement. Cette callback attache le flux dès que l'élément apparaît,
  // peu importe lequel (flux ou DOM) est prêt en premier.
  const setVideoNode = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node
      if (node) {
        attachStreamToVideo(node)
      }
    },
    [attachStreamToVideo],
  )

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
          attachStreamToVideo(videoRef.current)
        }
        setStatus('granted')
      } catch {
        setStatus('denied')
      }
    },
    [stopStream, attachStreamToVideo],
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

  return { videoRef, setVideoNode, status, facingMode, videoReady, flipCamera, retry }
}
