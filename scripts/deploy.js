const hre = require("hardhat");

async function main() {
  const TodoList = await hre.ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();

  await todoList.waitForDeployment();
  
  const address = await todoList.getAddress();
  console.log("TodoList deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 