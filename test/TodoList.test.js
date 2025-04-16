const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  let todoList;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
    await todoList.waitForDeployment();
  });

  describe("Task Creation", function () {
    it("Should create a new task", async function () {
      const content = "Test task";
      await todoList.createTask(content);
      
      const task = await todoList.tasks(1);
      expect(task.content).to.equal(content);
      expect(task.completed).to.equal(false);
    });

    it("Should increment taskCount when creating a task", async function () {
      const initialCount = await todoList.taskCount();
      await todoList.createTask("Test task");
      const newCount = await todoList.taskCount();
      
      // Convert BigInt to Number for comparison
      expect(Number(newCount)).to.equal(Number(initialCount) + 1);
    });

    it("Should emit TaskCreated event", async function () {
      const content = "Test task";
      await expect(todoList.createTask(content))
        .to.emit(todoList, "TaskCreated")
        .withArgs(1, content, false);
    });
  });

  describe("Task Completion", function () {
    beforeEach(async function () {
      await todoList.createTask("Test task");
    });

    it("Should toggle task completion status", async function () {
      // Complete the task
      await todoList.toggleCompleted(1);
      let task = await todoList.tasks(1);
      expect(task.completed).to.equal(true);

      // Undo completion
      await todoList.toggleCompleted(1);
      task = await todoList.tasks(1);
      expect(task.completed).to.equal(false);
    });

    it("Should emit TaskCompleted event", async function () {
      await expect(todoList.toggleCompleted(1))
        .to.emit(todoList, "TaskCompleted")
        .withArgs(1, true);
    });
  });

  describe("Task Deletion", function () {
    beforeEach(async function () {
      await todoList.createTask("Test task");
    });

    it("Should delete a task", async function () {
      await todoList.deleteTask(1);
      const task = await todoList.tasks(1);
      expect(task.content).to.equal("");
    });

    it("Should emit TaskDeleted event", async function () {
      await expect(todoList.deleteTask(1))
        .to.emit(todoList, "TaskDeleted")
        .withArgs(1);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple tasks correctly", async function () {
      // Create multiple tasks
      await todoList.createTask("Task 1");
      await todoList.createTask("Task 2");
      await todoList.createTask("Task 3");

      // Verify task count
      const count = await todoList.taskCount();
      expect(Number(count)).to.equal(3);

      // Verify each task
      const task1 = await todoList.tasks(1);
      const task2 = await todoList.tasks(2);
      const task3 = await todoList.tasks(3);

      expect(task1.content).to.equal("Task 1");
      expect(task2.content).to.equal("Task 2");
      expect(task3.content).to.equal("Task 3");
    });

    it("Should handle empty task content", async function () {
      await todoList.createTask("");
      const task = await todoList.tasks(1);
      expect(task.content).to.equal("");
    });
  });
}); 