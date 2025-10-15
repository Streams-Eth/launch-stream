"use client"

import { useState, useEffect, useRef } from "react"
import { ethers } from "ethers"

interface Web3State {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
}

interface NetworkConfig {
  chainId: number
  name: string
  rpcUrl: string
  blockExplorer: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

export const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  1: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://etherscan.io",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  },
  56: {
    chainId: 56,
    name: "BSC Mainnet",
    rpcUrl: "https://bsc-dataseed1.binance.org",
    blockExplorer: "https://bscscan.com",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  },
  11155111: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
    blockExplorer: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  },
  97: {
    chainId: 97,
    name: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
    blockExplorer: "https://testnet.bscscan.com",
    nativeCurrency: { name: "BNB", symbol: "tBNB", decimals: 18 },
  },
}

let globalWalletState: Web3State | null = null
let globalConnectionPromise: Promise<Web3State | null> | null = null
const globalLastAttempt = 0
const globalIsInitialized = false
const globalIsPending = false
const CONNECTION_COOLDOWN = 3000
const subscribers = new Set<(state: Web3State) => void>()

function subscribeToGlobalState(callback: (state: Web3State) => void) {
  subscribers.add(callback)
  return () => subscribers.delete(callback)
}

function updateGlobalState(newState: Web3State) {
  globalWalletState = newState
  subscribers.forEach((callback) => callback(newState))
}

let globalConnectionInProgress = false
let globalConnectionQueue: Array<{
  resolve: (value: Web3State | null) => void
  reject: (error: any) => void
}> = []
const globalMetaMaskPending = false

function processConnectionQueue(result: Web3State | null, error?: any) {
  const queue = [...globalConnectionQueue]
  globalConnectionQueue = []

  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(result)
    }
  })
}

function useWalletCore() {
  const [web3State, setWeb3State] = useState<Web3State>(() => {
    return (
      globalWalletState || {
        isConnected: false,
        address: null,
        balance: null,
        chainId: null,
        provider: null,
        signer: null,
      }
    )
  })

  const [isConnecting, setIsConnecting] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    const unsubscribe = subscribeToGlobalState((newState) => {
      if (mountedRef.current) {
        setWeb3State(newState)
      }
    })
    return unsubscribe
  }, [])

  const connectWallet = async (): Promise<Web3State | null> => {
    console.log("[v0] Starting wallet connection...")

    if (globalWalletState?.isConnected) {
      console.log("[v0] Already connected, returning existing state")
      return globalWalletState
    }

    if (globalConnectionInProgress) {
      console.log("[v0] Connection already in progress, queuing request...")
      return new Promise((resolve, reject) => {
        globalConnectionQueue.push({ resolve, reject })
      })
    }

    if (!window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet!")
      return null
    }

    globalConnectionInProgress = true
    setIsConnecting(true)

    try {
      console.log("[v0] Checking existing accounts...")

      let accounts: string[] = []
      try {
        accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
      } catch (error) {
        console.log("[v0] Failed to check existing accounts:", error)
      }

      if (!accounts || accounts.length === 0) {
        console.log("[v0] No existing accounts, requesting permission...")
        try {
          accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          })
        } catch (error: any) {
          if (error.code === 4001) {
            console.log("[v0] User rejected connection")
            processConnectionQueue(null)
            return null
          }
          if (error.code === -32002 || error.message?.includes("already pending")) {
            console.log("[v0] Request already pending, please wait for the existing request to complete")
            throw new Error(
              "A wallet connection request is already pending. Please check MetaMask and approve or reject the existing request, then try again.",
            )
          }
          throw new Error(`Failed to connect wallet: ${error.message || "Unknown error"}`)
        }
      } else {
        console.log("[v0] Using existing accounts:", accounts.length)
      }

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts available. Please make sure your wallet is unlocked and try again.")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const balance = await provider.getBalance(address)
      const network = await provider.getNetwork()

      const formattedBalance = ethers.formatEther(balance)

      const newState: Web3State = {
        isConnected: true,
        address,
        balance: Number.parseFloat(formattedBalance).toFixed(4),
        chainId: Number(network.chainId),
        provider,
        signer,
      }

      updateGlobalState(newState)
      localStorage.setItem("walletConnected", "true")
      console.log("[v0] Wallet connected successfully")

      processConnectionQueue(newState)
      return newState
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)

      const disconnectedState: Web3State = {
        isConnected: false,
        address: null,
        balance: null,
        chainId: null,
        provider: null,
        signer: null,
      }

      updateGlobalState(disconnectedState)

      if (error.code === -32002 || error.message?.includes("already pending")) {
        // Don't show alert for pending requests, let the error bubble up with clear message
      } else if (!error.message?.includes("User rejected") && !error.message?.includes("already pending")) {
        alert("Failed to connect wallet. Please try again.")
      }

      processConnectionQueue(null, error)
      throw error // Re-throw to let the calling component handle it
    } finally {
      globalConnectionInProgress = false
      if (mountedRef.current) {
        setIsConnecting(false)
      }
    }
  }

  const disconnectWallet = () => {
    globalConnectionPromise = null

    const disconnectedState: Web3State = {
      isConnected: false,
      address: null,
      balance: null,
      chainId: null,
      provider: null,
      signer: null,
    }

    updateGlobalState(disconnectedState)
    localStorage.removeItem("walletConnected")
  }

  const switchNetwork = async (chainId: number) => {
    if (!window.ethereum) return

    const network = SUPPORTED_NETWORKS[chainId]
    if (!network) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                blockExplorerUrls: [network.blockExplorer],
                nativeCurrency: network.nativeCurrency,
              },
            ],
          })
        } catch (addError) {
          console.error("Failed to add network:", addError)
        }
      }
    }
  }

  useEffect(() => {
    if (!window.ethereum) return

    let accountChangeTimeout: NodeJS.Timeout
    let chainChangeTimeout: NodeJS.Timeout

    const handleAccountsChanged = (accounts: string[]) => {
      clearTimeout(accountChangeTimeout)
      accountChangeTimeout = setTimeout(async () => {
        if (!mountedRef.current) return

        if (accounts.length === 0) {
          disconnectWallet()
        }
      }, 1000)
    }

    const handleChainChanged = () => {
      clearTimeout(chainChangeTimeout)
      chainChangeTimeout = setTimeout(async () => {
        if (mountedRef.current && globalWalletState?.isConnected) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const network = await provider.getNetwork()
            const updatedState = {
              ...globalWalletState,
              chainId: Number(network.chainId),
              provider,
            }
            updateGlobalState(updatedState)
          } catch (error) {
            console.log("[v0] Failed to update chain info:", error)
          }
        }
      }, 1000)
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      clearTimeout(accountChangeTimeout)
      clearTimeout(chainChangeTimeout)
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    ...web3State,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    currentNetwork: web3State.chainId ? SUPPORTED_NETWORKS[web3State.chainId] : null,
  }
}

export const useWeb3 = useWalletCore
export const useWallet = useWalletCore

declare global {
  interface Window {
    ethereum?: any
  }
}
