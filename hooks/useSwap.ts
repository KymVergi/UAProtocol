'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACTS, POOL_MANAGER_ABI, ERC20_ABI } from '@/lib/contracts'
import { UAP_POOL_KEY } from '@/lib/poolKey'

export function useSwap() {
  const [amount, setAmount] = useState('')
  const [estimatedOutput, setEstimatedOutput] = useState('0')
  
  const { writeContract: swap, data: swapHash, isPending: isSwapping } = useWriteContract()
  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract()
  
  const { isLoading: isSwapConfirming, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({ hash: swapHash })
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })

  const buyUAP = async (amountETH: string) => {
    if (!amountETH || parseFloat(amountETH) <= 0) {
      throw new Error('Invalid amount')
    }

    try {
      await swap({
        address: CONTRACTS.POOL_MANAGER as `0x${string}`,
        abi: POOL_MANAGER_ABI,
        functionName: 'swap',
        args: [
          {
            currency0: UAP_POOL_KEY.currency0 as `0x${string}`,
            currency1: UAP_POOL_KEY.currency1 as `0x${string}`,
            fee: UAP_POOL_KEY.fee,
            tickSpacing: UAP_POOL_KEY.tickSpacing,
            hooks: UAP_POOL_KEY.hooks as `0x${string}`,
          },
          {
            zeroForOne: true,
            amountSpecified: parseEther(amountETH),
            sqrtPriceLimitX96: 0n,
          },
          '0x' as `0x${string}`,
        ],
        value: parseEther(amountETH),
      })
    } catch (error) {
      console.error('Buy failed:', error)
      throw error
    }
  }

  const sellUAP = async (amountUAP: string) => {
    if (!amountUAP || parseFloat(amountUAP) <= 0) {
      throw new Error('Invalid amount')
    }

    try {
      const amountBigInt = parseEther(amountUAP)
      
      await swap({
        address: CONTRACTS.POOL_MANAGER as `0x${string}`,
        abi: POOL_MANAGER_ABI,
        functionName: 'swap',
        args: [
          {
            currency0: UAP_POOL_KEY.currency0 as `0x${string}`,
            currency1: UAP_POOL_KEY.currency1 as `0x${string}`,
            fee: UAP_POOL_KEY.fee,
            tickSpacing: UAP_POOL_KEY.tickSpacing,
            hooks: UAP_POOL_KEY.hooks as `0x${string}`,
          },
          {
            zeroForOne: false,
            amountSpecified: -amountBigInt,
            sqrtPriceLimitX96: BigInt('1461446703485210103287273052203988822378723970342'),
          },
          '0x' as `0x${string}`,
        ],
      })
    } catch (error) {
      console.error('Sell failed:', error)
      throw error
    }
  }

  const approveUAP = async (amountUAP: string) => {
    try {
      await approve({
        address: CONTRACTS.UAP_TOKEN as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [
          CONTRACTS.POOL_MANAGER as `0x${string}`,
          parseEther(amountUAP),
        ],
      })
    } catch (error) {
      console.error('Approve failed:', error)
      throw error
    }
  }

  const estimateOutput = (inputAmount: string, isBuy: boolean) => {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      setEstimatedOutput('0')
      return
    }

    const rate = isBuy ? 1000 : 0.001
    const output = (parseFloat(inputAmount) * rate).toFixed(4)
    setEstimatedOutput(output)
  }

  return {
    amount,
    setAmount,
    estimatedOutput,
    estimateOutput,
    buyUAP,
    sellUAP,
    approveUAP,
    isSwapping: isSwapping || isSwapConfirming,
    isApproving: isApproving || isApproveConfirming,
    isSwapSuccess,
    isApproveSuccess,
    swapHash,
    approveHash,
  }
}