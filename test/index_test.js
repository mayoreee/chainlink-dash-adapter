const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '1'

  context('successful calls', () => {
    const requests = [
      { name: 'createWallet test - id not supplied', testData: { data: { network: 'testnet', method: 'createWallet' } } },
      { name: 'createWallet test - id supplied', testData: { id: jobID, data: { network: 'testnet', method: 'createWallet' } } },
      { name: 'registerIdentity test - id not supplied', testData: { data: { network: 'testnet', method: 'registerIdentity', wallet: {mnemonic: "bulk chimney foam muscle detail matter snake purchase science exile upon marriage where history notice antique arm lawn upgrade hope athlete foam hidden false"} } } },
      { name: 'registerIdentity test - id supplied', testData: {id: jobID, data: { network: 'testnet', method: 'registerIdentity', wallet: {mnemonic: "bulk chimney foam muscle detail matter snake purchase science exile upon marriage where history notice antique arm lawn upgrade hope athlete foam hidden false"} } } },
      { name: 'retrieveIdentity test - id not supplied', testData: { data: { network: 'testnet', method: 'retrieveIdentity', identityId: '3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93' } } },
      { name: 'retrieveIdentity test - id supplied', testData: {id: jobID, data: { network: 'testnet', method: 'retrieveIdentity', identityId: '3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93' } } },
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 200)
          assert.equal(data.jobRunID, jobID)
          assert.isNotEmpty(data.data)
          done()
        })
      })
    })
  })

  context('error calls', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      { name: 'createWallet test - network not supplied', testData: { id: jobID, data: { method: 'createWallet' } } },
      { name: 'createWallet test - method not supplied', testData: { id: jobID, data: { network: 'testnet' } } },
      { name: 'registerIdentity test - network not supplied', testData: { id: jobID, data: { method: 'registerIdentity', wallet: {mnemonic: "bulk chimney foam muscle detail matter snake purchase science exile upon marriage where history notice antique arm lawn upgrade hope athlete foam hidden false"} } } },
      { name: 'registerIdentity test - method not supplied', testData: { id: jobID, data: { network: 'testnet', wallet: {mnemonic: "bulk chimney foam muscle detail matter snake purchase science exile upon marriage where history notice antique arm lawn upgrade hope athlete foam hidden false"} } } },
      { name: 'registerIdentity test - mnemonic not supplied', testData: { id: jobID, data: { network: 'testnet' }, wallet:{} } },
      { name: 'retrieveIdentity test - network not supplied', testData: { id: jobID, data: { method: 'retrieveIdentity', identityId: '3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93' } } },
      { name: 'retrieveIdentity test - method not supplied', testData: { id: jobID, data: { network: 'testnet', identityId: '3GVAAkyWDK68V92Evy4jrnYyBJamri8bXQakWbMedr93' } } },
      { name: 'retrieveIdentity test - identityId not supplied', testData: { id: jobID, data: { network: 'testnet', method: 'retrieveIdentity'} } },
    ]

    requests.forEach(req => {
      it(`${req.name}`, (done) => {
        createRequest(req.testData, (statusCode, data) => {
          assert.equal(statusCode, 500)
          assert.equal(data.jobRunID, jobID)
          assert.equal(data.status, 'errored')
          assert.isNotEmpty(data.error)
          done()
        })
      })
    })
  })
})
