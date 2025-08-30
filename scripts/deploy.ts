import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Deploy ConfidentialERC20 contract to Sepolia testnet
 */
async function main(): Promise<void> {
  console.log('Deploying ConfidentialERC20 contract...');

  // Read deployment parameters from environment
  const tokenName = process.env.TOKEN_NAME || 'Confidential Token';
  const tokenSymbol = process.env.TOKEN_SYMBOL || 'CTKN';
  const initialSupplyEnc = process.env.INITIAL_SUPPLY_ENC;

  if (!initialSupplyEnc) {
    console.error('❌ INITIAL_SUPPLY_ENC not found in environment variables');
    console.log('Please run: npm run setup:fhe <amount>');
    console.log('Then add the output to your .env file as INITIAL_SUPPLY_ENC=<encrypted_value>');
    process.exit(1);
  }

  console.log(`Token Name: ${tokenName}`);
  console.log(`Token Symbol: ${tokenSymbol}`);
  console.log(`Encrypted Initial Supply: ${initialSupplyEnc}`);

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying from account: ${deployer.address}`);

    // Check balance
    const balance = await deployer.getBalance();
    console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);

    if (balance.eq(0)) {
      throw new Error('Deployer account has no ETH balance');
    }

    // Get contract factory
    const ConfidentialERC20 = await ethers.getContractFactory('ConfidentialERC20');

    // Convert hex string to bytes for deployment
    let encryptedSupplyBytes: string;
    if (initialSupplyEnc.startsWith('0x')) {
      encryptedSupplyBytes = initialSupplyEnc;
    } else {
      // Assume it's base64 or hex without 0x prefix
      encryptedSupplyBytes = '0x' + initialSupplyEnc;
    }

    console.log('Deploying contract...');
    const contract = await ConfidentialERC20.deploy(
      tokenName,
      tokenSymbol, 
      encryptedSupplyBytes
    );

    console.log('Waiting for deployment transaction...');
    await contract.deployed();

    console.log('✅ ConfidentialERC20 deployed successfully!');
    console.log(`📄 Contract address: ${contract.address}`);
    console.log(`🔗 Transaction hash: ${contract.deployTransaction.hash}`);
    
    // Verify deployment
    const deployedName = await contract.name();
    const deployedSymbol = await contract.symbol();
    console.log(`✓ Verified - Name: ${deployedName}, Symbol: ${deployedSymbol}`);

    // Save deployment info to file
    const deploymentInfo = {
      contractAddress: contract.address,
      transactionHash: contract.deployTransaction.hash,
      deployer: deployer.address,
      tokenName: deployedName,
      tokenSymbol: deployedSymbol,
      timestamp: new Date().toISOString(),
      network: 'sepolia'
    };

    console.log('\n📝 Deployment Summary:');
    console.log(JSON.stringify(deploymentInfo, null, 2));

  } catch (error: any) {
    console.error('❌ Deployment failed:', error.message);
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      console.log('💡 Please add some Sepolia ETH to your deployer account');
    } else if (error.code === 'NETWORK_ERROR') {
      console.log('💡 Please check your network connection and FHEVM_GATEWAY URL');
    }
    
    process.exit(1);
  }
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Deployment script failed:', error);
    process.exit(1);
  });