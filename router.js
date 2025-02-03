const Router = require('@koa/router');
const router = new Router();
const config = require('./config.json');

//web3 v4
/* const { Web3 } = require('web3');
const web3 = new Web3(process.env.INFURA_URL); */
var ethers = require('ethers');
const url = process.env.INFURA_URL;
const provider = new ethers.JsonRpcProvider(url);



// https://web3js.readthedocs.io/en/v1.3.4/web3-eth-accounts.html#wallet-add
//web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
//const adminAddress = web3.eth.accounts.wallet[0].address;
const adminAddress = wallet.address;

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const cTokens = {
  cBat: new ethers.Contract(config.cBatAddress, config.cTokenAbi, signer/*provider */),
  /* web3.eth.Contract(
   config.cTokenAbi,
   config.cBatAddress,
 ) */
  //You can also use an ENS name for the contract address
  //const daiAddress = "dai.tokens.ethers.eth";

  cDai: new /* web3.eth.Contract(
    config.cTokenAbi,
    config.cDaiAddress,
  ) */
    ethers.Contract(config.cDaiAddress, config.cTokenAbi, signer/* provider */)
};

//endpoint 1 - Token balance
//TypeError: Do not know how to serialize a BigInt
//at JSON.stringify 
//Convert to String
BigInt.prototype.toJSON = function () {
  return this.toString();
};
//Convert to Number: but this can lead to loss of precision for large BigInt values that exceed Number.MAX_SAFE_INTEGER.
/* BigInt.prototype.toJSON = function () {
    return Number(this);
}; */

router.get('/tokenBalance/:cToken/:address', async (ctx, next) => {
  //check if cToken exists
  const cToken = cTokens[ctx.params.cToken];
  if (typeof cToken === 'undefined') {
    ctx.status = 400;
    ctx.body = {
      error: `cToken ${ctx.params.cToken} does not exist`
    };
    return;
  }

  try {
    const tokenBalance = await cToken.balanceOfUnderlying(ctx.params.address);
    /* .methods
    .balanceOfUnderlying(ctx.params.address)
    .call(); */
    ctx.body = {
      cToken: ctx.params.cToken,
      address: ctx.params.address,
      tokenBalance
    };
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = {
      error: 'internal server error'
    };
  }
});

//endpoint 2 - cToken balance
router.get('/cTokenBalance/:cToken/:address', async (ctx, next) => {
  const cToken = cTokens[ctx.params.cToken];
  if (typeof cToken === 'undefined') {
    ctx.status = 400;
    ctx.body = {
      error: `cToken ${ctx.params.cToken} does not exist`
    };
    return;
  }

  try {
    const cTokenBalance = await cToken
      .methods
      .balanceOf(ctx.params.address)
      .call();
    ctx.body = {
      cToken: ctx.params.cToken,
      address: ctx.params.address,
      cTokenBalance
    };
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = {
      error: 'internal server error'
    };
  }
});

//endpoint 3 - mint cToken
//if you want to invest your token (DAI for example) into the Compound ecosystem, 
//when sending your DAI to cDAI contract, this is minting cDAI, you will get cDAI in 
//exchange for your DAI tokens. This will be an ethereum transaction and must be
//signed with a private key
//post endpoint for modifying blockchain data
router.post('/mint/:cToken/:amount', async (ctx, next) => {
  const cToken = cTokens[ctx.params.cToken];
  if (typeof cToken === 'undefined') {
    ctx.status = 400;
    ctx.body = {
      error: `cToken ${ctx.params.cToken} does not exist`
    };
    return;
  }
  const tokenAddress = await cToken
    .methods
    .underlying()
    .call();
  const token = new web3.eth.Contract(
    config.ERC20Abi,
    tokenAddress
  );
  //approve cToken to spend our token
  await token
    .methods
    .approve(cToken.options.address, ctx.params.amount)
    .send({ from: adminAddress });

  try {
    await cToken
      .methods
      .mint(ctx.params.amount)
      .send({ from: adminAddress });
    ctx.body = {
      cToken: ctx.params.cToken,
      address: adminAddress,
      amountMinted: ctx.params.amount
    };
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = {
      error: 'internal server error'
    };
  }
});

//endpoint 4 - redeem cToken
router.post('/redeem/:cToken/:amount', async (ctx, next) => {
  const cToken = cTokens[ctx.params.cToken];
  if (typeof cToken === 'undefined') {
    ctx.status = 400;
    ctx.body = {
      error: `cToken ${ctx.params.cToken} does not exist`
    };
    return;
  }

  try {
    await cToken
      .methods
      .redeem(ctx.params.amount)
      .send({ from: adminAddress });
    ctx.body = {
      cToken: ctx.params.cToken,
      address: adminAddress,
      amountRedeemed: ctx.params.amount
    };
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = {
      error: 'internal server error'
    };
  }
});

module.exports = router;