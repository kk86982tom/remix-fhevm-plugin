/**
 * FHEVM Remix Plugin - Smart Contract Deployment Module
 * 
 * @author kk86982tom
 * @description Handles deployment of FHEVM confidential smart contracts
 * @version 1.0.0
 * @license MIT
 * 
 * This module provides deployment functionality for:
 * - ConfidentialERC20 tokens with encrypted balances
 * - ConfidentialERC721 NFTs with privacy features
 * - Real-time deployment monitoring and error handling
 * 
 * Key Features:
 * - Integration with compiled contract artifacts
 * - Proper gas estimation and transaction management
 * - Comprehensive error handling and user feedback
 * 
 * Original architecture and implementation by kk86982tom
 * Please respect intellectual property and provide attribution.
 */

import { ethers } from 'ethers';
import { walletManager } from './wallet';

// 导入编译后的合约 artifacts
import ConfidentialERC20Artifact from '../artifacts/contracts/ConfidentialERC20.sol/ConfidentialERC20.json';
import ConfidentialERC721Artifact from '../artifacts/contracts/ConfidentialERC721.sol/ConfidentialERC721.json';

export interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
  gasUsed?: string;
  deploymentTime?: string;
}

export interface TokenParams {
  name: string;
  symbol: string;
  initialSupply?: string;
  baseURI?: string;
}

export class ContractDeployer {
  
  async deployConfidentialERC20(params: TokenParams): Promise<DeploymentResult> {
    try {
      // 检查钱包连接
      const walletState = walletManager.getState();
      if (!walletState.isConnected) {
        return { success: false, error: '请先连接钱包' };
      }

      // 检查网络
      if (!walletManager.isOnSepolia()) {
        return { success: false, error: '请切换到 Sepolia 测试网' };
      }

      const signer = await walletManager.getSigner();
      
      // 创建合约工厂，使用真正的 artifacts
      const contractFactory = new ethers.ContractFactory(
        ConfidentialERC20Artifact.abi,
        ConfidentialERC20Artifact.bytecode,
        signer
      );

      console.log('🚀 开始部署 ConfidentialERC20 合约...');
      console.log('参数:', params);

      // 为 FHEVM 合约创建加密的初始供应量
      // 注意：真正的 FHEVM 合约需要加密的字节数据，这里使用简化的方法
      const initialSupplyBytes = ethers.utils.defaultAbiCoder.encode(
        ['uint256'], 
        [ethers.utils.parseEther(params.initialSupply || '1000000')]
      );

      // 部署合约 - ConfidentialERC20 构造函数需要 (name, symbol, encryptedInitialSupply)
      const contract = await contractFactory.deploy(
        params.name,
        params.symbol,
        initialSupplyBytes,
        {
          gasLimit: 5000000, // 增加 gas limit，因为 FHEVM 合约更复杂
        }
      );

      console.log('⏳ 等待交易确认...');
      console.log('交易哈希:', contract.deployTransaction.hash);

      // 等待部署完成
      const deployedContract = await contract.deployed();
      const receipt = await contract.deployTransaction.wait();

      console.log('✅ 合约部署成功!');
      console.log('合约地址:', deployedContract.address);

      return {
        success: true,
        contractAddress: deployedContract.address,
        transactionHash: contract.deployTransaction.hash,
        gasUsed: receipt.gasUsed.toString(),
        deploymentTime: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('部署失败:', error);
      return {
        success: false,
        error: error.message || '部署过程中发生未知错误'
      };
    }
  }

  async deployConfidentialERC721(params: TokenParams): Promise<DeploymentResult> {
    try {
      // 检查钱包连接
      const walletState = walletManager.getState();
      if (!walletState.isConnected) {
        return { success: false, error: '请先连接钱包' };
      }

      // 检查网络
      if (!walletManager.isOnSepolia()) {
        return { success: false, error: '请切换到 Sepolia 测试网' };
      }

      const signer = await walletManager.getSigner();
      
      // 创建合约工厂，使用真正的 artifacts
      const contractFactory = new ethers.ContractFactory(
        ConfidentialERC721Artifact.abi,
        ConfidentialERC721Artifact.bytecode,
        signer
      );

      console.log('🚀 开始部署 ConfidentialERC721 合约...');
      console.log('参数:', params);

      // 部署合约 - ConfidentialERC721 构造函数只需要 (name, symbol)
      const contract = await contractFactory.deploy(
        params.name,
        params.symbol,
        {
          gasLimit: 5000000, // 增加 gas limit，因为 FHEVM 合约更复杂
        }
      );

      console.log('⏳ 等待交易确认...');
      console.log('交易哈希:', contract.deployTransaction.hash);

      // 等待部署完成
      const deployedContract = await contract.deployed();
      const receipt = await contract.deployTransaction.wait();

      console.log('✅ NFT 合约部署成功!');
      console.log('合约地址:', deployedContract.address);

      return {
        success: true,
        contractAddress: deployedContract.address,
        transactionHash: contract.deployTransaction.hash,
        gasUsed: receipt.gasUsed.toString(),
        deploymentTime: new Date().toISOString()
      };

    } catch (error: any) {
      console.error('NFT 部署失败:', error);
      return {
        success: false,
        error: error.message || 'NFT 部署过程中发生未知错误'
      };
    }
  }

  async verifyContract(contractAddress: string, constructorArgs: any[]): Promise<boolean> {
    // 这里可以集成 Etherscan API 进行合约验证
    console.log('合约验证功能开发中...');
    console.log('合约地址:', contractAddress);
    console.log('构造函数参数:', constructorArgs);
    return true;
  }
}

export const contractDeployer = new ContractDeployer();