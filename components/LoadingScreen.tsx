'use client'

import { useState, useEffect } from 'react'
import styles from './LoadingScreen.module.css'

interface LoadingScreenProps {
  onComplete: () => void
  audioRef?: React.RefObject<HTMLAudioElement> // NUEVO
}

export function LoadingScreen({ onComplete, audioRef }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [canStart, setCanStart] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setCanStart(true)
          return 100
        }
        return prev + 2
      })
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const handleStart = () => {
    // NUEVO: Activar audio cuando hace click
    if (audioRef?.current) {
      audioRef.current.volume = 0.2
      audioRef.current.play()
        .then(() => console.log('✓ Audio playing'))
        .catch(e => console.error('Audio error:', e))
    }
    onComplete()
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>UAP TERMINAL • X-77</h1>
        
        <div className={styles.loader}>
          <div className={styles.loaderFill} style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.status}>
          INITIALIZING SYSTEMS... {progress}%
        </div>

        {canStart && (
          <button className={styles.startBtn} onClick={handleStart}>
            ▶ START SYSTEM
            <div className={styles.hint}>[AUDIO WILL ACTIVATE]</div>
          </button>
        )}

        <div className={styles.warning}>
          ⚠ CLASSIFIED // UNAUTHORIZED ACCESS PROHIBITED ⚠
        </div>
      </div>
    </div>
  )
}
