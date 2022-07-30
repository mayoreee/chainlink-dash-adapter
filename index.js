const { Validator } = require('@chainlink/external-adapter')
const { Requester } = require('./src/requester')

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
  if (data.Response === 'Error') return true
  return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const customParams = {
  network: true, // e.g. 'testnet'
  method: true, // e.g 'createWallet'
  wallet: false, // e.g { mnemonic: 'a Dash wallet mnemonic with testnet funds goes here'}
  params: false, // e.g {identityId: '3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93', topupAmount: 1000}
}

const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data
  const validator = new Validator(input, customParams)
  const jobRunID = validator.validated.id
  const network = validator.validated.data.network
  const method = validator.validated.data.method
  const wallet = validator.validated.data.wallet
  const params = validator.validated.data.params

  const config = {
    network,
    method,
    wallet,
    params,
  }

  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then(response => {
      callback(response.status, Requester.success(jobRunID, response))
    })
    .catch(error => {
      callback(500, Requester.errored(jobRunID, error))
    })
}

module.exports.createRequest = createRequest
