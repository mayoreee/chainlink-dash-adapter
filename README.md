# Chainlink Dash Adapter

Chainlink External Adapter for Dash Platform Data

## Install

Install dependencies:

```bash
yarn install
```

Natively run the application (defaults to port 8080):

### Run

```bash
yarn start
```

## Call the external adapter service

This example request for `createWallet` method returns a Dash wallet:

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{ "id": 0, "data": { "network": "testnet", "method": "createWallet" } }'
```

Output:

```json
{
  "jobRunID": 0,
  "data": {
    "mnemonic": "blur arrest engage lyrics tent patch south wall sketch cloth security shock",
    "address": "yLndbTmXddQGPrTyjthS28Ro7vqtJmCNb2"
    },
  "statusCode": 200
}
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t chainlink-dash-adapter
```

Then run it with:

```bash
docker run -p 8080:8080 chainlink-dash-adapter
```