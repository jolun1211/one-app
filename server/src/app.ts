import Koa from 'Koa';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';
import corsConfigs from "./corsConfig";
import router from './routes/admin';


const app = new Koa();

app.use(cors(corsConfigs));
app.use(bodyParser()); // 解析request的body
app.use(router.routes());
app.listen(3000, () => {
  console.log('服务器启动');
});
