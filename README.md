# Terra Subgraph

[Terra](https://www.terra.money/) is a public blockchain protocol deploying a suite of algorithmic decentralized stablecoins.

This subgraph dynamically tracks the current state of Terra contracts (LUNA, UST, wUST and wLUNA), and contains derived stats for things like historical data and USD prices.

## Running Locally

Make sure to update package.json settings to point to your own graph account.

## Queries

Below are a few ways to show how to query the terra-subgraph for data. The queries show most of the information that is queryable, but there are many other filtering options that can be used, just check out the [querying api](https://thegraph.com/docs/graphql-api). These queries can be used locally or in The Graph Explorer playground.

## Entity Overviews

### Token

- **id**: Token symbol (LUNA-UST)
- **totalBurned**: Total amount of burned tokens
- **totalUsersEver**: Total amount of created users that have sent, received or burned tokens

### Transfer

- **id**: Transaction hash
- **timestamp**: Block timestamp of the event
- **from**: User that represents the sender of the transaction
- **to**: User that represents the receiver of the transaction
- **amount**: Amount in wei sent by the "from" User

### User

- **id**: Represents the address of the user
- **lunaBalance**: Balance of wLUNA tokens in wei
- **ustBalance**: Balance of wUST tokens in wei
- **txCount**: Increments by one every time the user makes a transaction

### Approval

- **id**: Transaction hash
- **owner**: Address of the tokens's owner
- **spender**: Address of the tokens's spender
- **amount**: Amount of tokens to approve

### Burn

- **id**: Transaction hash
- **timestamp**: Block timestamp of the event
- **burner**: User that reprents the sender of the Burn transaction
- **amount**: Amount of tokens to be burned

### OwnershipTransferred

- **id**: Transaction hash
- **previousOwner**: Address of the previous owner
- **newOwner**: Address of the new owner

## Example Queries

```
{
    users(first: 5) {
        id
        lunaBalance
        ustBalance
        txCount
    }
    tokens(first: 2) {
        id
        totalBurned
        totalUsersEver
    }
    transfers(first: 10) {
        id
        timestamp
        amount
        from {
            id
            ustBalance
            lunaBalance
            txCount
        }
        to {
            id
            txCount
            ustBalance
            lunaBalance
        }
    }
    approvals(first: 5) {
        id
        owner
        spender
        amount
    }
    burns(first: 5) {
        id
        timestamp
        burner
        amount
    }
    ownershipTransferreds(first: 5) {
        id
        previousOwner
        newOwner
    }
}
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Collaborators

- [**Fernando Sirni**](https://github.com/fersirni)
- [**Jose Ramirez**](https://github.com/jarcodallo), [Twitter](https://twitter.com/jarcodallo), [NPM](https://www.npmjs.com/~jarcodallo)

## License

Licensed under the MIT - see the [LICENSE](LICENSE) file for details.
