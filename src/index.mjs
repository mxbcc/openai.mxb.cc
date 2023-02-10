import { ChatGPTAPI } from 'chatgpt';
import Koa from 'koa';
import { koaBody } from 'koa-body';

const app = new Koa();
const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map();

app.use(koaBody());
app.use(async ctx => {
    let question;
    let sessionId;
    if (ctx.method === 'GET') {
        question = decodeURIComponent(ctx.request.query.text);
        sessionId = ctx.request.query.sessionId;
    } else {
        question = ctx.request?.body?.text;
        sessionId = ctx.request?.body?.sessionId;
    }
    try {
        const res = await api.sendMessage(question ?? '介绍自己', {
            conversationId: cache.get(sessionId)?.conversationId,
            parentMessageId: cache.get(sessionId)?.id,
        });

        if (sessionId) {
            if (cache.has(sessionId)) {
                cache.get(sessionId).id = res.id;
            } else {
                cache.set(sessionId, {
                    conversationId: res.conversationId,
                    id: res.id,
                });
            }
        }

        ctx.body = res;
    } catch (e) {
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: e.message,
        }
    }

});

app.listen(3000);
