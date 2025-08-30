# FHEVM Remix Plugin
<img width="1028" height="938" alt="e0f4b0a0-0a43-458c-9c29-a20be697c59a" src="https://github.com/user-attachments/assets/31d9a05c-100c-472f-a17a-b6ed8a8d9a77" />

A comprehensive Remix IDE plugin for deploying and interacting with Fully Homomorphic Encryption Virtual Machine (FHEVM) contracts. This plugin enables developers to easily deploy confidential smart contracts that preserve privacy through homomorphic encryption.

## 🔐 Features

- **Confidential ERC20 Token Deployment**: Deploy privacy-preserving ERC20 tokens with encrypted balances
- **Confidential ERC721 NFT Deployment**: Deploy privacy-preserving NFT collections with encrypted metadata
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Sepolia Testnet Support**: Optimized for Ethereum Sepolia testnet deployment
- **Real-time Transaction Monitoring**: Track deployment progress and view transaction details
- **Contract Verification**: Built-in contract verification capabilities
- **Modern UI**: Clean, responsive interface with real-time feedback

## 🚀 Quick Start
You can connect and use it directly on [Remix IDE](https://remix.ethereum.org/), or deploy it locally to issue your own customized Tokens and NFTs.


### Prerequisites

- Node.js (>= 18.18.0)
- npm or yarn
- MetaMask browser extension
- Sepolia ETH for gas fees

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zama-ai/fhevm-remix-plugin.git
   cd fhevm-remix-plugin/remix-fhevm-plugin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Compile smart contracts**
   ```bash
   npm run compile
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run compile` | Compile smart contracts |
| `npm run deploy` | Deploy contracts locally |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run deploy:fhevm` | Deploy to FHEVM Sepolia |
| `npm run clean` | Clean build artifacts |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |

## 🔧 Configuration

### Network Configuration

The plugin is pre-configured for Sepolia testnet. To modify network settings, update the configuration in `src/wallet.ts`:

```typescript
private readonly SEPOLIA_CONFIG = {
  chainId: '0xaa36a7', // 11155111 in hex
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SEP',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/']
};
```

### Contract Configuration

Smart contracts are located in the `contracts/` directory:
- `ConfidentialERC20.sol` - Privacy-preserving ERC20 implementation
- `ConfidentialERC721.sol` - Privacy-preserving ERC721 implementation
- `TFHE.sol` - TFHE library for homomorphic operations

## 📖 Usage Guide

### 1. Wallet Connection

1. Ensure MetaMask is installed and configured
2. Click "Connect MetaMask" button
3. Approve the connection request
4. Switch to Sepolia testnet if prompted

### 2. Deploying Confidential ERC20 Token

1. Select the "ERC20 Token" tab
2. Fill in the required fields:
   - **Token Name**: Display name for your token (e.g., "My Confidential Token")
   - **Token Symbol**: Short symbol (e.g., "MCT")
   - **Initial Supply**: Token supply in ETH units (e.g., "1000000")
3. Click "🚀 Deploy ERC20 Contract"
4. Confirm the transaction in MetaMask
5. Wait for deployment confirmation

### 3. Deploying Confidential ERC721 NFT

1. Select the "ERC721 NFT" tab
2. Fill in the required fields:
   - **NFT Collection Name**: Display name (e.g., "My Confidential NFTs")
   - **NFT Symbol**: Short symbol (e.g., "MCN")
   - **Base URI**: Optional metadata URI
3. Click "🎨 Deploy NFT Contract"
4. Confirm the transaction in MetaMask
5. Wait for deployment confirmation

### 4. Post-Deployment Actions

After successful deployment, you can:
- **Copy contract address** to clipboard
- **View on Etherscan** - Opens block explorer
- **Verify contract** - Initiate contract verification
- **Deploy another contract** - Reset form for new deployment

## 🏗️ Architecture

### Project Structure

```
remix-fhevm-plugin/
├── contracts/              # Smart contract source files
│   ├── ConfidentialERC20.sol
│   ├── ConfidentialERC721.sol
│   ├── TFHE.sol
│   └── interfaces/
├── src/                    # TypeScript source code
│   ├── main.ts            # Main application entry
│   ├── wallet.ts          # Wallet management
│   ├── contracts.ts       # Contract deployment logic
│   ├── ui.ts              # UI styling and components
│   └── types/             # Type definitions
├── artifacts/              # Compiled contract artifacts
├── dist/                   # Production build output
├── public/                 # Static assets
└── scripts/               # Deployment scripts
```

### Key Components

- **WalletManager**: Handles MetaMask connection and network management
- **ContractDeployer**: Manages smart contract deployment and interaction
- **UI Components**: Responsive interface for user interaction

## 🔒 Security Features

### FHEVM Integration

This plugin leverages FHEVM (Fully Homomorphic Encryption Virtual Machine) to provide:

- **Encrypted State**: All sensitive data is encrypted on-chain
- **Private Computations**: Operations on encrypted data without decryption
- **Access Control**: Granular permissions for data access
- **Client-Side Encryption**: Data encrypted before blockchain submission

### Privacy Guarantees

- **Balance Privacy**: Token balances remain encrypted
- **Transaction Privacy**: Transfer amounts are confidential
- **Metadata Privacy**: NFT metadata can be encrypted
- **Selective Disclosure**: Users control data visibility

## 🧪 Testing

### Local Testing

```bash
# Run contract compilation
npm run compile

# Start local development
npm run dev

# Run type checking
npm run typecheck
```

### Testnet Deployment

1. Ensure you have Sepolia ETH
2. Configure your deployment parameters
3. Run deployment script:
   ```bash
   npm run deploy:sepolia
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain code coverage above 80%
- Use conventional commit messages
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **FHEVM Documentation**: [https://docs.fhevm.org](https://docs.fhevm.org)
- **Zama Website**: [https://zama.ai](https://zama.ai)
- **Remix IDE**: [https://remix.ethereum.org](https://remix.ethereum.org)
- **Issue Tracker**: [GitHub Issues](https://github.com/zama-ai/fhevm-remix-plugin/issues)

## 📞 Support

- **Documentation**: Check our comprehensive docs
- **Community**: Join our Discord server
- **Issues**: Report bugs on GitHub
- **Email**: Contact us at support@zama.ai

## 🏆 Acknowledgments

- **Zama Team** - For FHEVM technology and support
- **Ethereum Foundation** - For the underlying blockchain infrastructure
- **Remix Team** - For the excellent IDE platform
- **Community Contributors** - For feedback and improvements

---

**Built with ❤️ by kk86982tom**

*Enabling privacy-preserving smart contracts through homomorphic encryption*

## 👨‍💻 Author

**kk86982tom** - *Lead Developer & Architect*
- GitHub: [@kk86982tom](https://github.com/kk86982tom)
- Email: juwen002@gmail.com


*This project represents original work and innovation in FHEVM integration. Please respect intellectual property and provide proper attribution when using or referencing this code.*
