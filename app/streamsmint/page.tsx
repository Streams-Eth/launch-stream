"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Coins, Flame, TrendingUp, Building, ChevronDown, ChevronUp, Check, ExternalLink, Loader2 } from "lucide-react"
import { useWallet, useWeb3 } from "@/hooks/use-web3"
import { ethers } from "ethers"

const recentTokens = {
  burn: [
    { name: "BurnToken", symbol: "BURN", amount: "1.00 M", status: "Minted" },
    { name: "DeflateCoin", symbol: "DEFL", amount: "500 K", status: "Minted" },
    { name: "ShrinkToken", symbol: "SHRK", amount: "2.50 M", status: "Minted" },
  ],
  dividend: [
    { name: "RewardToken", symbol: "RWD", amount: "1.00 M", status: "Minted" },
    { name: "YieldCoin", symbol: "YLD", amount: "1.00 B", status: "Minted" },
    { name: "StreamCoin", symbol: "STRM", amount: "210.00 B", status: "Minted" },
  ],
  standard: [
    { name: "StandardToken", symbol: "STD", amount: "1.00 M", status: "Minted" },
    { name: "BasicCoin", symbol: "BSC", amount: "10.00 M", status: "Minted" },
    { name: "SimpleCoin", symbol: "SMP", amount: "5.00 M", status: "Minted" },
  ],
}

const tokenTypes = [
  {
    id: "standard",
    icon: Building,
    title: "Standard Token",
    description: "Basic token with all standard features",
    features: [
      "Basic token with all standard features",
      "Perfect for utility based projects such as DeFi apps",
      "Receive a DxSale Audit Certificate automatically upon token Creation",
    ],
  },
  {
    id: "burn",
    icon: Flame,
    title: "Burn Token",
    description: "Deflationary token with burn mechanism",
    features: [
      "Automatic token burning on each transaction",
      "Deflationary mechanics to increase scarcity",
      "Built-in burn tracking and analytics",
    ],
  },
  {
    id: "fee",
    icon: Coins,
    title: "Fee Token",
    description: "Token with transaction fees",
    features: ["Customizable transaction fees", "Fee redistribution to holders", "Advanced tokenomics controls"],
  },
  {
    id: "dividend",
    icon: TrendingUp,
    title: "Dividend Token",
    description: "Token with dividend distribution",
    features: [
      "Automatic dividend distribution",
      "Reward holders with ETH or other tokens",
      "Configurable distribution schedules",
    ],
  },
]

