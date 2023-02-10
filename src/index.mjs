import { ChatGPTAPI } from 'chatgpt';
import Koa from 'koa';
import { koaBody } from 'koa-body';

const app = new Koa();
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
})

app.use(koaBody());
app.use(async ctx => {
    let question;
    if (ctx.method === 'GET') {
        question = decodeURIComponent(ctx.request.query.text);
    } else {
        question = ctx.request?.body?.text;
    }
    console.log(question, ctx.request.body)
    try {
        ctx.body = await api.sendMessage(question ?? '介绍自己');
    } catch (e) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: e.message,
        }
    }

});

app.listen(3000);
