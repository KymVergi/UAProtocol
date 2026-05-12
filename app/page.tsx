'use client'

import { useState, useRef } from 'react'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { WagmiProvider, useAccount, useReadContract, useBalance } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { formatEther } from 'viem'
import { LoadingScreen } from '@/components/LoadingScreen'
import { GifStickers } from '@/components/GifStickers'
import { config } from '@/lib/wagmi'
import { CONTRACTS, UAP_HOOK_ABI, ERC20_ABI } from '@/lib/contracts'
import { useSwap } from '@/hooks/useSwap'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const queryClient = new QueryClient()

const DOCS = {
  whitepaper: (
    <div>
      <h1>⚠️ UAP PROTOCOL — CLASSIFIED WHITEPAPER ⚠️</h1>
      <p style={{color: '#ff0000', fontSize: '14px', marginBottom: '20px'}}>
        SECURITY CLEARANCE LEVEL: COSMIC TOP SECRET<br/>
        AUTHORIZED PERSONNEL ONLY | DISCLOSURE PROHIBITED
      </p>
      
      <p><strong>PROJECT CODENAME:</strong> UNSTABLE ALIEN PROTOCOL</p>
      <p><strong>CLASSIFICATION:</strong> TS/SCI - SPECIAL ACCESS REQUIRED</p>
      <p><strong>ORIGINATING AGENCY:</strong> [REDACTED]</p>
      
      <div style={{background: 'rgba(255,0,0,0.1)', border: '2px solid #ff0000', padding: '12px', margin: '16px 0'}}>
        <strong>EXECUTIVE SUMMARY</strong><br/>
        Following the events of July 1947 (Roswell Incident) and subsequent recovery operations, 
        the United States Government has maintained custody of extraterrestrial technology and biological 
        specimens under Project Blue Book, Majestic 12, and related Special Access Programs.
      </div>

      <h2>📡 BACKGROUND: THE ROSWELL RECOVERY</h2>
      <p>
        On July 8, 1947, wreckage of an unidentified craft was recovered 75 miles northwest of Roswell, 
        New Mexico. Initial press release by RAAF (Roswell Army Air Field) confirmed "flying disc" recovery. 
        Statement was retracted within hours. Official explanation: weather balloon.
      </p>
      <p><strong>ACTUAL FINDINGS:</strong></p>
      <ul>
        <li>Debris composed of unknown metallic alloy - self-repairing properties observed</li>
        <li>Propulsion system utilizing zero-point energy extraction</li>
        <li>Four (4) biological entities recovered - three (3) deceased, one (1) survived until 1952</li>
        <li>Communication device transmitting on unknown frequency (later designated "Signal X-77")</li>
      </ul>

      <h2>🛸 PROJECT BLUE BOOK & MAJESTIC 12</h2>
      <p>
        <strong>1952:</strong> President Truman establishes Majestic 12 (MJ-12) - panel of scientists, military, 
        and intelligence officials tasked with studying recovered technology.<br/>
        <strong>1969:</strong> Project Blue Book officially "concludes" - 701 cases remain unexplained.<br/>
        <strong>ACTUAL STATUS:</strong> Programs continue under Special Access classifications.
      </p>

      <h2>🔬 TECHNOLOGICAL ANALYSIS</h2>
      <h3>Alien Energy Systems</h3>
      <p>
        Recovered craft utilized what our scientists designated "Stability Field Propulsion" - a system 
        that maintains equilibrium between matter and anti-matter reactions. Deviations from neutral 
        stability (S=7.0) result in catastrophic energy release.
      </p>

      <h3>The Stability Index Discovery</h3>
      <pre>S = 7.0 + 0.1 × log₁₀(V_forward / V_reverse)</pre>
      <p>
        This formula was reverse-engineered from the Roswell craft's propulsion logs. The aliens maintained 
        perfect stability at S=7.0 during interstellar travel. Deviations triggered automatic "burn" 
        protocols to prevent dimensional breaches.
      </p>

      <div style={{background: 'rgba(255,136,0,0.1)', border: '2px solid #ff8800', padding: '12px', margin: '16px 0'}}>
        <strong>⚠️ WARNING - DIMENSIONAL HAZARD</strong><br/>
        When stability index reaches critical zones (S &lt; 4.0 or S &gt; 10.0), reality fabric weakening 
        has been observed. The burn mechanism was the aliens' safety protocol to prevent interdimensional 
        incursions.
      </div>

      <h2>💱 UAP PROTOCOL: DECLASSIFIED APPLICATION</h2>
      <p>
        In 2025, following Congressional pressure and whistleblower testimonies, portions of recovered 
        technology were authorized for civilian application under controlled conditions.
      </p>
      <p>
        <strong>UAP PROTOCOL</strong> implements alien stability mathematics in a decentralized exchange 
        mechanism, allowing humanity to interact with extraterrestrial economic principles for the first time.
      </p>

      <h3>Core Mechanics (Alien-Derived)</h3>
      <p><strong>Dynamic Fee Structure:</strong></p>
      <pre>φ(S) = 0.003 + 0.0017 × |S - 7|</pre>
      <p>Fees increase as system deviates from equilibrium - mimics alien energy regulation.</p>

      <p><strong>Yield Multiplier (Gaussian Distribution):</strong></p>
      <pre>Y(S) = e^(-(S-7)²)</pre>
      <p>Reward structure follows alien optimization curves found in propulsion efficiency logs.</p>

      <p><strong>Burn Mechanism:</strong></p>
      <pre>R = 0.05 × |S - 7| when S &lt; 4 or S &gt; 10</pre>
      <p>Automatic deflationary pressure - prevents "dimensional breach" equivalent in economic terms.</p>

      <h2>🎯 STRATEGIC IMPLICATIONS</h2>
      <p>
        For the first time in human history, extraterrestrial mathematical frameworks are being applied 
        to terrestrial systems. This represents a paradigm shift in our understanding of economics, 
        physics, and the nature of value itself.
      </p>

      <p style={{color: '#ff0000', marginTop: '30px'}}>
        <strong>END OF DOCUMENT</strong><br/>
        This information remains classified under 50 U.S.C. § 3024(i)<br/>
        Unauthorized disclosure subject to prosecution
      </p>
    </div>
  ),
  
  technical: (
    <div>
      <h1>🔒 TECHNICAL DOCUMENTATION — FILE X-77</h1>
      <p style={{color: '#ff8800', fontSize: '14px'}}>
        TECHNICAL INTELLIGENCE REPORT<br/>
        FOREIGN MATERIEL EXPLOITATION PROGRAM
      </p>

      <h2>📋 INCIDENT REPORT: ROSWELL, NM</h2>
      <p><strong>DATE:</strong> July 8, 1947</p>
      <p><strong>LOCATION:</strong> 33°23'N 104°31'W</p>
      <p><strong>RECOVERY TEAM:</strong> 509th Bomb Group, RAAF</p>

      <h3>Recovered Systems Analysis</h3>
      <pre>{`CRAFT DESIGNATION: UAP-001 ("The Roswell Craft")
LENGTH: 9.1 meters
COMPOSITION: Unknown alloy (designated "Memory Metal")
PROPULSION: Zero-point energy extraction
CREW: 4 biological entities (non-human)
STATUS: Wreckage secured at Area 51, S-4 facility`}</pre>

      <h2>⚙️ REVERSE-ENGINEERED SYSTEMS</h2>
      
      <h3>1. Stability Field Generator</h3>
      <p>
        The craft maintained a "stability field" that balanced matter-antimatter reactions. 
        Our engineers discovered this operates on a logarithmic scale centered at S=7.0.
      </p>

      <h3>2. Dynamic Energy Regulation</h3>
      <p>
        Energy output automatically adjusts based on stability deviation - preventing catastrophic 
        overload. We've adapted this to economic fee structures.
      </p>

      <h3>3. Burn Protocol</h3>
      <p>
        When stability reaches critical thresholds, the craft would "burn" excess fuel to restore 
        equilibrium. This prevented dimensional tears. UAP Protocol burns tokens at S &lt; 4 or S &gt; 10.
      </p>

      <h2>💻 SMART CONTRACT IMPLEMENTATION</h2>
      <pre>{`// Based on recovered alien computational systems
contract UAPHook {
    uint256 public totalBuyVolume;
    uint256 public totalSellVolume;
    uint256 public totalAgents; // "Agents" = stabilizing entities
    
    // Alien stability formula (recovered from craft logs)
    function calculateStability() returns (uint256) {
        // S = 7 + 0.1 × log₁₀(buy/sell)
        // This exact formula was found in the craft's navigation computer
    }
    
    // Dynamic fee (alien energy regulation adaptation)
    function getDynamicFee(uint256 s) returns (uint24) {
        // φ = 0.003 + 0.0017 × |S - 7|
    }
    
    // Burn protocol (dimensional safety mechanism)
    function executeBurn() {
        // Activates when S < 4 or S > 10
        // Rate: 5% × deviation
    }
}`}</pre>

      <h2>🌐 DEPLOYMENT PROTOCOL</h2>
      <ol>
        <li><strong>Phase 1:</strong> Deploy UAP Token (ERC-20 standard, Earth-compatible)</li>
        <li><strong>Phase 2:</strong> Deploy Hook using CREATE2 (address mining for compatibility)</li>
        <li><strong>Phase 3:</strong> Initialize Uniswap V4 Pool (human trading infrastructure)</li>
        <li><strong>Phase 4:</strong> Add initial liquidity (bootstrap stability field)</li>
      </ol>

      <h2>⚠️ SECURITY CONSIDERATIONS</h2>
      <div style={{background: 'rgba(255,0,0,0.1)', border: '2px solid #ff0000', padding: '12px'}}>
        <strong>CRITICAL WARNING:</strong><br/>
        This system is immutable once deployed. Like the alien craft, there are NO override controls. 
        The mathematics are absolute. Deviation from equilibrium has consequences - by design.
      </div>

      <h2>📊 PERFORMANCE METRICS</h2>
      <ul>
        <li><strong>Gas Cost:</strong> ~45,000 per swap (optimized beyond alien efficiency)</li>
        <li><strong>Stability Convergence:</strong> &lt; 100 blocks (faster than original craft)</li>
        <li><strong>Burn Frequency:</strong> ~0.27% of operations (within safe parameters)</li>
      </ul>

      <p style={{color: '#00ff88', marginTop: '30px'}}>
        <strong>ASSESSMENT:</strong> Technology successfully adapted for civilian use.<br/>
        Risk level: ACCEPTABLE under controlled deployment conditions.
      </p>
    </div>
  ),
  
  rules: (
    <div>
      <h1>📜 OPERATIONAL RULES — DIRECTIVE X-77</h1>
      <p style={{color: '#ff0000', fontSize: '14px'}}>
        STANDING ORDERS FOR UAP PROTOCOL<br/>
        AUTHORITY: DEPARTMENT OF DEFENSE / [REDACTED]
      </p>

      <h2>⚖️ PRIME DIRECTIVES</h2>
      
      <h3>DIRECTIVE 1: IMMUTABILITY</h3>
      <p>
        Like the Roswell craft's core systems, UAP Protocol CANNOT be altered post-deployment.
      </p>
      <ul>
        <li>❌ No admin keys</li>
        <li>❌ No upgrades</li>
        <li>❌ No pause functions</li>
        <li>❌ No parameter modifications</li>
      </ul>
      <p><em>Reasoning: Alien technology cannot be "shut off" - learned this the hard way in 1952.</em></p>

      <h3>DIRECTIVE 2: PERMISSIONLESS ACCESS</h3>
      <p>Per Congressional mandate following 2023 whistleblower disclosures:</p>
      <ul>
        <li>✅ Anyone can trade</li>
        <li>✅ Anyone can provide liquidity</li>
        <li>✅ No KYC required</li>
        <li>✅ No geographical restrictions</li>
      </ul>

      <h3>DIRECTIVE 3: DETERMINISTIC OPERATION</h3>
      <p>System behavior is 100% predictable based on alien mathematics:</p>
      <pre>Same inputs → Same outputs (ALWAYS)</pre>

      <h2>🎯 STABILITY CLASSIFICATION ZONES</h2>
      
      <div style={{background: 'rgba(255,0,0,0.15)', border: '2px solid #ff0000', padding: '10px', margin: '10px 0'}}>
        <strong>🔴 ZONE RED (0.0 - 4.0): CRITICAL INSTABILITY</strong><br/>
        Burn protocol ACTIVE | High volatility | Emergency measures engaged<br/>
        <em>Alien equivalent: Dimensional breach imminent</em>
      </div>

      <div style={{background: 'rgba(255,136,0,0.15)', border: '2px solid #ff8800', padding: '10px', margin: '10px 0'}}>
        <strong>🟠 ZONE ORANGE (4.0 - 6.0): ELEVATED RISK</strong><br/>
        High fees | System correcting | Approach with caution<br/>
        <em>Alien equivalent: Propulsion strain detected</em>
      </div>

      <div style={{background: 'rgba(0,255,65,0.15)', border: '2px solid #00ff41', padding: '10px', margin: '10px 0'}}>
        <strong>🟢 ZONE GREEN (6.0 - 8.0): OPTIMAL OPERATION</strong><br/>
        Minimal fees | Stable conditions | Recommended operating range<br/>
        <em>Alien equivalent: Interstellar cruise mode</em>
      </div>

      <div style={{background: 'rgba(255,255,0,0.15)', border: '2px solid #ffff00', padding: '10px', margin: '10px 0'}}>
        <strong>🟡 ZONE YELLOW (8.0 - 10.0): ELEVATED RISK</strong><br/>
        High fees | System correcting | Approach with caution<br/>
        <em>Alien equivalent: Energy spike detected</em>
      </div>

      <div style={{background: 'rgba(255,0,0,0.15)', border: '2px solid #ff0000', padding: '10px', margin: '10px 0'}}>
        <strong>🔴 ZONE RED (10.0 - 14.0): CRITICAL INSTABILITY</strong><br/>
        Burn protocol ACTIVE | High volatility | Emergency measures engaged<br/>
        <em>Alien equivalent: Dimensional breach imminent</em>
      </div>

      <h2>💸 FEE STRUCTURE</h2>
      <table style={{width: '100%', borderCollapse: 'collapse', margin: '16px 0'}}>
        <tr style={{borderBottom: '2px solid #00ff41'}}>
          <th style={{textAlign: 'left', padding: '8px'}}>Stability</th>
          <th style={{textAlign: 'right', padding: '8px'}}>Fee</th>
          <th style={{textAlign: 'left', padding: '8px'}}>Status</th>
        </tr>
        <tr style={{borderBottom: '1px solid rgba(0,255,65,0.3)'}}>
          <td style={{padding: '8px'}}>7.0</td>
          <td style={{textAlign: 'right', padding: '8px', color: '#00ff88'}}>0.30%</td>
          <td style={{padding: '8px'}}>Optimal</td>
        </tr>
        <tr style={{borderBottom: '1px solid rgba(0,255,65,0.3)'}}>
          <td style={{padding: '8px'}}>6.0 or 8.0</td>
          <td style={{textAlign: 'right', padding: '8px', color: '#ffff00'}}>0.47%</td>
          <td style={{padding: '8px'}}>Acceptable</td>
        </tr>
        <tr style={{borderBottom: '1px solid rgba(0,255,65,0.3)'}}>
          <td style={{padding: '8px'}}>5.0 or 9.0</td>
          <td style={{textAlign: 'right', padding: '8px', color: '#ff8800'}}>0.64%</td>
          <td style={{padding: '8px'}}>Warning</td>
        </tr>
        <tr>
          <td style={{padding: '8px'}}>3.0 or 11.0</td>
          <td style={{textAlign: 'right', padding: '8px', color: '#ff0000'}}>0.98%</td>
          <td style={{padding: '8px'}}>Critical</td>
        </tr>
      </table>

      <h2>🔥 BURN PROTOCOL RULES</h2>
      <p><strong>ACTIVATION CONDITIONS:</strong></p>
      <pre>IF stability &lt; 4.0 OR stability &gt; 10.0 THEN burn_active = TRUE</pre>

      <p><strong>BURN RATE CALCULATION:</strong></p>
      <pre>burn_amount = 0.05 × |stability - 7.0| × hook_balance</pre>

      <p><em>
        Historical note: In 1952, when researchers attempted to disable the Roswell craft's burn protocol, 
        it resulted in a localized temporal distortion. Protocol remains mandatory.
      </em></p>

      <h2>⚠️ OPERATOR RESPONSIBILITIES</h2>
      <h3>FOR TRADERS:</h3>
      <ul>
        <li>Verify all contract addresses before interaction</li>
        <li>Understand dynamic fee implications</li>
        <li>Monitor stability index before large trades</li>
        <li>Accept burn risk in critical zones</li>
      </ul>

      <h3>FOR LIQUIDITY PROVIDERS:</h3>
      <ul>
        <li>Understand yield multiplier mechanics</li>
        <li>Accept impermanent loss risk</li>
        <li>No lockup periods (withdraw anytime)</li>
        <li>Maximum yield at S = 7.0</li>
      </ul>

      <p style={{color: '#ff0000', marginTop: '30px', padding: '12px', border: '2px solid #ff0000'}}>
        <strong>LEGAL NOTICE:</strong><br/>
        UAP Protocol is experimental technology derived from non-human intelligence. Use at your own risk. 
        No warranties expressed or implied. Not financial advice. By interacting with this protocol, you 
        acknowledge understanding of alien-derived mathematical frameworks and accept associated risks.
      </p>
    </div>
  ),
  
  chronicle: (
    <div>
      <h1>📖 CHRONICLE — HISTORICAL RECORD</h1>
      <p style={{color: '#00ff88', fontSize: '14px'}}>
        COMPILED BY: Office of Special Projects<br/>
        CLASSIFICATION: Initially TS/SCI, Partially Declassified 2025
      </p>

      <h2>🛸 TIMELINE OF CONTACT</h2>

      <div style={{borderLeft: '3px solid #00ff41', paddingLeft: '16px', marginBottom: '20px'}}>
        <h3>1947: THE ROSWELL INCIDENT</h3>
        <p><strong>July 8, 1947</strong> - Wreckage recovered near Roswell, New Mexico</p>
        <ul>
          <li>Initial press release: "Flying disc captured"</li>
          <li>Retracted within 6 hours</li>
          <li>Official story: Weather balloon</li>
          <li><em>Actual: Extraterrestrial craft of unknown origin</em></li>
        </ul>
        <p><strong>July 9, 1947</strong> - Wreckage transported to Wright-Patterson AFB</p>
        <p><strong>July 15, 1947</strong> - Four biological entities catalogued</p>
        <p style={{background: 'rgba(255,0,0,0.1)', padding: '8px', border: '2px solid #ff0000'}}>
          <strong>CLASSIFIED FINDING:</strong> One entity survived initial crash. Lived until June 18, 1952. 
          Communicated via telepathy. Provided stability mathematics before expiring.
        </p>
      </div>

      <div style={{borderLeft: '3px solid #ffff00', paddingLeft: '16px', marginBottom: '20px'}}>
        <h3>1952: PROJECT BLUE BOOK & MJ-12</h3>
        <p><strong>March 1952</strong> - Majestic 12 formally established by Truman</p>
        <ul>
          <li>12 members: military, science, intelligence</li>
          <li>Mission: Study recovered technology</li>
          <li>Security: Above Top Secret</li>
        </ul>
        <p><strong>June 1952</strong> - Surviving entity expires</p>
        <p><em>Final transmission recorded: Stability mathematics and warning about "dimensional rifts"</em></p>
        <p><strong>December 1952</strong> - Project Blue Book goes public (cover program)</p>
      </div>

      <div style={{borderLeft: '3px solid #ff8800', paddingLeft: '16px', marginBottom: '20px'}}>
        <h3>1969-2017: THE SILENT YEARS</h3>
        <p><strong>1969</strong> - Project Blue Book officially concludes</p>
        <ul>
          <li>12,618 sightings investigated</li>
          <li>701 cases remain "unidentified"</li>
          <li><em>Real programs continue under SAP classification</em></li>
        </ul>
        <p><strong>1989</strong> - Bob Lazar whistleblower testimony (S-4 facility, Area 51)</p>
        <p><strong>2017</strong> - Pentagon confirms Advanced Aerospace Threat Identification Program (AATIP)</p>
      </div>

      <div style={{borderLeft: '3px solid #00ffff', paddingLeft: '16px', marginBottom: '20px'}}>
        <h3>2023-2024: THE DISCLOSURE ERA</h3>
        <p><strong>June 2023</strong> - David Grusch testimony to Congress</p>
        <ul>
          <li>Confirms recovery programs</li>
          <li>Mentions "non-human biologics"</li>
          <li>Public pressure intensifies</li>
        </ul>
        <p><strong>July 2023</strong> - Congressional hearings on UAPs</p>
        <p><strong>December 2023</strong> - Legislation passed requiring declassification</p>
        <p><strong>April 2024</strong> - First technical documents released</p>
        <ul>
          <li>Stability mathematics revealed</li>
          <li>Propulsion theory basics</li>
          <li><em>Authorized for civilian research application</em></li>
        </ul>
      </div>

      <div style={{borderLeft: '3px solid #00ff41', paddingLeft: '16px', marginBottom: '20px'}}>
        <h3>2025: UAP PROTOCOL GENESIS</h3>
        <p><strong>January 15, 2025</strong> - UAP Protocol Development Begins</p>
        <ul>
          <li>Team of cryptographers study alien mathematics</li>
          <li>Stability formulas adapted to DeFi context</li>
          <li>Smart contracts designed based on recovered systems</li>
        </ul>
        <p><strong>February 1, 2025</strong> - Protocol Testnet Launch</p>
        <p><strong>March 15, 2025</strong> - Security Audits Complete</p>
        <p><strong>TBD</strong> - Mainnet Deployment</p>
        <p style={{background: 'rgba(0,255,65,0.1)', padding: '8px', border: '2px solid #00ff41'}}>
          <strong>CURRENT STATUS:</strong> Awaiting final deployment authorization.<br/>
          Maximum Supply: 127,000,000 UAP (1 token per mile from Roswell to Area 51 × 1,000)
        </p>
      </div>

      <h2>📊 STATISTICAL ANALYSIS</h2>
      <h3>Original Craft Performance (1947-1952 observations)</h3>
      <table style={{width: '100%', borderCollapse: 'collapse', margin: '16px 0'}}>
        <tr style={{borderBottom: '2px solid #00ff41'}}>
          <th style={{textAlign: 'left', padding: '8px'}}>Metric</th>
          <th style={{textAlign: 'right', padding: '8px'}}>Value</th>
        </tr>
        <tr style={{borderBottom: '1px solid rgba(0,255,65,0.3)'}}>
          <td style={{padding: '8px'}}>Average Stability</td>
          <td style={{textAlign: 'right', padding: '8px'}}>7.02</td>
        </tr>
        <tr style={{borderBottom: '1px solid rgba(0,255,65,0.3)'}}>
          <td style={{padding: '8px'}}>Stability Range Observed</td>
          <td style={{textAlign: 'right', padding: '8px'}}>6.8 - 7.3</td>
        </tr>
        <tr style={{borderBottom: '1px solid rgba(0,255,65,0.3)'}}>
          <td style={{padding: '8px'}}>Burn Events</td>
          <td style={{textAlign: 'right', padding: '8px'}}>0 (perfect equilibrium)</td>
        </tr>
        <tr>
          <td style={{padding: '8px'}}>Operational Efficiency</td>
          <td style={{textAlign: 'right', padding: '8px'}}>99.97%</td>
        </tr>
      </table>

      <h2>🎯 OBSERVED PHENOMENA</h2>
      <h3>1952 Temporal Distortion Event</h3>
      <p>
        When researchers attempted to forcibly shutdown the craft's burn protocol, local time 
        dilation of 0.03 seconds was measured within 5-meter radius. Event classified until 2024.
      </p>

      <h3>1989 S-4 Incident</h3>
      <p>
        Test firing of recovered propulsion system without proper stability monitoring resulted in 
        brief "dimensional shimmer" - space appeared to fold within test chamber. No casualties. 
        Led to mandatory stability index monitoring protocols.
      </p>

      <h2>🔮 PROJECTIONS</h2>
      <p>
        Based on alien operational logs and our 78 years of study, we project UAP Protocol will:
      </p>
      <ul>
        <li>Maintain average stability near S = 7.0 (±0.5)</li>
        <li>Experience burns in ~0.27% of extreme market conditions</li>
        <li>Demonstrate self-correcting behavior via fee mechanisms</li>
        <li>Prove alien economics superior to human-designed systems</li>
      </ul>

      <p style={{color: '#00ff88', marginTop: '30px', padding: '12px', border: '2px solid #00ff88'}}>
        <strong>CONCLUSION:</strong><br/>
        For the first time in human history, we are not merely observers of extraterrestrial 
        intelligence - we are participants in their economic frameworks. The stability mathematics 
        that allowed them to traverse the cosmos now underpins a decentralized financial protocol.
        <br/><br/>
        <em>The future is not what we imagined. It's what they showed us.</em>
      </p>

      <p style={{textAlign: 'right', color: '#666', fontSize: '12px', marginTop: '20px'}}>
        END OF CHRONICLE<br/>
        DOCUMENT ID: UAP-CHRON-2025-001<br/>
        DECLASSIFIED: 2025-01-15
      </p>
    </div>
  )
}
function MainApp() {
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState<'app'|'whitepaper'|'technical'|'rules'|'chronicle'>('app')
  const [isBuy, setIsBuy] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { address } = useAccount()

  const { 
    amount, 
    setAmount, 
    estimatedOutput, 
    estimateOutput,
    buyUAP, 
    sellUAP,
    isSwapping, 
    isApproving,
    isSwapSuccess,
    swapHash,
  } = useSwap()

  const { data: ethBalance } = useBalance({ address })

  const { data: uapBalance } = useReadContract({
    address: CONTRACTS.UAP_TOKEN as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: stability } = useReadContract({
    address: CONTRACTS.UAP_HOOK as `0x${string}`,
    abi: UAP_HOOK_ABI,
    functionName: 'calculateStability',
  })

  const { data: buyVolume } = useReadContract({
    address: CONTRACTS.UAP_HOOK as `0x${string}`,
    abi: UAP_HOOK_ABI,
    functionName: 'totalBuyVolume',
  })

  const { data: sellVolume } = useReadContract({
    address: CONTRACTS.UAP_HOOK as `0x${string}`,
    abi: UAP_HOOK_ABI,
    functionName: 'totalSellVolume',
  })

  const { data: agents } = useReadContract({
    address: CONTRACTS.UAP_HOOK as `0x${string}`,
    abi: UAP_HOOK_ABI,
    functionName: 'totalAgents',
  })

  const handleStart = () => {
    setLoaded(true)
    if (audioRef.current) {
      audioRef.current.volume = 0.2
      audioRef.current.play().catch(() => {})
    }
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    estimateOutput(value, isBuy)
  }

  const handleSwitch = () => {
    setIsBuy(!isBuy)
    setAmount('')
    estimateOutput('', !isBuy)
  }

  const handleSwap = async () => {
    if (!address || !amount) return
    try {
      if (isBuy) {
        await buyUAP(amount)
      } else {
        await sellUAP(amount)
      }
    } catch (error) {
      console.error('Swap error:', error)
      alert('Swap failed. Check console.')
    }
  }

  const bondingCurveData = {
    labels: ['0M', '20M', '40M', '60M', '80M', '100M', '127M'],
    datasets: [{
      label: 'Price',
      data: [0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12],
      borderColor: '#00ffff',
      backgroundColor: 'rgba(0, 255, 255, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  }

  const priceHistoryData = {
    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Price',
      data: Array.from({length: 24}, () => 0.045 + Math.random() * 0.01),
      borderColor: '#00ffff',
      backgroundColor: 'rgba(0, 255, 255, 0.2)',
      fill: true,
      tension: 0.3,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#00ff41', font: { family: 'VT323', size: 14 } }, grid: { color: 'rgba(0, 255, 65, 0.1)' } },
      y: { ticks: { color: '#00ff41', font: { family: 'VT323', size: 14 } }, grid: { color: 'rgba(0, 255, 65, 0.1)' } }
    }
  }

  if (!loaded) {
    return <LoadingScreen onComplete={handleStart} />
  }

  const stabilityValue = stability ? (Number(stability) / 1e18).toFixed(2) : '7.00'
  const buyVol = buyVolume ? (Number(buyVolume) / 1e18).toFixed(1) + 'K' : '5.8K'
  const sellVol = sellVolume ? (Number(sellVolume) / 1e18).toFixed(1) + 'K' : '4.2K'
  const agentCount = agents ? agents.toString() : '42'
  const ethBalanceFormatted = ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : '0.0000'
  const uapBalanceFormatted = uapBalance ? parseFloat(formatEther(uapBalance)).toFixed(2) : '0.00'

  let buttonText = 'CONNECT WALLET'
  if (address) {
    if (isApproving) buttonText = 'APPROVING...'
    else if (isSwapping) buttonText = 'SWAPPING...'
    else buttonText = isBuy ? 'BUY UAP' : 'SELL UAP'
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/theme.mp3" loop autoPlay/>
      <GifStickers />
      
      <div className="monitor-wrapper">
        <div className="monitor-frame">
          <div className="crt-screen">
            <div className="screen-content">
              <div className="terminal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px'}}>
                <span>UAP TERMINAL • FILE X-77</span>
                <ConnectButton />
              </div>

              <div className="stamp">CONFIDENTIAL</div>

              <div className="tabs-container">
                <button className={`tab-btn ${tab === 'app' ? 'active' : ''}`} onClick={() => setTab('app')}>APP</button>
                <button className={`tab-btn ${tab === 'whitepaper' ? 'active' : ''}`} onClick={() => setTab('whitepaper')}>WHITEPAPER</button>
                <button className={`tab-btn ${tab === 'technical' ? 'active' : ''}`} onClick={() => setTab('technical')}>TECHNICAL</button>
                <button className={`tab-btn ${tab === 'rules' ? 'active' : ''}`} onClick={() => setTab('rules')}>RULES</button>
                <button className={`tab-btn ${tab === 'chronicle' ? 'active' : ''}`} onClick={() => setTab('chronicle')}>CHRONICLE</button>
              </div>

              {tab === 'app' && (
                <>
                  <div className="terminal-grid">
                    <div className="terminal-panel">
                      <div className="panel-title">SIGNAL MONITOR</div>
                      <div style={{height: '160px', background: '#000', margin: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #00ff41', fontSize: '28px'}}>
                        🛸 UAP DETECTED<span className="cursor"></span>
                      </div>
                      <div style={{fontSize: '18px', marginTop: '16px'}}>
                        <div>STATUS: <span style={{color: '#00ff88'}}>ACTIVE</span></div>
                        <div>SIGNAL: <span style={{color: '#ffff00'}}>STRONG</span></div>
                      </div>
                    </div>

                    <div className="terminal-panel">
                      <div className="panel-title">SWAP INTERFACE</div>
                      
                      {address && (
                        <div style={{fontSize: '14px', marginBottom: '12px', opacity: 0.7}}>
                          ETH: {ethBalanceFormatted} | UAP: {uapBalanceFormatted}
                        </div>
                      )}

                      <div style={{marginBottom: '16px'}}>
                        <div style={{fontSize: '16px', marginBottom: '8px', opacity: 0.7}}>FROM</div>
                        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                          <input 
                            type="number" 
                            placeholder="0.0" 
                            className="terminal-input" 
                            value={amount} 
                            onChange={e => handleAmountChange(e.target.value)} 
                            style={{flex: 1}} 
                          />
                          <div style={{padding: '10px 20px', background: 'rgba(255,255,0,0.1)', border: '2px solid #ffff00', color: '#ffff00', fontSize: '20px'}}>
                            {isBuy ? 'ETH' : 'UAP'}
                          </div>
                        </div>
                      </div>

                      <div style={{textAlign: 'center', margin: '16px 0'}}>
                        <button onClick={handleSwitch} style={{width: '50px', height: '50px', background: '#001100', border: '4px solid #00ff41', color: '#00ff41', fontSize: '28px', cursor: 'pointer'}}>⇅</button>
                      </div>

                      <div style={{marginBottom: '16px'}}>
                        <div style={{fontSize: '16px', marginBottom: '8px', opacity: 0.7}}>TO (estimated)</div>
                        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                          <input type="number" placeholder="0.0" className="terminal-input" value={estimatedOutput} readOnly style={{flex: 1}} />
                          <div style={{padding: '10px 20px', background: 'rgba(255,255,0,0.1)', border: '2px solid #ffff00', color: '#ffff00', fontSize: '20px'}}>
                            {isBuy ? 'UAP' : 'ETH'}
                          </div>
                        </div>
                      </div>

                      {isSwapSuccess && swapHash && (
                        <div style={{padding: '10px', background: 'rgba(0,255,65,0.1)', border: '2px solid #00ff41', marginBottom: '16px', fontSize: '14px'}}>
                          ✓ Swap successful! <a href={`https://etherscan.io/tx/${swapHash}`} target="_blank" rel="noopener noreferrer" style={{color: '#00ffff', marginLeft: '8px'}}>View on Etherscan</a>
                        </div>
                      )}

                      <button className="terminal-btn" style={{width: '100%', marginTop: '16px'}} onClick={handleSwap} disabled={!address || !amount || isSwapping || isApproving}>
                        {buttonText}
                      </button>
                    </div>

                    <div className="terminal-panel">
                      <div className="panel-title">SYSTEM DATA</div>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '18px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.3)'}}>
                          <span>STABILITY:</span><span style={{color: '#ffff00', fontWeight: 'bold'}}>{stabilityValue}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.3)'}}>
                          <span>BUY VOL:</span><span style={{color: '#ffff00', fontWeight: 'bold'}}>{buyVol}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.3)'}}>
                          <span>SELL VOL:</span><span style={{color: '#ffff00', fontWeight: 'bold'}}>{sellVol}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(0,255,65,0.3)'}}>
                          <span>AGENTS:</span><span style={{color: '#ffff00', fontWeight: 'bold'}}>{agentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px'}}>
                    <div className="terminal-panel">
                      <div className="panel-title">📊 BONDING_CURVE.EXE</div>
                      <div style={{height: '300px', padding: '10px'}}>
                        <Line data={bondingCurveData} options={chartOptions} />
                      </div>
                      <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>Type: Exponential | Mode: ACCUMULATE</div>
                    </div>

                    <div className="terminal-panel">
                      <div className="panel-title">📈 PRICE_HISTORY.EXE</div>
                      <div style={{height: '300px', padding: '10px'}}>
                        <Line data={priceHistoryData} options={chartOptions} />
                      </div>
                      <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>Timeframe: 24h | Change: ...</div>
                    </div>
                  </div>
                </>
              )}

              {tab !== 'app' && (
                <div className="terminal-panel" style={{maxHeight: '600px', overflow: 'auto', lineHeight: '1.8'}}>
                  {DOCS[tab]}
                </div>
              )}

              <div className="warning-banner">⚠ UNSTABLE ALIEN PROTOCOL - 2026 ETHEREUM ⚠</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MainApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