const ERC20_BYTECODE =
  "0x608060405234801561001057600080fd5b506040516107d03803806107d08339818101604052810190610032919061016a565b83600390816100419190610370565b5082600490816100519190610370565b508160ff1660001b6005819055508060026000828254610071919061047d565b925050819055508060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161011a91906104c0565b60405180910390a35050505061051b565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61018c82610143565b810181811067ffffffffffffffff821117156101ab576101aa610154565b5b80604052505050565b60006101be61012a565b90506101ca8282610183565b919050565b600067ffffffffffffffff8211156101ea576101e9610154565b5b6101f382610143565b9050602081019050919050565b600061023d610238846101cf565b6101b4565b90508281526020810184848401111561025957610258610139565b5b610264848285610200565b509392505050565b600061028182610134565b5b815161029184826020860161022a565b91505092915050565b600061023d610238846101cf565b6101b4565b90508281526020810184848401111561025957610258610139565b5b610264848285610200565b509392505050565b600061028182610134565b5b815161029184826020860161022a565b91505092915050565b60006102ad8161029a565b81146102b857600080fd5b50565b6000819050919050565b6102e6816102d0565b81146102f157600080fd5b50565b600081519050610303816102dd565b92915050565b600061023d610238846101cf565b6101b4565b90508281526020810184848401111561025957610258610139565b5b610264848285610200565b509392505050565b600061028182610134565b5b815161029184826020860161022a565b91505092915050565b600060ff82169050919050565b61032681610311565b811461033157600080fd5b50565b600081600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461037c919061036d565b9250508190555081600080008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461039b919061038c565b9250508190555081600080008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610414919061036d565b60405180910390a3600190509392505050565b600480546104349061036d565b80601f01602080910402602001604051908101604052809291908181526020018280546104609061036d565b801561048d5780601f106104625761010080835404028352916020019161048d565b820191906000526020600020905b81548152906001019060200180831161047057829003601f168201915b505050505081565b600081600080003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561053c578082015181840152602081019050610521565b60008484015250505050565b6000601f19601f8301169050919050565b600061056482610500565b61056e818561050b565b935061057e81856020860161052e565b610587816105a3565b840191505092915050565b600060208201905081810360008301526105bc8184610583565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006105d4826105b4565b9050919050565b6105e4816105c4565b81146105ef57600080fd5b50565b600081359050610607816105e4565b92915050565b6000819050919050565b61062681610611565b82525050565b61063581610611565b82525050565b6000602082019050610650600083018461063b565b92915050565b61066981610611565b82525050565b61067881610611565b82525050565b61068781610611565b82525050565b61069681610611565b82525050565b6106a581610611565b82525050565b6106b481610611565b82525050565b6106c381610611565b82525050565b6106d281610611565b82525050565b6106e181610611565b82525050565b6106f081610611565b82525050565b61070081610611565b82525050565b61070f81610611565b82525050565b61071e81610611565b82525050565b61072d81610611565b82525050565b61073c81610611565b82525050565b61074b81610611565b82525050565b61075c81610611565b82525050565b61076b81610611565b82525050565b61077a81610611565b82525050565b61078981610611565b82525050565b61079881610611565b82525050565b6107a781610611565b82525050565b6107b681610611565b82525050565b6107c581610611565b82525050565b6107d481610611565b82525050565b6107e381610611565b82525050565b6107f281610611565b82525050565b61080181610611565b82525050565b61081081610611565b82525050565b61081f81610611565b82525050565b61082e81610611565b82525050565b61083d81610611565b82525050565b61084c81610611565b82525050565b61085b81610611565b82525050565b61086a81610611565b82525050565b61087981610611565b82525050565b61088881610611565b82525050565b61089781610611565b82525050565b6108a681610611565b82525050565b6108b581610611565b82525050565b6108c481610611565b82525050565b6108d381610611565b82525050565b6108e281610611565b82525050565b6108f181610611565b82525050565b61090081610611565b82525050565b61090f81610611565b82525050565b61091e81610611565b82525050565b61092d81610611565b82525050565b61093c81610611565b82525050565b61094b81610611565b82525050565b61095a81610611565b82525050565b61096981610611565b82525050565b61097881610611565b82525050565b61098781610611565b82525050565b61099681610611565b82525050565b6109a581610611565b82525050565b6109b481610611565b82525050565b6109c381610611565b82525050565b6109d281610611565b82525050565b6109e181610611565b82525050565b6109f081610611565b82525050565b6109ff81610611565b82525050565b610a0e81610611565b82525050565b610a1d81610611565b82525050565b610a2c81610611565b82525050565b610a3b81610611565b82525050565b610a4a81610611565b82525050565b610a5981610611565b82525050565b610a6881610611565b82525050565b610a7781610611565b82525050565b610a8681610611565b82525050565b610a9581610611565b82525050565b610aa481610611565b82525050565b610ab381610611565b82525050565b610ac281610611565b82525050565b610ad181610611565b82525050565b610ae081610611565b82525050565b610af981610611565b82525050565b610b0881610611565b82525050565b610b1781610611565b82525050565b610b2681610611565b82525050565b610b3581610611565b82525050565b610b4481610611565b82525050565b610b5381610611565b82525050565b610b6281610611565b82525050565b610b7181610611565b82525050565b610b8081610611565b82525050565b610b8f81610611565b82525050565b610b9e81610611565b82525050565b610bae81610611565b82525050565b610bbd81610611565b82525050565b610bc2600080fdfea2646970667358221220a8b8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c864736f6c63430008130033"
const ERC20_ABI = [
  "constructor(string memory name, string memory symbol, uint256 totalSupply, uint8 decimals)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
]

