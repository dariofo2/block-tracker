# Block Tracker

BlockTracker monitor Blockchain Accounts

## How it works

### Backend

#### Add new Account

1. Add an Account of Blockchain
2. The backend gets all transactions from 2 months ago to last blocked checked (configurable to Big Data in .env)
3. Account is Added to keep receiving new transactions

#### Each 15 seconds

1. Get the last block checked of all accounts
2. Get Transactions from last block to (Last Blockchain Mined Block - 1) 
3. Set The last Block for further checks

### Frontend


## Things

### ERC20 

ERC20 tokens for now are grouped in ERC20 only because there are lot of ERC20 contracts and they have to be obtained manual each one

### API Indexer

We use Etherscan API to get Transactions, because we have limit on free Infura API

### Quantity of Past Transactions

Only 2 months by default but configurable

### Refresh time of Blocks

15 seconds, because each block duration is 15 secs, to await always to be finished the block, if not it gives partial data

### Events??

We don't use events cause is so limited in Free Versions and lot of Nodes. Not efficient and not trust on taking all the transactions.

### Reorgs

We dont care for now about Reorgs, but we will work about em