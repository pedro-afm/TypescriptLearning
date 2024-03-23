import * as crypto from "crypto";

// Define the Block class
class Block {
  public timestamp: number;
  public data: any;
  public previousHash: string;
  public hash: string;
  public nonce: number;

  // Constructor to initialize block properties
  constructor(timestamp: number, data: any, previousHash: string = "") {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash(); // Calculate hash for the current block
    this.nonce = 0; // Nonce used in mining
  }

  // Function to calculate hash for the block
  calculateHash(): string {
    return crypto
      .createHash("sha256")
      .update(
        `${this.timestamp}${JSON.stringify(this.data)}${this.previousHash}${
          this.nonce
        }`
      )
      .digest("hex");
  }

  // Function to mine the block with given difficulty
  mineBlock(difficulty: number): void {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++; // Increment nonce
      this.hash = this.calculateHash(); // Recalculate hash
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

// Define the Blockchain class
class BlockChain {
  public chain: Block[];
  public difficulty: number;

  // Constructor to initialize the blockchain with genesis block
  constructor() {
    this.chain = [this.createGenesisBlock()]; // Create genesis block
    this.difficulty = 2; // Set mining difficulty
  }

  // Function to create the genesis block
  createGenesisBlock(): Block {
    return new Block(Date.now(), "Genesis Block", "0");
  }

  // Function to get the latest block in the blockchain
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  // Function to add a new block to the blockchain
  addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash; // Set previous hash
    newBlock.mineBlock(this.difficulty); // Mine the new block
    this.chain.push(newBlock); // Add the new block to the chain
  }

  // Function to validate the integrity of the blockchain
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if the current block's hash is valid
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Check if the current block's previous hash matches the previous block's hash
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true; // If all blocks are valid, return true
  }
}

// Create a new blockchain instance
const myBlockChain = new BlockChain();

// Mine the first block
console.log("Mining Block 1...");
myBlockChain.addBlock(new Block(Date.now(), { amount: 4 }));

// Mine the second block
console.log("Mining Block 2...");
myBlockChain.addBlock(new Block(Date.now(), { amount: 8 }));

// Check if the blockchain is valid
console.log(`Is blockchain valid? ${myBlockChain.isChainValid()}`);
