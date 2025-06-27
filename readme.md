# Block Tracker

BlockTracker monitor Blockchain Accounts

## Manual

1. In /backend, rename .env.schema to .env and introduce API Keys (Infura & Etherscan)
2. in /, sh ```docker compose up
3. Update DB with /dbSchema/db.sql
4. Go to http://localhost:5000

## How it works

### Backend

#### Add new Account

1. Add an Account of Blockchain
2. Account is Added to keep receiving new transactions

#### Each 15 seconds

1. Get the last block checked of all accounts
2. If last Block is null, then get all transactions from 50.000 blocks to Last Blockchain Mined block - 6 (reorgs) -1
3. Get Transactions from last block to (Last Blockchain Mined Block - 6 (Reorgs) - 1) 
4. Set The last Block for further checks

### Frontend


## About

### ERC20 

ERC20 tokens Are obtan

### API Indexer

We use Etherscan API v2 to get Transactions, because getting blocks one by one manually needs lot of calls to Infura Node and lot of time spent waiting

### Quantity of Past Transactions

Only 6 months by default but configurable

### Refresh time of Blocks

15 seconds, because each block duration is 15 secs, to await always to be finished the block, if not it gives partial data

### Events??

We don't use events cause is so limited in Free Versions and lot of Nodes. Not efficient and not trust on taking all the transactions.

### Reorgs

In Ethereum Blockchain, until 6 last Blocks can use Reorgs, so we get always transactions to lastblock - 7.
In other Chains Reorgs can be 12 or 0, so it has to be adapted manually by chain.