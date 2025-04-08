const hre = require("hardhat");

async function main() {
  // Get the contract instance
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
  const todoList = TodoList.attach(contractAddress);

  // Create a new task
  console.log("Creating a new task...");
  const tx1 = await todoList.createTask("Complete the DApp tutorial");
  await tx1.wait();
  console.log("Task created!");

  // Get task count
  const taskCount = await todoList.taskCount();
  console.log(`Current task count: ${taskCount}`);

  // Get task details
  const task = await todoList.tasks(1);
  console.log(`Task 1: ${task.content}, Completed: ${task.completed}`);

  // Toggle task completion
  console.log("Toggling task completion...");
  const tx2 = await todoList.toggleCompleted(1);
  await tx2.wait();
  
  // Get updated task details
  const updatedTask = await todoList.tasks(1);
  console.log(`Task 1 (updated): ${updatedTask.content}, Completed: ${updatedTask.completed}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 