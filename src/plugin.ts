// Export empty object to make this file a module (enables top-level await)
export {};

// 加载 ConfidentialERC20 合约构件
async function loadConfidentialERC20Artifacts() {
  try {
    // 从 artifacts 目录加载合约构件
    const artifactPath = 'contracts/ConfidentialERC20.sol/ConfidentialERC20.json';
    const artifact = await fetch(`./artifacts/${artifactPath}`).then(res => res.json());
    
    return {
      contractName: 'ConfidentialERC20',
      abi: artifact.abi,
      bytecode: artifact.bytecode,
      artifact: artifact
    };
  } catch (error) {
    console.error('Failed to load contract artifacts:', error);
    // 返回默认的合约信息
    return {
      contractName: 'ConfidentialERC20',
      abi: [],
      bytecode: '0x',
      artifact: null
    };
  }
}

// 加载 ConfidentialERC721 合约构件
async function loadConfidentialERC721Artifacts() {
  try {
    // 从 artifacts 目录加载合约构件
    const artifactPath = 'contracts/ConfidentialERC721.sol/ConfidentialERC721.json';
    const artifact = await fetch(`./artifacts/${artifactPath}`).then(res => res.json());
    
    return {
      contractName: 'ConfidentialERC721',
      abi: artifact.abi,
      bytecode: artifact.bytecode,
      artifact: artifact
    };
  } catch (error) {
    console.error('Failed to load NFT contract artifacts:', error);
    // 返回默认的合约信息
    return {
      contractName: 'ConfidentialERC721',
      abi: [],
      bytecode: '0x',
      artifact: null
    };
  }
}

// 部署 ConfidentialERC20 合约的函数
async function deployConfidentialERC20(params: any, encryptedSupply: any, supply: any) {
  // Load contract artifacts for real deployment
  console.log('📋 Loading contract artifacts...');
  const contractArtifacts = await loadConfidentialERC20Artifacts();
  
  console.log('🚀 Deploying ConfidentialERC20 to testnet...');
  console.log('- Contract:', contractArtifacts.contractName);
  console.log('- Name:', params.name);
  console.log('- Symbol:', params.symbol);
  console.log('- Encrypted Supply:', bytesToHex(encryptedSupply));
  
  // Deploy contract to testnet
  const signer = getSigner();
  const { ethers } = await import('ethers');
  
  const contractFactory = new ethers.ContractFactory(
    contractArtifacts.abi,
    contractArtifacts.bytecode,
    signer
  );

  console.log('📤 Sending deployment transaction...');
  const contract = await contractFactory.deploy(
    params.name,
    params.symbol,
    encryptedSupply,
    {
      gasLimit: 3000000, // Set appropriate gas limit
    }
  );

  console.log('⏳ Waiting for deployment confirmation...');
  console.log(`📋 Transaction Hash: ${contract.deployTransaction.hash}`);
  
  const deployedContract = await contract.deployed();
  
  console.log('✅ ConfidentialERC20 deployed successfully!');
  console.log(`📍 Contract Address: ${deployedContract.address}`);
  console.log(`🔗 Transaction Hash: ${contract.deployTransaction.hash}`);
  console.log(`⛽ Gas Used: ${contract.deployTransaction.gasLimit?.toString()}`);
  
  // Update UI with deployment results
  const resultMessage = `
    ✅ ERC20 Deployment Successful!
    
    📍 Contract Address: ${deployedContract.address}
    🔗 Transaction Hash: ${contract.deployTransaction.hash}
    📋 Token Name: ${params.name}
    🏷️ Token Symbol: ${params.symbol}
    💰 Initial Supply: ${supply} (encrypted)
    
    🌐 View on Explorer: https://sepolia.etherscan.io/tx/${contract.deployTransaction.hash}
  `;
  
  // Show success message in UI
  const resultsDiv = document.getElementById('results');
  if (resultsDiv) {
    resultsDiv.innerHTML = `<div class="success">${resultMessage.replace(/\n/g, '<br>')}</div>`;
  }
}

// 辅助函数声明（需要在其他地方实现）
declare function bytesToHex(bytes: any): string;
declare function getSigner(): any;