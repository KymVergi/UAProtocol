'use client'

import styles from './GifStickers.module.css'

const STICKERS = [
  { 
    url: '/gifs/gif1.gif', 
    label: 'MAIN FEED',
    position: 'topLeft',
    rotation: -15 
  },
  { 
    url: '/gifs/gif2.gif', 
    label: 'RADAR-47',
    position: 'bottomLeft',
    rotation: 12 
  },
  { 
    url: '/gifs/gif3.gif', 
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