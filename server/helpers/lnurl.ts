import env from './env';
const lnurl = require('lnurl')

const lnurlServer = lnurl.createServer({
    host: 'localhost',
    url: env.SERVER_BASE_URL,
    port: env.PORT,
    endpoint: '/api/user/lnurl',
    auth: {
        apiKeys: [],
    },
    lightning: {
        backend: 'lnd',
        config: {
            hostname: env.LND_GRPC_URL,
            cert: env.LND_TLS_CERT,
            macaroon: env.LND_MACAROON,
        },
    },
    store: {
        backend: 'memory',
    },
});

export default lnurlServer;
