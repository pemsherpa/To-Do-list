# Blockchain To-Do List DApp

A simple decentralized To-Do List application built with Solidity, Hardhat, and a lightweight HTML/CSS/JavaScript frontend.

## Features

- Create, complete, and delete tasks on the Ethereum blockchain
- Persistent storage of tasks using smart contracts
- Simple and intuitive user interface
- MetaMask integration for blockchain interactions

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or later)
- [npm](https://www.npmjs.com/) (v6.0.0 or later)
- [MetaMask](https://metamask.io/) browser extension

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/blockchain-todo-dapp.git
   cd blockchain-todo-dapp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile the smart contract:
   ```bash
   npm run compile
   ```

## Running the Application

1. Start a local Hardhat node:

   ```bash
   npm run node
   ```

2. In a new terminal, deploy the contract to the local network:

   ```bash
   npm run deploy
   ```

   OR

   ```bash
   npm hardhat run scripts/deploy.js --network localhost
   ```

   Note the contract address that is printed in the console.

3. Update the contract address in `frontend/app.js`:

   ```javascript
   const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   ```

4. Open `frontend/index.html` in your browser using liveserver

## Connecting with MetaMask

1. Configure MetaMask to connect to your local Hardhat network:

   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

2. Import a test account:

   - When you start the Hardhat node, it prints several private keys
   - In MetaMask, click "Import Account" and paste one of those private keys

3. Click "Connect Wallet" in the application to start using the DApp.

## Project Structure

todo-dapp/
├── contracts/ # Smart contract files
│ └── TodoList.sol # Main TodoList contract
├── scripts/ # Deployment and interaction scripts
│ ├── deploy.js # Contract deployment script
│ └── interact.js # Script to interact with the contract
├── frontend/ # Frontend files
│ ├── index.html # Main HTML file
│ ├── app.js # JavaScript for the application
│ ├── styles.css # CSS styles
│ └── artifacts/ # Compiled contract artifacts
├── hardhat.config.js # Hardhat configuration
└── package.json # Project dependencies and scripts

## Testing

The project includes comprehensive tests for the smart contract. To run the tests:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The tests cover the following functionality:

- Task creation
- Task completion toggling
- Task deletion
- Event emissions
- Edge cases and multiple tasks

### Test Structure

The tests are organized into the following sections:

- Task Creation: Tests for creating new tasks
- Task Completion: Tests for toggling task completion status
- Task Deletion: Tests for deleting tasks
- Edge Cases: Tests for multiple tasks and special cases
