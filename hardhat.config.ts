import 'dotenv/config';
import '@nomiclabs/hardhat-ethers';
import { HardhatUserConfig } from 'hardhat/config';
import 'ts-node/register';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.FHEVM_GATEWAY || 'https://sepolia.gateway.zama.ai',
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20_000_000_000
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  }
};

export default config;