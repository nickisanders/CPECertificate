# CPECertificate NFT Project

This project demonstrates how to create and display CPE (Continuing Professional Education) certificate NFTs on a locally hosted website. The project uses a Solidity smart contract deployed on a local Hardhat blockchain network, and a React frontend that connects to MetaMask to read and display NFT data.

## Project Structure

- **Hardhat (Backend)**: Contains the smart contract and deployment scripts.
- **React (Frontend)**: Contains the code to connect to the blockchain, fetch NFT details, and display them.

## Prerequisites

- **Node.js** and **npm** installed.
- **MetaMask** extension installed in your browser.
- **Hardhat**: Ethereum development environment.
- **React**: Frontend framework.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cpecertificate-nft.git
cd cpecertificate-nft
```

### 2. Install Dependencies

Install the necessary dependencies for both Hardhat and React:

```bash
# Install dependencies for the Hardhat backend
npm install

# Move to the frontend directory
cd frontend

# Install dependencies for the React frontend
npm install
```

### 3. Running the Local Hardhat Network

To deploy and test the smart contract, we’ll use Hardhat’s local blockchain network.

1. Go back to the root directory of the project if you are not already there:

```bash
cd ..
```

2. Start the Hardhat node:

```bash
npx hardhat node
```

This command will launch a local blockchain network on http://localhost:8545. You should see 20 test accounts with private keys and a default balance of 10,000 ETH each. Keep this terminal window open, as it will simulate a blockchain.

### 4. Deploy the Smart Contract

In a new terminal window, deploy the smart contract to the local Hardhat network:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

After deploying, the script should output the address of the deployed contract. Copy this address, as you’ll need it to interact with the contract.

### 5. Update the Frontend with the Contract Address and ABI

1. Open frontend/src/App.js and replace YOUR_DEPLOYED_CONTRACT_ADDRESS with the address of the deployed contract.

2. Copy the contract ABI:

After compiling and deploying, the ABI should be located in artifacts/contracts/CPECertificate.sol/CPECertificate.json.
Copy the "abi" array from this file.

3. Paste the ABI into frontend/src/CPECertificateABI.json.

### 6. Mint an NFT

Run the minting script:

```bash
npx hardhat run scripts/mintCertificate.js --network localhost
```

### 7. Start the React Frontend
Navigate to the frontend directory and start the development server:

```bash
cd frontend
npm start
```

This will start the React app on http://localhost:3000.

### 8. Connect MetaMask to the Local Hardhat Network

1. Open MetaMask and go to Settings > Networks > Add Network.
2. Enter the following details:
- Network Name: Localhost 8545
- New RPC URL: http://localhost:8545
- Chain ID: 31337 (Hardhat's default)
3. Save the network.
4. Import one of the test accounts from the Hardhat node:
- Copy a private key from the Hardhat node output and import it into MetaMask. This account will have a balance and be able to interact with the contract.

### 9. Viewing the NFTs
- Once connected, the frontend should display the NFT information if the wallet owns any CPECertificate NFTs.
- You can click the Refresh NFTs button to check for any newly minted NFTs.

### Troubleshooting
- If you don’t see the NFTs, ensure that the contract address and ABI in the frontend are correct.
- Make sure MetaMask is connected to the local Hardhat network (localhost 8545) and is using an account with minted NFTs.

### Additional Notes
- You can edit the minting script to create additional NFTs with different details.
- This setup is for local testing. For deployment on a public network, you’ll need to update the configuration and ensure the contract is deployed to the chosen network.

