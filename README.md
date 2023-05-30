# Paywall-server

### Description
A server backend for bitpaywall project.
 
The server interacts primarily with your lightnig node to generate invoices and create streams for paid invoices.

It also interacts with the client of the application [bitpaywall-project](https://github.com/IgboPharaoh/bitpaywall-client) returning required responses as asked from the client.


### Setup
- Clone the repository ```git clone https://github.com/IgboPharaoh/paywall-server.git```

- In the home directory run ``npm install``

- Once all the dependencies have been installed, create a .env file in the root of the project that contains all the configuration parameters

  - PORT=3001

  - LND_GRPC_URL=

  - LND_MACAROON=

  - LND_TLS_CERT=

The following are a list of currently available configuration options and a short explanation of what each does.

LND_MACAROON_FILE (required) This is the path to your admin.macaroon file. This will vary depending on the network chain you decide on. You should convert this path to a base64 format

LND_TLS_CERT_FILE (required) This is the path to your tls.cert file. This is usually located inside your $LND_FOLDER. You should convert this path to a base64 format

LND_GRPC_URL (optional; defaults to localhost) If your node is not on your local machine (say on a different server), you'll need to change this value to the appropriate value.

- When all preliminary steps have been completed, start up your LND node, then in the terminal of paywall-server run ``npm run dev``


If your application is appropriately connected, you'll see the lightning node info on the startup page of your server


### Technologies used
- Typescript
- Nodejs
- Lnrpc
- Socker IO
- Polar
