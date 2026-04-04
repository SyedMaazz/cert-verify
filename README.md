# 🎓 CertVerify — Blockchain-Based Academic Certificate Verification System

A full-stack decentralized application that solves certificate forgery and slow manual verification by anchoring academic credentials on the blockchain.

*Built with Next.js, Solidity, Hardhat, IPFS (Pinata), and Polygon.*

---

## 🎯 What is This?

CertVerify is a tamper-proof certificate issuance and verification system. It uses a hybrid architecture:

- **On-chain (Polygon Blockchain)** — Stores the certificate hash, student ID, IPFS CID, and timestamp permanently
- **Off-chain (IPFS via Pinata)** — Stores the actual certificate file in a decentralized manner

Any modification to an issued certificate — even a single pixel — changes the SHA-256 hash and immediately fails verification. Forgery becomes mathematically impossible.

---

## ✨ Features

✅ **Tamper-proof certificates** — SHA-256 hash anchored permanently on-chain  
✅ **IPFS storage** — Certificate files stored on decentralized IPFS via Pinata  
✅ **Instant verification** — Anyone can verify a certificate in under 3 seconds  
✅ **Role-based access control (RBAC)** — Only authorized issuers can issue certificates  
✅ **Certificate revocation** — Admin can revoke certificates that were issued in error  
✅ **Issuer management** — Admin can grant or revoke the Issuer role for any wallet  
✅ **Admin-protected dashboard** — Only the deployer wallet can access the admin panel  
✅ **Wallet integration** — MetaMask / WalletConnect via RainbowKit  
✅ **Layer 2 deployment** — Polygon for low gas fees  
✅ **TypeScript** — Full type safety across the entire codebase  

---

## 🏗️ System Architecture

```
cert-verify/
├── contracts/                        # Hardhat + Solidity
│   ├── contracts/
│   │   └── CertificateRegistry.sol   # Main smart contract
│   ├── scripts/
│   │   └── deploy.js                 # Deployment script
│   ├── test/                         # Contract tests
│   └── hardhat.config.ts
│
└── web/                              # Next.js 14 App Router
    ├── app/
    │   ├── page.tsx                  # Landing page
    │   ├── issue/page.tsx            # Issuer portal
    │   ├── verify/page.tsx           # Public verifier
    │   ├── admin/page.tsx            # Admin dashboard
    │   └── api/
    │       └── upload/route.ts       # IPFS upload API route
    ├── constants/
    │   └── abi.ts                    # Contract ABI
    ├── lib/
    │   ├── hash.ts                   # SHA-256 helper
    │   └── ipfs.ts                   # Pinata service
    └── providers.tsx                 # Wagmi + RainbowKit providers
```

---

## ⚙️ How It Works

### Certificate Issuance
1. Authorized issuer uploads a certificate file and enters Student ID
2. System generates a SHA-256 hash of the file bytes
3. File is uploaded to IPFS via Pinata — returns a CID
4. Smart contract stores: `certId`, `fileHash`, `ipfsCID`, `studentId`, `timestamp`
5. Transaction is confirmed on the blockchain — record is now immutable

### Certificate Verification
1. Verifier uploads the certificate file and enters the Certificate ID
2. System re-generates the SHA-256 hash of the uploaded file
3. Smart contract is queried for the stored hash using the Certificate ID
4. Hashes are compared:
   - **Match + not revoked** → ✅ Valid Certificate
   - **Hash mismatch** → ❌ Tampered / Invalid
   - **Revoked** → ⚠️ Certificate Revoked

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Wallet** | RainbowKit, wagmi v3, MetaMask |
| **Blockchain** | Solidity, Hardhat, OpenZeppelin AccessControl |
| **Network** | Polygon PoS (L2) / Hardhat local |
| **Storage** | IPFS via Pinata SDK |
| **Hashing** | SHA-256 (Web Crypto API) |

---

## 🚀 Running Locally

### Prerequisites

