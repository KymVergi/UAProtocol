'use client'

import styles from './GifStickers.module.css'

const STICKERS = [
  { 
    url: '/gifs/ufo.gif', 
    label: 'MAIN FEED',
    position: 'topLeft',
    rotation: -15 
  },
  { 
    url: '/gifs/radar.gif', 
    label: 'RADAR-47',
    position: 'bottomLeft',
    rotation: 12 
  },
  { 
    url: '/gifs/signal.gif', 
    label: 'SAT-X77',
    position: 'topRight',
    rotation: 15 
  },
]

export function GifStickers() {
  return (
    <>
      {STICKERS.map((sticker, i) => (
        <div 
          key={i}
          className={`${styles.sticker} ${styles[sticker.position]}`}
          style={{ transform: `rotate(${sticker.rotation}deg)` }}
        >
          <div className={styles.stickerFrame}>
            <img 
              src={sticker.url} 
              alt={sticker.label}
              className={styles.gif}
            />
          </div>
          <div className={styles.stickerLabel}>
            {sticker.label}
          </div>
        </div>
      ))}
    </>
  )
}