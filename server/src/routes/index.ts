import Router from 'koa-router';

const router = new Router({ prefix: '/api' });
// router
//   .get('/', (ctx: { body: string; }, next: any) => {
//     ctx.body = 'Hello World!';
//   })
//   .get('/test', (ctx: { body: { msg: string; query: any; queryStr: any; }; query: any; querystring: any; }, next: any) => {
//     ctx.body = {
//       msg: 'here is test',
//       query: ctx.query,
//       queryStr: ctx.querystring,
//     };
//   })
//   .post('/users', (ctx: { body: string; }, next: any) => {
//     ctx.body = 'here is users';
//   })
//   .all('/users/:id', (ctx: any, next: any) => {
//     // ...
//   });

export default router;
