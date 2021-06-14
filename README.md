## Summary

REST API to interact with a DeFi protocol, built with Node.js

4 endpoints:
1. get token balance
2. get cToken balance
3. mint cToken
4. redeem cToken

![](./screenshots/architecture.png)


API for Compound, defi lending protocol https://compound.finance/

![](./screenshots/compound1.png)

![](./screenshots/compound2.png)



### Testing on local machine

`npm start`

`curl http://localhost:3000/tokenBalance/cDai/0x0d0289e9f3eae696fa38e86fc4456228dc1792a7`

`curl http://localhost:3000/cTokenBalance/cDai/0x0d0289e9f3eae696fa38e86fc4456228dc1792a7`

https://vanity-eth.tk/


### Web3 contract instance (need ABI and address of smart contract)

https://compound.finance/docs#networks 

![](./screenshots/compound_docs.png)

config.json has cBatAddress, cDaiAddress, cTokenABI, ERC20ABI