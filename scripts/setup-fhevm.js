const path = require('path');

// Temporary mock functions for testing
async function initFhevm() {
  console.log('Mock: FHEVM initialized');
}

async function encryptU32(value) {
  console.log(`Mock: Encrypting ${value}`);
  // Return a mock encrypted value
  return new Uint8Array([0x01, 0x02, 0x03, 0x04]);
}

/**
 * Setup FHEVM encryption for deployment
 * Generates encrypted initial supply for ConfidentialERC20 deployment
 */
async function main() {
  try {
    console.log('🔐 Setting up FHEVM encryption...');

    // Get initial supply from command line argument or use default
    const supplyCleartext = process.argv[2] ? parseInt(process.argv[2]) : 1_000_000;
    
    if (isNaN(supplyCleartext) || supplyCleartext <= 0) {
      console.error('❌ Invalid initial supply. Please provide a positive number.');
      console.log('Usage: npm run setup:fhe <initial_supply>');
      console.log('Example: npm run setup:fhe 1000000');
      process.exit(1);
    }

    console.log(`📊 Initial supply (cleartext): ${supplyCleartext.toLocaleString()}`);

    // Initialize FHEVM
    console.log('⚡ Initializing FHEVM client...');
    await initFhevm();
    console.log('✅ FHEVM client initialized');

    // Encrypt the initial supply
    console.log('🔒 Encrypting initial supply...');
    const encryptedSupply = await encryptU32(supplyCleartext);
    
    // Convert to hex string for storage
    const encryptedHex = Array.from(encryptedSupply)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const encryptedWithPrefix = '0x' + encryptedHex;

    console.log('✅ Encryption completed!');
    console.log('\n📝 Results:');
    console.log('─'.repeat(60));
    console.log(`Cleartext value: ${supplyCleartext.toLocaleString()}`);
    console.log(`Encrypted (hex): ${encryptedWithPrefix}`);
    console.log(`Byte length: ${encryptedSupply.length}`);
    console.log('─'.repeat(60));

    // Generate .env content
    console.log('\n📋 Add this to your .env file:');
    console.log('─'.repeat(40));
    console.log(`TOKEN_NAME="My Confidential Token"`);
    console.log(`TOKEN_SYMBOL="MCT"`);
    console.log(`INITIAL_SUPPLY_ENC="${encryptedWithPrefix}"`);
    console.log('─'.repeat(40));

    console.log('\n🚀 Next steps:');
    console.log('1. Copy the above environment variables to your .env file');
    console.log('2. Set your PRIVATE_KEY in .env (deployer account private key)');
    console.log('3. Ensure your deployer account has Sepolia ETH');
    console.log('4. Run: npm run deploy -- --network sepolia');

    console.log('\n💡 Note: This script uses mock encryption for demonstration');
    console.log('In production, integrate with actual fhevmjs library');

  } catch (error) {
    console.error('❌ FHEVM setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Ensure fhevmjs library is properly installed');
    console.log('- Check if the specified version is available');
    console.log('- Verify network connectivity for FHEVM client initialization');
    
    process.exit(1);
  }
}

// Show usage if no arguments provided
if (process.argv.length < 3) {
  console.log('🔐 FHEVM Setup Script');
  console.log('Usage: npm run setup:fhe <initial_supply>');
  console.log('Example: npm run setup:fhe 1000000');
  console.log('\nThis script will:');
  console.log('- Initialize FHEVM client');
  console.log('- Encrypt the initial supply amount');
  console.log('- Generate environment variables for deployment');
}

// Execute setup
main()
  .then(() => {
    console.log('\n✅ Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });