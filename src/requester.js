const { AdapterError } = require('@chainlink/external-adapter/src/adapterError')
const { logger } = require('@chainlink/external-adapter/src/logger')
const { createDashWallet } = require('./methods/createDashWallet')

class Requester {
  static request (config, customError, retries = 3, delay = 1000) {
    if (typeof config === 'string') config = { url: config }
    if (typeof config.timeout === 'undefined') {
      const timeout = Number(process.env.TIMEOUT)
      config.timeout = !isNaN(timeout) ? timeout : 3000
    }
    if (typeof customError === 'undefined') {
      customError = function _customError (data) {
        return false
      }
    }
    if (typeof customError !== 'function') {
      delay = retries
      retries = customError
      customError = function _customError (data) {
        return false
      }
    }

    return new Promise((resolve, reject) => {
      const retry = (config, n) => {
        return makeRequest(config)
          .then(response => {
            if (response.data.error || customError(response.data)) {
              if (n === 1) {
                const error = `Could not retrieve valid data: ${JSON.stringify(response.data)}`
                logger.error(error)
                reject(new AdapterError(error))
              } else {
                setTimeout(() => {
                  retries--
                  logger.warn(`Error in response. Retrying: ${JSON.stringify(response.data)}`)
                  retry(config, retries)
                }, delay)
              }
            } else {
              logger.info(`Received response: ${JSON.stringify(response.data)}`)
              return resolve(response)
            }
          })
          .catch(error => {
            if (n === 1) {
              logger.error(`Could not reach endpoint: ${JSON.stringify(error.message)}`)
              reject(new AdapterError(error.message))
            } else {
              setTimeout(() => {
                retries--
                logger.warn(`Caught error. Retrying: ${JSON.stringify(error.message)}`)
                retry(config, retries)
              }, delay)
            }
          })
      }
      return retry(config, retries)
    })

    /**
     * Handles request method selection.
     */
    function makeRequest (config) {
      if (config.method === 'createWallet') {
        return createDashWallet(config.network)
      }
    }
  }

  static getResult (data, path) {
    return path.reduce((o, n) => o[n], data)
  }

  static adapterErrorCallback (jobRunID, error, callback) {
    setTimeout(callback(500, Requester.errored(jobRunID, error)), 0)
  }

  static errored (jobRunID = '1', error = 'An error occurred') {
    return {
      jobRunID,
      status: 'errored',
      error: new AdapterError(error),
      statusCode: 500
    }
  }

  static success (jobRunID = '1', response) {
    // eslint-disable-next-line no-prototype-builtins
    return {
      jobRunID,
      data: response.data,
      statusCode: response.status
    }
  }
}

exports.Requester = Requester
