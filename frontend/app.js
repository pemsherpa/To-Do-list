// Add this at the beginning of the file
console.log("Initializing application...");

// Contract ABI - You'll need to replace this with your actual ABI after compiling
const contractABI =[
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        }
      ],
      "name": "TaskCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        }
      ],
      "name": "TaskCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "TaskDeleted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        }
      ],
      "name": "createTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "deleteTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "taskCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tasks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "toggleCompleted",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let contract;
let signer;

// Connect to MetaMask
async function connectWallet() {
    try {
        console.log("Connecting wallet...");
        
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask to use this dApp!');
            return;
        }
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);
        
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        console.log("Connected account:", account);
        
        console.log("Contract address:", contractAddress);
        
        // Check if contract exists at the address
        const code = await provider.getCode(contractAddress);
        console.log("Contract code:", code);
        
        if (code === '0x') {
            alert("No contract found at the specified address. Make sure you've deployed the contract and are connected to the right network.");
            return;
        }
        
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("Contract instance created");
        
        // Test the contract connection
        try {
            const count = await contract.taskCount();
            console.log("Task count:", count.toString());
        } catch (error) {
            console.error("Error calling taskCount:", error);
        }
        
        await loadTasks();
    } catch (error) {
        console.error("Error in connectWallet:", error);
        alert('Failed to connect wallet: ' + error.message);
    }
}

// Load tasks from the blockchain
async function loadTasks() {
    try {
        console.log("Loading tasks...");
        console.log("Contract:", contract);
        const taskCount = await contract.taskCount();
        const taskList = document.getElementById('tasks');
        taskList.innerHTML = '';
        
        for (let i = 1; i <= taskCount; i++) {
            const task = await contract.tasks(i);
            
            // Skip deleted tasks (in Solidity, we can't truly delete mapping entries)
            if (task.content === '') continue;
            
            addTaskToDOM(task.id.toNumber(), task.content, task.completed);
        }
    } catch (error) {
        console.error("Error loading tasks:", error);
        alert('Failed to load tasks: ' + error.message);
    }
}

// Add a task to the DOM
function addTaskToDOM(id, content, completed) {
    const taskList = document.getElementById('tasks');
    
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.dataset.id = id;
    
    const taskContent = document.createElement('span');
    taskContent.className = 'task-content' + (completed ? ' completed' : '');
    taskContent.textContent = content;
    
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-button';
    completeButton.textContent = completed ? 'Undo' : 'Complete';
    completeButton.onclick = () => toggleTaskCompletion(id);
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(id);
    
    taskActions.appendChild(completeButton);
    taskActions.appendChild(deleteButton);
    
    taskItem.appendChild(taskContent);
    taskItem.appendChild(taskActions);
    
    taskList.appendChild(taskItem);
}

// Create a new task
async function createTask() {
    // Check if contract is initialized
    if (!contract) {
        alert('Please connect your wallet first!');
        return;
    }
    
    const taskInput = document.getElementById('task-input');
    const content = taskInput.value.trim();
    
    if (content === '') {
        alert('Please enter a task!');
        return;
    }
    
    try {
        document.getElementById('loading').style.display = 'block';
        
        const tx = await contract.createTask(content);
        await tx.wait();
        
        taskInput.value = '';
        await loadTasks();
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error("Error creating task:", error);
        document.getElementById('loading').style.display = 'none';
        alert('Failed to create task: ' + error.message);
    }
}

// Toggle task completion status
async function toggleTaskCompletion(id) {
    // Check if contract is initialized
    if (!contract) {
        alert('Please connect your wallet first!');
        return;
    }
    
    try {
        document.getElementById('loading').style.display = 'block';
        
        const tx = await contract.toggleCompleted(id);
        await tx.wait();
        
        await loadTasks();
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error("Error toggling task:", error);
        document.getElementById('loading').style.display = 'none';
        alert('Failed to update task: ' + error.message);
    }
}

// Delete a task
async function deleteTask(id) {
    // Check if contract is initialized
    if (!contract) {
        alert('Please connect your wallet first!');
        return;
    }
    
    try {
        document.getElementById('loading').style.display = 'block';
        
        const tx = await contract.deleteTask(id);
        await tx.wait();
        
        await loadTasks();
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error("Error deleting task:", error);
        document.getElementById('loading').style.display = 'none';
        alert('Failed to delete task: ' + error.message);
    }
}

// Add this function to your app.js
async function testContractConnection() {
    try {
        console.log("Testing contract connection...");
        
        // Check if MetaMask is installed and connected
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask to use this dApp!');
            return;
        }
        
        // Get network information
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);
        
        // Get account information
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        console.log("Connected account:", account);
        
        // Check contract address
        console.log("Attempting to connect to contract at:", contractAddress);
        
        // Check if contract exists at the address
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
            alert("No contract found at the specified address. Make sure you've deployed the contract and are connected to the right network.");
            return;
        }
        
        console.log("Contract code exists at address");
        
        // Create contract instance
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        // Try a simple call
        try {
            const count = await contract.taskCount();
            console.log("Task count:", count.toString());
            alert("Contract connection successful! Task count: " + count.toString());
        } catch (callError) {
            console.error("Error calling taskCount():", callError);
            alert("Contract exists but taskCount() call failed: " + callError.message);
        }
    } catch (error) {
        console.error("Test connection error:", error);
        alert("Contract connection failed: " + error.message);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connect-button').addEventListener('click', connectWallet);
    document.getElementById('add-button').addEventListener('click', createTask);
    
    // Listen for Enter key in the input field
    document.getElementById('task-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createTask();
        }
    });
    
    // Listen for MetaMask account changes
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => {
            window.location.reload();
        });
    }

    // Add this to your event listeners
    document.getElementById('test-button').addEventListener('click', testContractConnection);
}); 