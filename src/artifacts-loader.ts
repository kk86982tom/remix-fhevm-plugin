import { ContractArtifacts } from './types/index';

export async function loadConfidentialERC20Artifacts(): Promise<ContractArtifacts> {
  try {
    // Load actual compiled artifacts
    const response = await fetch('/artifacts/contracts/ConfidentialERC20.sol/ConfidentialERC20.json');
    if (!response.ok) {
      throw new Error(`Failed to load artifacts: ${response.status}`);
    }
    
    const artifacts = await response.json();
    
    return {
      contractName: artifacts.contractName,
      abi: artifacts.abi,
      bytecode: artifacts.bytecode
    };
  } catch (error) {
    console.error('Failed to load ConfidentialERC20 artifacts:', error);
    throw new Error('Failed to load ConfidentialERC20 artifacts. Ensure contracts are compiled with "npm run compile".');
  }
}
