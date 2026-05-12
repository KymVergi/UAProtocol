'use client'

import { useState } from 'react'
import styles from './SwapInterface.module.css'

export function SwapInterface() {
  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')
  const [isBuy, setIsBuy] = useState(true)

  const handleSwap = () => {
    console.log('Swap:', { amountIn, amountOut, isBuy })
    // TODO: Implement actual swap logic with wagmi
  }

  const switchDirection = () => {
    setIsBuy(!isBuy)
    setAmountIn(amountOut)
    setAmountOut(amountIn)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>SWAP INTERFACE</span>
        <span className={styles.status}>● ONLINE</span>
      </div>

      <div className={styles.swapBox}>
        {/* From */}
        <div className={styles.inputGroup}>
          <div className={styles.inputHeader}>
            <span>FROM</span>
            <span className={styles.balance}>BALANCE: 0.00</span>
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              className={styles.input}
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
            />
            <div className={styles.token}>
              {isBuy ? 'ETH' : 'UAP'}
            </div>
          </div>
        </div>

        {/* Switch */}
        <button className={styles.switchBtn} onClick={switchDirection}>
          ⇅
        </button>

        {/* To */}
        <div className={styles.inputGroup}>
          <div className={styles.inputHeader}>
            <span>TO</span>
            <span className={styles.balance}>~</span>
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              className={styles.input}
              placeholder="0.0"
              value={amountOut}
              readOnly
            />
            <div className={styles.token}>
              {isBuy ? 'UAP' : 'ETH'}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span>FEE:</span>
            <span>0.3%</span>
          </div>
          <div className={styles.detailRow}>
            <span>SLIPPAGE:</span>
            <span>0.5%</span>
          </div>
        </div>

        {/* Swap Button */}
        <button className={styles.swapBtn} onClick={handleSwap}>
          {isBuy ? 'BUY UAP' : 'SELL UAP'}
        </button>
      </div>
    </div>
  )
}