- Node.js v18+
- Git
- MetaMask browser extension
- A [Pinata](https://pinata.cloud) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/SyedMaazz/cert-verify.git
cd cert-verify
```

### 2. Set up the smart contracts

```bash
cd contracts
npm install
```

### 3. Start the local Hardhat blockchain

Open a dedicated terminal and keep it running:

```bash
npx hardhat node
```

You will see a list of test accounts with private keys. Copy the **Private Key of Account #0** — you'll need it for MetaMask.

### 4. Deploy the contract

Open a second terminal:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address from the output:
```
CertificateRegistry deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 5. Set up the frontend

```bash
cd ../web
npm install --legacy-peer-deps
```

Create a `.env.local` file inside the `web/` folder:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_WALLETCONNECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ADMIN_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
PINATA_JWT=your_pinata_jwt_token
```

> **Note:** `NEXT_PUBLIC_ADMIN_ADDRESS` should be the wallet address of Account #0 from Hardhat (the deployer). `PINATA_JWT` is your Pinata API JWT token — get it from [pinata.cloud](https://pinata.cloud) → API Keys → New Key → Admin → Generate.

### 6. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Connect MetaMask to Hardhat

In MetaMask:
- Click the network dropdown → **Add a custom network**
- Fill in:
  ```
  Network Name:    Hardhat Local
  RPC URL:         http://127.0.0.1:8545
  Chain ID:        31337
  Currency Symbol: ETH
  ```
- Click **Save**
- Click your account icon → **Import account**
- Paste the Private Key of Account #0 from the Hardhat node output
- You should now see 10,000 ETH test balance

---

## 🖥️ Application Pages

| Page | URL | Description |
|---|---|---|
| Landing | `/` | Project overview and navigation |
| Issue | `/issue` | Upload and issue a certificate on-chain |
| Verify | `/verify` | Verify any certificate by uploading the file |
| Admin | `/admin` | Manage issuers, revoke certificates (admin only) |

---

## 🔐 Role-Based Access Control

The smart contract uses OpenZeppelin's `AccessControl`:

- **DEFAULT_ADMIN_ROLE** — The wallet that deploys the contract. Can grant/revoke roles and revoke certificates.
- **ISSUER_ROLE** — Can issue certificates. Granted by the admin via the Admin Dashboard.

To grant another wallet the Issuer role:
1. Go to `/admin` with the admin wallet connected
2. Under **Manage Issuers**, paste the wallet address
3. Click **Grant** and confirm in MetaMask

---

## 🛠️ Smart Contract

**`CertificateRegistry.sol`** — Core contract with the following functions:

| Function | Access | Description |
|---|---|---|
| `issueCertificate()` | ISSUER_ROLE | Issue a new certificate on-chain |
| `verifyCertificate()` | Public | Read certificate data by cert ID |
| `revokeCertificate()` | ADMIN | Mark a certificate as revoked |
| `grantRole()` | ADMIN | Grant Issuer role to a wallet |
| `revokeRole()` | ADMIN | Remove Issuer role from a wallet |
| `hasRole()` | Public | Check if a wallet has a specific role |

---

## ⚠️ Troubleshooting

**Transaction stuck on "Confirming on blockchain..."?**
- Make sure `npx hardhat node` is running in a terminal
- Every time you restart the Hardhat node, redeploy the contract and update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
- Restart the dev server after updating `.env.local`

**IPFS upload failing?**
- Check that `PINATA_JWT` is correctly set in `.env.local`
- Make sure there are no extra spaces or line breaks in the JWT value
- Verify your Pinata API key has Admin permissions

**MetaMask showing wrong network?**
- Switch MetaMask to the **Hardhat Local** network (Chain ID: 31337)
- If you restarted Hardhat node, reset your MetaMask account: Settings → Advanced → Reset Account

**Admin dashboard showing Access Denied?**
- Make sure `NEXT_PUBLIC_ADMIN_ADDRESS` in `.env.local` matches exactly the wallet address you're connected with
- The address comparison is case-insensitive but must be the correct deployer wallet

---

## 🗺️ Roadmap

- [x] Smart contract with RBAC, issuance, verification, revocation
- [x] IPFS integration via Pinata
- [x] Issuer portal with transaction confirmation states
- [x] Public verification portal
- [x] Admin dashboard with issuer management
- [x] Landing page
- [ ] Polygon Amoy testnet deployment
- [ ] Multi-signature admin (Gnosis Safe) for decentralized governance
- [ ] Certificate batch issuance
- [ ] QR code generation for easy sharing

---

## 👨‍💻 Author

**Syed Maaz**  
Final Year Project — Blockchain-Based Academic Certificate Verification System

---

*Built on Polygon + IPFS. Made to make certificate fraud a thing of the past.*