import * as crypto from 'crypto';

class Block {
    public timestamp: number;
    public data: any;
    public previousHash: string;
    public hash: string;
    public nonce: number;
    
    constructor(timestamp:number, data: any, previousHash: string = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(): string {
        return crypto.createHash('sha256').update(`${this.timestamp}${JSON.stringify(this.data)}${this.previousHash}${this.nonce}`).digest('hex');
    }

    mineBlock(difficulty: number): void {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

class BlockChain {
    public chain: Block[];
    public difficulty: number;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(): Block {
        return new Block(Date.now(), 'Genesis Block', '0');
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock: Block): void {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(): boolean {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

const myBlockChain = new BlockChain();
console.log('Mining Block 1...');
myBlockChain.addBlock(new Block(Date.now(), { amount: 4 }));
console.log('Mining Block 2...');
myBlockChain.addBlock(new Block(Date.now(), { amount: 8 }));
console.log(`Is blockchain valid? ${myBlockChain.isChainValid()}`);