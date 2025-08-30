/**
 * FHEVM Remix Plugin - Main Application Entry Point
 * 
 * @author kk86982tom
 * @description A comprehensive Remix IDE plugin for deploying FHEVM contracts
 * @version 1.0.0
 * @license MIT
 * 
 * This file contains the main application logic and UI components.
 * Original work by kk86982tom - Please respect intellectual property.
 */

import { applyStyles } from './ui';
import { walletManager, WalletState } from './wallet';
import { contractDeployer, TokenParams, DeploymentResult } from './contracts';

console.log('FHEVM Remix Plugin loaded - Created by kk86982tom');

// 应用样式
applyStyles();

// 全局状态
let currentWalletState: WalletState = walletManager.getState();

// 创建完整的 UI
function createUI() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>🔐 FHEVM Remix Plugin</h1>
      <p>全同态加密虚拟机 Remix 插件 - 支持隐私保护的智能合约部署</p>
      
      <!-- 钱包连接区域 -->
      <div id="walletSection" style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
        <h3>💼 钱包连接</h3>
        <div id="walletStatus"></div>
        <div id="walletActions" style="margin-top: 10px;"></div>
      </div>

      <!-- 合约部署选项卡 -->
      <div style="margin: 20px 0;">
        <div style="border-bottom: 1px solid #ddd;">
          <button id="erc20Tab" class="tab-button active" style="padding: 10px 20px; border: none; background: #007bff; color: white; cursor: pointer; margin-right: 5px;">
            ERC20 代币
          </button>
          <button id="erc721Tab" class="tab-button" style="padding: 10px 20px; border: none; background: #6c757d; color: white; cursor: pointer;">
            ERC721 NFT
          </button>
        </div>

        <!-- ERC20 部署表单 -->
        <div id="erc20Panel" class="tab-panel" style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h3>部署 ConfidentialERC20 代币合约</h3>
          <form id="erc20Form">
            <div style="margin-bottom: 15px;">
              <label for="erc20Name">代币名称:</label><br>
              <input type="text" id="erc20Name" placeholder="例如: My Confidential Token" style="width: 100%; padding: 8px; margin-top: 5px;" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label for="erc20Symbol">代币符号:</label><br>
              <input type="text" id="erc20Symbol" placeholder="例如: MCT" style="width: 100%; padding: 8px; margin-top: 5px;" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label for="erc20Supply">初始供应量 (ETH):</label><br>
              <input type="number" id="erc20Supply" placeholder="例如: 1000000" style="width: 100%; padding: 8px; margin-top: 5px;" required>
            </div>
            
            <button type="submit" style="background: #28a745; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              🚀 部署 ERC20 合约
            </button>
          </form>
        </div>

        <!-- ERC721 部署表单 -->
        <div id="erc721Panel" class="tab-panel" style="display: none; padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h3>部署 ConfidentialERC721 NFT 合约</h3>
          <form id="erc721Form">
            <div style="margin-bottom: 15px;">
              <label for="erc721Name">NFT 集合名称:</label><br>
              <input type="text" id="erc721Name" placeholder="例如: My Confidential NFTs" style="width: 100%; padding: 8px; margin-top: 5px;" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label for="erc721Symbol">NFT 符号:</label><br>
              <input type="text" id="erc721Symbol" placeholder="例如: MCN" style="width: 100%; padding: 8px; margin-top: 5px;" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label for="erc721BaseURI">基础 URI:</label><br>
              <input type="url" id="erc721BaseURI" placeholder="例如: https://api.example.com/metadata/" style="width: 100%; padding: 8px; margin-top: 5px;">
            </div>
            
            <button type="submit" style="background: #17a2b8; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
              🎨 部署 NFT 合约
            </button>
          </form>
        </div>
      </div>

      <!-- 部署结果区域 -->
      <div id="results" style="margin-top: 20px;"></div>
    </div>
  `;

  setupEventListeners();
  updateWalletUI();
}

// 设置事件监听器
function setupEventListeners() {
  // 选项卡切换
  const erc20Tab = document.getElementById('erc20Tab');
  const erc721Tab = document.getElementById('erc721Tab');
  const erc20Panel = document.getElementById('erc20Panel');
  const erc721Panel = document.getElementById('erc721Panel');

  erc20Tab?.addEventListener('click', () => {
    erc20Tab.style.background = '#007bff';
    erc721Tab!.style.background = '#6c757d';
    erc20Panel!.style.display = 'block';
    erc721Panel!.style.display = 'none';
  });

  erc721Tab?.addEventListener('click', () => {
    erc721Tab.style.background = '#007bff';
    erc20Tab!.style.background = '#6c757d';
    erc721Panel!.style.display = 'block';
    erc20Panel!.style.display = 'none';
  });

  // ERC20 表单提交
  const erc20Form = document.getElementById('erc20Form') as HTMLFormElement;
  erc20Form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('erc20Name') as HTMLInputElement;
    const symbolInput = document.getElementById('erc20Symbol') as HTMLInputElement;
    const supplyInput = document.getElementById('erc20Supply') as HTMLInputElement;
    
    const params: TokenParams = {
      name: nameInput.value,
      symbol: symbolInput.value,
      initialSupply: supplyInput.value
    };

    await deployContract('erc20', params);
  });

  // ERC721 表单提交
  const erc721Form = document.getElementById('erc721Form') as HTMLFormElement;
  erc721Form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('erc721Name') as HTMLInputElement;
    const symbolInput = document.getElementById('erc721Symbol') as HTMLInputElement;
    const baseURIInput = document.getElementById('erc721BaseURI') as HTMLInputElement;
    
    const params: TokenParams = {
      name: nameInput.value,
      symbol: symbolInput.value,
      baseURI: baseURIInput.value
    };

    await deployContract('erc721', params);
  });

  // 钱包状态监听
  walletManager.onStateChange((state) => {
    currentWalletState = state;
    updateWalletUI();
  });
}

// 更新钱包 UI
function updateWalletUI() {
  const walletStatus = document.getElementById('walletStatus');
  const walletActions = document.getElementById('walletActions');
  
  if (!walletStatus || !walletActions) return;

  if (currentWalletState.isConnected) {
    const isOnSepolia = walletManager.isOnSepolia();
    const networkStatus = isOnSepolia ? 
      '<span style="color: #28a745;">✅ Sepolia 测试网</span>' : 
      '<span style="color: #dc3545;">❌ 请切换到 Sepolia</span>';

    walletStatus.innerHTML = `
      <div>
        <strong>钱包地址:</strong> ${currentWalletState.address}<br>
        <strong>网络状态:</strong> ${networkStatus}<br>
        <strong>链 ID:</strong> ${currentWalletState.chainId}
      </div>
    `;

    walletActions.innerHTML = `
      <button onclick="disconnectWallet()" style="background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
        断开连接
      </button>
      ${!isOnSepolia ? `
        <button onclick="switchToSepolia()" style="background: #ffc107; color: black; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
          切换到 Sepolia
        </button>
      ` : ''}
    `;
  } else {
    walletStatus.innerHTML = '<div style="color: #dc3545;">❌ 钱包未连接</div>';
    walletActions.innerHTML = `
      <button onclick="connectWallet()" style="background: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
        连接 MetaMask
      </button>
    `;
  }
}

// 部署合约
async function deployContract(type: 'erc20' | 'erc721', params: TokenParams) {
  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) return;

  // 显示部署开始信息
  resultsDiv.innerHTML = `
    <div class="info">
      <h4>🚀 开始部署${type === 'erc20' ? 'ERC20 代币' : 'ERC721 NFT'}合约...</h4>
      <p><strong>合约类型:</strong> Confidential${type === 'erc20' ? 'ERC20' : 'ERC721'}</p>
      <p><strong>名称:</strong> ${params.name}</p>
      <p><strong>符号:</strong> ${params.symbol}</p>
      ${params.initialSupply ? `<p><strong>初始供应量:</strong> ${params.initialSupply} ETH</p>` : ''}
      ${params.baseURI ? `<p><strong>基础 URI:</strong> ${params.baseURI}</p>` : ''}
      <p>⏳ 正在处理部署请求，请在 MetaMask 中确认交易...</p>
    </div>
  `;

  try {
    let result: DeploymentResult;
    
    if (type === 'erc20') {
      result = await contractDeployer.deployConfidentialERC20(params);
    } else {
      result = await contractDeployer.deployConfidentialERC721(params);
    }

    if (result.success) {
      // 部署成功
      resultsDiv.innerHTML = `
        <div class="success">
          <h4>✅ ${type === 'erc20' ? 'ERC20 代币' : 'ERC721 NFT'}合约部署成功！</h4>
          
          <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <h5>📋 部署信息</h5>
            <p><strong>📍 合约地址:</strong> 
              <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${result.contractAddress}</code>
              <button onclick="copyToClipboard('${result.contractAddress}')" style="margin-left: 10px; padding: 2px 8px; font-size: 12px;">复制</button>
            </p>
            
            <p><strong>🔗 交易哈希:</strong> 
              <code style="background: #e9ecef; padding: 2px 6px; border-radius: 3px;">${result.transactionHash}</code>
              <button onclick="copyToClipboard('${result.transactionHash}')" style="margin-left: 10px; padding: 2px 8px; font-size: 12px;">复制</button>
            </p>
            
            <p><strong>⛽ Gas 使用量:</strong> ${result.gasUsed}</p>
            <p><strong>⏰ 部署时间:</strong> ${new Date(result.deploymentTime!).toLocaleString()}</p>
            <p><strong>🌐 部署钱包:</strong> ${currentWalletState.address}</p>
          </div>

          <div style="margin: 15px 0;">
            <h5>🔍 区块链浏览器</h5>
            <p>
              <a href="https://sepolia.etherscan.io/address/${result.contractAddress}" target="_blank" 
                 style="color: #007bff; text-decoration: none; margin-right: 15px;">
                📄 查看合约
              </a>
              <a href="https://sepolia.etherscan.io/tx/${result.transactionHash}" target="_blank" 
                 style="color: #007bff; text-decoration: none;">
                📋 查看交易
              </a>
            </p>
          </div>

          <div style="margin: 15px 0;">
            <button onclick="verifyContract('${result.contractAddress}')" 
                    style="background: #17a2b8; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
              🔍 验证合约
            </button>
            <button onclick="deployAnother()" 
                    style="background: #28a745; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
              🚀 部署另一个合约
            </button>
          </div>
        </div>
      `;
    } else {
      // 部署失败
      resultsDiv.innerHTML = `
        <div class="error">
          <h4>❌ 合约部署失败</h4>
          <p><strong>错误信息:</strong> ${result.error}</p>
          <p>请检查：</p>
          <ul>
            <li>钱包是否连接到 Sepolia 测试网</li>
            <li>账户是否有足够的 Sepolia ETH 支付 gas 费用</li>
            <li>网络连接是否正常</li>
          </ul>
          <button onclick="deployAnother()" 
                  style="background: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
            🔄 重试部署
          </button>
        </div>
      `;
    }
  } catch (error: any) {
    resultsDiv.innerHTML = `
      <div class="error">
        <h4>❌ 部署过程中发生错误</h4>
        <p><strong>错误详情:</strong> ${error.message}</p>
        <button onclick="deployAnother()" 
                style="background: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
          🔄 重试部署
        </button>
      </div>
    `;
  }
}

// 全局函数
(window as any).connectWallet = async () => {
  await walletManager.connectWallet();
};

(window as any).disconnectWallet = () => {
  walletManager.disconnect();
};

(window as any).switchToSepolia = async () => {
  await walletManager.switchToSepolia();
};

(window as any).copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('已复制到剪贴板！');
  });
};

(window as any).verifyContract = async (contractAddress: string) => {
  alert('合约验证功能开发中...\n合约地址: ' + contractAddress);
};

(window as any).deployAnother = () => {
  const resultsDiv = document.getElementById('results');
  if (resultsDiv) {
    resultsDiv.innerHTML = '';
  }
};

// 页面加载完成后创建 UI
document.addEventListener('DOMContentLoaded', createUI);

// 如果 DOM 已经加载完成，直接创建 UI
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createUI);
} else {
  createUI();
}