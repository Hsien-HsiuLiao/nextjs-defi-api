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

create .env in root directory, example

```
INFURA_URL=
PRIVATE_KEY=
```

login to infura, get INFURA_URL, use ethereum mainnet

get test PRIVATE_KEY https://vanity-eth.tk/


`nvm install 16.15.1`

`npm install`

`npm start`

this address has some cDAI/DAI 0x0d0289e9f3eae696fa38e86fc4456228dc1792a7 , you can find other addresses like this on etherscan by
- searching for the contract of cDAI
- search last transactions, inspect sending address for DAI/cDAI


`curl http://localhost:3001/tokenBalance/cDai/0x0d0289e9f3eae696fa38e86fc4456228dc1792a7`

should see response like
```
{"cToken":"cDai","address":"0x0d0289e9f3eae696fa38e86fc4456228dc1792a7","tokenBalance":"20067039275930298021"}
```

`curl http://localhost:3001/cTokenBalance/cDai/0x0d0289e9f3eae696fa38e86fc4456228dc1792a7`

should see response like
```
{"cToken":"cDai","address":"0x0d0289e9f3eae696fa38e86fc4456228dc1792a7","cTokenBalance":"82611382312"}
```



### Web3 contract instance (need ABI and address of smart contract)

https://compound.finance/docs#networks 

https://docs.compound.finance/v2/#networks

![](./screenshots/compound_docs.png)

config.json has cBatAddress, cDaiAddress, cTokenABI, ERC20ABI

### Deployed to ~~~Heroku~~~

heroku no longer free, will use AWS Lambda

https://pure-ridge-83476.herokuapp.com/

test: `curl https://pure-ridge-83476.herokuapp.com/tokenBalance/cDai/0x0d0289e9f3eae696fa38e86fc4456228dc1792a7`

### To do

add other endpoints for functions from Compound's smart contact

add endpoints for other DeFi protocols (UniSwap, MakerDAO) https://defipulse.com/

https://compound.finance/docs

https://medium.com/compound-finance/compound-ethereum-api-with-infura-1f5c555fd4a2