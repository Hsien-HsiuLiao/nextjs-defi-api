require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const router = require('./router.js');

app
  .use(router.routes());

const port = process.env.PORT || 3001; 
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