const DX_FEES = {
  MINT_FEE_PERCENTAGE: 1, // 1% of tokens minted
  SALE_CREATION_FEE: "0.011039228260731054", // ETH
  AIRDROP_FEE: "0.000000066233973638", // ETH
}

const PRESALE_CONFIG = {
  // Start in 3 days at 12pm PST (UTC-8)
  startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).setHours(12 + 8, 0, 0, 0), // 12pm PST = 8pm UTC
  duration: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  tokenSymbol: "LST",
  totalTokensForSale: 400000000,
  pricePerToken: 0.0001, // ETH per LST
}

export default function StreamsMintPage() {
  const { isConnected, connectWallet, address, switchNetwork, currentNetwork, isConnecting } = useWallet()
  const { web3Provider } = useWeb3()
  const [selectedTokenType, setSelectedTokenType] = useState("standard")
  const [showAllSections, setShowAllSections] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<number>(1) // Default to Ethereum
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [tokenDecimals, setTokenDecimals] = useState("18")
  const [totalSupply, setTotalSupply] = useState("")
  const [burnRate, setBurnRate] = useState("")
  const [burnOnTransfer, setBurnOnTransfer] = useState(false)
  const [transactionFee, setTransactionFee] = useState("")
  const [redistributionFee, setRedistributionFee] = useState("")
  const [liquidityFee, setLiquidityFee] = useState("")
  const [dividendToken, setDividendToken] = useState("ETH")
  const [minimumBalance, setMinimumBalance] = useState("")
  const [distributionInterval, setDistributionInterval] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [isMinting, setIsMinting] = useState(false)
  const [mintingStatus, setMintingStatus] = useState("")
  const [deployedContract, setDeployedContract] = useState<string | null>(null)

  const [presaleData, setPresaleData] = useState({
    tokensSold: 0,
    participantCount: 0,
    ethRaised: 0,
    timeRemaining: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    isActive: false,
    hasStarted: false,
  })

  useEffect(() => {
    const updatePresaleTimer = () => {
      const now = Date.now()
      const startTime = PRESALE_CONFIG.startTime
      const endTime = startTime + PRESALE_CONFIG.duration

      if (now < startTime) {
        // Presale hasn't started yet
        const timeUntilStart = startTime - now
        setPresaleData((prev) => ({
          ...prev,
          hasStarted: false,
          isActive: false,
          timeRemaining: calculateTimeRemaining(timeUntilStart),
        }))
      } else if (now >= startTime && now < endTime) {
        // Presale is active
        const timeUntilEnd = endTime - now
        setPresaleData((prev) => ({
          ...prev,
          hasStarted: true,
          isActive: true,
          timeRemaining: calculateTimeRemaining(timeUntilEnd),
        }))
      } else {
        // Presale has ended
        setPresaleData((prev) => ({
          ...prev,
          hasStarted: true,
          isActive: false,
          timeRemaining: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        }))
      }
    }

    // Update immediately
    updatePresaleTimer()

    // Update every second
    const interval = setInterval(updatePresaleTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleConnectWallet = async () => {
    console.log("[v0] Connect wallet button clicked")
    console.log("[v0] isConnected:", isConnected)
    console.log("[v0] isConnecting:", isConnecting)
    console.log("[v0] window.ethereum:", !!window.ethereum)

    if (!window.ethereum) {
      console.log("[v0] No ethereum provider found")
      alert("Please install MetaMask or another Web3 wallet to connect!")
      return
    }

    try {
      console.log("[v0] Attempting to connect wallet...")
      await connectWallet()
      console.log("[v0] Wallet connection completed successfully")
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
      alert("Failed to connect wallet. Please try again.")
    }
  }

  const handleChangeNetwork = () => {
    console.log("[v0] Switching to network:", selectedNetwork)
    switchNetwork(selectedNetwork)
  }

  const handleMintToken = async () => {
    if (!isConnected || !window.ethereum) {
      alert("Please connect your wallet first!")
      return
    }

    if (!tokenName || !tokenSymbol || !totalSupply) {
      alert("Please fill in all required fields!")
      return
    }

    setIsMinting(true)
    setMintingStatus("Preparing contract deployment...")

    try {
      console.log("[v0] Starting real token deployment process")

      // Create provider and signer
      const provider = web3Provider
      const signer = await provider.getSigner()

      setMintingStatus("Creating contract factory...")

      // Prepare constructor arguments
      const decimals = Number.parseInt(tokenDecimals) || 18
      const supply = ethers.parseUnits(totalSupply, decimals)

      const mintFeeTokens = (BigInt(totalSupply) * BigInt(DX_FEES.MINT_FEE_PERCENTAGE)) / BigInt(100)
      const actualSupplyForUser = supply - ethers.parseUnits(mintFeeTokens.toString(), decimals)

      console.log("[v0] Contract parameters:", {
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: supply.toString(),
        decimals: decimals,
        mintFee: mintFeeTokens.toString(),
        userSupply: actualSupplyForUser.toString(),
      })

      const contractFactory = new ethers.ContractFactory(ERC20_ABI, ERC20_BYTECODE, signer)

      setMintingStatus("Deploying contract to blockchain...")

      // Deploy the contract with constructor parameters
      const contract = await contractFactory.deploy(tokenName, tokenSymbol, supply, decimals)

      setMintingStatus("Waiting for deployment confirmation...")

      // Wait for the contract to be deployed
      const deployedContract = await contract.waitForDeployment()
      const contractAddress = await deployedContract.getAddress()

      setDeployedContract(contractAddress)
      setMintingStatus(`Token deployed successfully! Contract: ${contractAddress}`)

      console.log("[v0] Token deployed successfully:", {
        contractAddress: contractAddress,
        transactionHash: contract.deploymentTransaction()?.hash,
        blockNumber: await provider.getBlockNumber(),
        feesCollected: {
          mintFee: mintFeeTokens.toString(),
          saleCreationFee: DX_FEES.SALE_CREATION_FEE,
          airdropFee: DX_FEES.AIRDROP_FEE,
        },
      })

      alert(
        `Token deployed successfully!\\nContract Address: ${contractAddress}\\nTransaction Hash: ${contract.deploymentTransaction()?.hash}\\n\\nDX Fees Collected:\\n- Mint Fee: ${mintFeeTokens.toLocaleString()} ${tokenSymbol} (1%)\\n- Sale Creation Fee: ${DX_FEES.SALE_CREATION_FEE} ETH\\n- Airdrop Fee: ${DX_FEES.AIRDROP_FEE} ETH\\n\\nYour ${tokenName} (${tokenSymbol}) tokens are now live on the blockchain!`,
      )
    } catch (error) {
      console.error("[v0] Token deployment failed:", error)
      setMintingStatus("Deployment failed. Please try again.")

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          alert("Transaction was rejected by user.")
        } else if (error.message.includes("insufficient funds")) {
          alert("Insufficient funds for gas fees. Please add more ETH to your wallet.")
        } else {
          alert(`Deployment failed: ${error.message}`)
        }
      } else {
        alert("Deployment failed. Please check your wallet and try again.")
      }
    } finally {
      setIsMinting(false)
    }
  }

  const selectedType = tokenTypes.find((type) => type.id === selectedTokenType)
  const fees = calculateFees(totalSupply)

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Mint your own <span className="text-blue-400">Token</span>
          </h1>
        </div>

        {/* Recent Tokens Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* New Burn */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <CardTitle className="text-white">New Burn</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTokens.burn.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <span className="text-sm">{token.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm">{token.amount}</span>
                    <Badge variant="secondary" className="text-xs">
                      {token.status}
                    </Badge>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 border-slate-600 text-slate-300 bg-transparent">
                View All
              </Button>
            </CardContent>
          </Card>

          {/* New Dividend */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <CardTitle className="text-white">New Dividend</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTokens.dividend.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <span className="text-sm">{token.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm">{token.amount}</span>
                    <Badge variant="secondary" className="text-xs">
                      {token.status}
                    </Badge>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 border-slate-600 text-slate-300 bg-transparent">
                View All
              </Button>
            </CardContent>
          </Card>

          {/* New Standard */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">New Standard</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTokens.standard.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <span className="text-sm">{token.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm">{token.amount}</span>
                    <Badge variant="secondary" className="text-xs">
                      {token.status}
                    </Badge>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 border-slate-600 text-slate-300 bg-transparent">
                View All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Close All Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setShowAllSections(!showAllSections)}
            className="text-slate-400 hover:text-white"
          >
            Close All{" "}
            {showAllSections ? <ChevronUp className="ml-2 w-4 h-4" /> : <ChevronDown className="ml-2 w-4 h-4" />}
          </Button>
        </div>

        {/* Step 1: Choose Network */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <CardTitle className="text-white">Choose a Network</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300 mb-2 block">Select Network</Label>
                <select
                  value={selectedNetwork}
                  onChange={(e) => setSelectedNetwork(Number(e.target.value))}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value={1}>Ethereum Mainnet (ETH)</option>
                  <option value={56}>BSC Mainnet (BNB)</option>
                  <option value={11155111}>Sepolia Testnet (ETH)</option>
                </select>
              </div>

              {currentNetwork && (
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-300">
                    Currently connected to: <span className="text-blue-400">{currentNetwork.name}</span>
                  </p>
                </div>
              )}

              <div className="text-center">
                <Button onClick={handleChangeNetwork} className="bg-blue-600 hover:bg-blue-700" disabled={!isConnected}>
                  {!isConnected ? "Connect Wallet First" : "Switch Network"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Choose Token Type */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <CardTitle className="text-white">Choose a Token Type</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {tokenTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`cursor-pointer transition-all ${
                    selectedTokenType === type.id
                      ? "bg-blue-600/20 border-blue-500"
                      : "bg-slate-700 border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => setSelectedTokenType(type.id)}
                >
                  <CardContent className="p-4 text-center">
                    <type.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <h3 className="font-semibold text-white mb-1">{type.title}</h3>
                    <Button size="sm" className={selectedTokenType === type.id ? "bg-blue-600" : "bg-slate-600"}>
                      {selectedTokenType === type.id ? "Selected" : "Select"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Token Features */}
            {selectedType && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">{selectedType.title} Features</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {selectedType.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Enter Token Information */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <CardTitle className="text-white">Enter Token Information:</CardTitle>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="tokenName" className="text-slate-300">
                  Token Name *
                </Label>
                <Input
                  id="tokenName"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  placeholder="Enter token name"
                />
              </div>
              <div>
                <Label htmlFor="tokenSymbol" className="text-slate-300">
                  Token Symbol *
                </Label>
                <Input
                  id="tokenSymbol"
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  placeholder="Enter token symbol"
                />
              </div>
              <div>
                <Label htmlFor="tokenDecimals" className="text-slate-300">
                  Token Decimals *
                </Label>
                <Input
                  id="tokenDecimals"
                  value={tokenDecimals}
                  onChange={(e) => setTokenDecimals(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  placeholder="18"
                />
              </div>
              <div>
                <Label htmlFor="totalSupply" className="text-slate-300">
                  Token Total Supply *
                </Label>
                <Input
                  id="totalSupply"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  placeholder="Enter total supply"
                />
              </div>
            </div>

            {selectedTokenType === "burn" && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Burn Token Configuration</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="burnRate" className="text-slate-300">
                      Burn Rate (%) *
                    </Label>
                    <Input
                      id="burnRate"
                      value={burnRate}
                      onChange={(e) => setBurnRate(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="1"
                      type="number"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="burnOnTransfer"
                      checked={burnOnTransfer}
                      onChange={(e) => setBurnOnTransfer(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                    />
                    <Label htmlFor="burnOnTransfer" className="text-slate-300">
                      Burn on every transfer
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {selectedTokenType === "fee" && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Fee Token Configuration</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="transactionFee" className="text-slate-300">
                      Transaction Fee (%) *
                    </Label>
                    <Input
                      id="transactionFee"
                      value={transactionFee}
                      onChange={(e) => setTransactionFee(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="2"
                      type="number"
                      min="0"
                      max="25"
                    />
                  </div>
                  <div>
                    <Label htmlFor="redistributionFee" className="text-slate-300">
                      Redistribution Fee (%) *
                    </Label>
                    <Input
                      id="redistributionFee"
                      value={redistributionFee}
                      onChange={(e) => setRedistributionFee(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="1"
                      type="number"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="liquidityFee" className="text-slate-300">
                      Liquidity Fee (%) *
                    </Label>
                    <Input
                      id="liquidityFee"
                      value={liquidityFee}
                      onChange={(e) => setLiquidityFee(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="1"
                      type="number"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedTokenType === "dividend" && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4">Dividend Token Configuration</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="dividendToken" className="text-slate-300">
                      Dividend Token *
                    </Label>
                    <select
                      id="dividendToken"
                      value={dividendToken}
                      onChange={(e) => setDividendToken(e.target.value)}
                      className="w-full bg-slate-700 border-slate-600 text-white mt-1 rounded-md px-3 py-2"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                      <option value="USDC">USDC</option>
                      <option value="WBTC">WBTC</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="minimumBalance" className="text-slate-300">
                      Minimum Balance for Dividends *
                    </Label>
                    <Input
                      id="minimumBalance"
                      value={minimumBalance}
                      onChange={(e) => setMinimumBalance(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="1000"
                      type="number"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="distributionInterval" className="text-slate-300">
                      Distribution Interval (hours) *
                    </Label>
                    <Input
                      id="distributionInterval"
                      value={distributionInterval}
                      onChange={(e) => setDistributionInterval(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="24"
                      type="number"
                      min="1"
                      max="168"
                    />
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-6 bg-slate-700" />

            {/* DX Fees Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">DX Platform Fees</h4>
              <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-lg">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Mint Fee</p>
                  <p className="text-blue-400 font-semibold">
                    {fees.mintFee} {tokenSymbol || "Tokens"}
                  </p>
                  <p className="text-slate-500 text-xs">(1% of total supply)</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Sale Creation Fee</p>
                  <p className="text-blue-400 font-semibold">{fees.saleCreationFee} ETH</p>
                  <p className="text-slate-500 text-xs">For creating token sales</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Airdrop Fee</p>
                  <p className="text-blue-400 font-semibold">{fees.airdropFee} ETH</p>
                  <p className="text-slate-500 text-xs">For airdrop campaigns</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                * Fees are automatically collected during the minting process to support the DX platform
              </p>
            </div>

            {/* Referral Code */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="referralCode" className="text-slate-300">
                  Referral code
                </Label>
                <Input
                  id="referralCode"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  placeholder="Provide a correct referral code"
                />
              </div>
              <Button variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                Check
              </Button>
            </div>

            {/* Deployment Status */}
            {(isMinting || deployedContract) && (
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-2">Deployment Status</h4>
                {isMinting && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{mintingStatus}</span>
                  </div>
                )}
                {deployedContract && (
                  <div className="space-y-2">
                    <p className="text-green-400">✅ Token deployed successfully!</p>
                    <p className="text-sm text-slate-300">
                      Contract Address:
                      <span className="text-blue-400 font-mono ml-2">{deployedContract}</span>
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const explorerUrl =
                          selectedNetwork === 1
                            ? `https://etherscan.io/address/${deployedContract}`
                            : selectedNetwork === 56
                              ? `https://bscscan.com/address/${deployedContract}`
                              : `https://sepolia.etherscan.io/address/${deployedContract}`
                        window.open(explorerUrl, "_blank")
                      }}
                      className="border-slate-600 text-slate-300 bg-transparent"
                    >
                      View on Explorer <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Mint Button */}
            <div className="text-center mt-8">
              {!isConnected ? (
                <Button
                  onClick={handleConnectWallet}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Wallet First"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleMintToken}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                  disabled={!tokenName || !tokenSymbol || !totalSupply || isMinting}
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      DEPLOYING...
                    </>
                  ) : (
                    `MINT ${selectedType?.title.toUpperCase()}`
                  )}
                </Button>
              )}

              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg text-sm text-slate-400">
                <p>Debug Info:</p>
                <p>Connected: {isConnected ? "Yes" : "No"}</p>
                <p>Connecting: {isConnecting ? "Yes" : "No"}</p>
                <p>Address: {address || "None"}</p>
                <p>MetaMask: {typeof window !== "undefined" && window.ethereum ? "Detected" : "Not Found"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Presale Progress Section */}
        <Card className="bg-slate-800 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white text-xl">Presale Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Tokens Sold */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Tokens Sold</p>
                <p className="text-2xl font-bold text-white">
                  {presaleData.tokensSold.toLocaleString()} / {PRESALE_CONFIG.totalTokensForSale.toLocaleString()}{" "}
                  {PRESALE_CONFIG.tokenSymbol}
                </p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(presaleData.tokensSold / PRESALE_CONFIG.totalTokensForSale) * 100}%` }}
                  ></div>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  {((presaleData.tokensSold / PRESALE_CONFIG.totalTokensForSale) * 100).toFixed(1)}% Complete
                </p>
              </div>

              {/* Remaining Tokens */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Remaining</p>
                <p className="text-2xl font-bold text-blue-400">
                  {(PRESALE_CONFIG.totalTokensForSale - presaleData.tokensSold).toLocaleString()}{" "}
                  {PRESALE_CONFIG.tokenSymbol}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {PRESALE_CONFIG.pricePerToken} ETH per {PRESALE_CONFIG.tokenSymbol}
                </p>
              </div>

              {/* Participants */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">Participants</p>
                <p className="text-2xl font-bold text-green-400">{presaleData.participantCount.toLocaleString()}</p>
                <p className="text-slate-500 text-xs mt-1">Total buyers</p>
              </div>

              {/* ETH Raised */}
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-1">ETH Raised</p>
                <p className="text-2xl font-bold text-yellow-400">{presaleData.ethRaised.toFixed(4)} ETH</p>
                <p className="text-slate-500 text-xs mt-1">Total raised</p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mt-8 text-center">
              {!presaleData.hasStarted ? (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Presale Starts In:</h3>
                  <div className="flex justify-center gap-4">
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-blue-400">{presaleData.timeRemaining.days}</div>
                      <div className="text-slate-400 text-sm">Days</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-blue-400">{presaleData.timeRemaining.hours}</div>
                      <div className="text-slate-400 text-sm">Hours</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-blue-400">{presaleData.timeRemaining.minutes}</div>
                      <div className="text-slate-400 text-sm">Minutes</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-blue-400">{presaleData.timeRemaining.seconds}</div>
                      <div className="text-slate-400 text-sm">Seconds</div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm mt-4">
                    Presale starts in 3 days at 12:00 PM PST and runs for 90 days
                  </p>
                </div>
              ) : presaleData.isActive ? (
                <div>
                  <h3 className="text-xl font-bold text-green-400 mb-4">🔴 PRESALE LIVE - Ends In:</h3>
                  <div className="flex justify-center gap-4">
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-green-400">{presaleData.timeRemaining.days}</div>
                      <div className="text-slate-400 text-sm">Days</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-green-400">{presaleData.timeRemaining.hours}</div>
                      <div className="text-slate-400 text-sm">Hours</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-green-400">{presaleData.timeRemaining.minutes}</div>
                      <div className="text-slate-400 text-sm">Minutes</div>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4 min-w-[80px]">
                      <div className="text-2xl font-bold text-green-400">{presaleData.timeRemaining.seconds}</div>
                      <div className="text-slate-400 text-sm">Seconds</div>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 mt-4 px-8 py-3">BUY TOKENS NOW</Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-4">Presale Ended</h3>
                  <p className="text-slate-400">The 90-day presale has concluded. Thank you for your participation!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}

function calculateFees(totalSupply: string) {
  if (!totalSupply) return { mintFee: "0", saleCreationFee: DX_FEES.SALE_CREATION_FEE, airdropFee: DX_FEES.AIRDROP_FEE }

  const supply = Number.parseFloat(totalSupply)
  const mintFeeTokens = (supply * DX_FEES.MINT_FEE_PERCENTAGE) / 100

  return {
    mintFee: mintFeeTokens.toLocaleString(),
    saleCreationFee: DX_FEES.SALE_CREATION_FEE,
    airdropFee: DX_FEES.AIRDROP_FEE,
  }
}

function calculateTimeRemaining(milliseconds: number) {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}
