import dotenv from 'dotenv';
dotenv.config();

const env = {
    PORT: process.env.PORT,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    LND_GRPC_URL: process.env.LND_GRPC_URL,
    LND_MACAROON: process.env.LND_MACAROON,
    LND_TLS_CERT: process.env.LND_TLS_CERT ,
};

Object.entries(env).forEach(([key, value]) => {
    if (!value) {
        console.log({ key, value });
        throw new Error(`Required enviroment variable ${key} is missing`);
    }
});

export default env;
