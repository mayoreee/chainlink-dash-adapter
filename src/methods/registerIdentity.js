const Dash = require('dash');

const registerIdentity = (network, wallet) => {
  const clientOpts = {
    network: network,
    wallet: {
      mnemonic: wallet.mnemonic,
      //TODO (mayoreee): consider removing this options
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 650000, // only sync from early-2022
      },
    },
  };

  const client = new Dash.Client(clientOpts);

  const createIdentity = async () => {
    const identity = await client.platform.identities.register();

    const response = {
      status: 200,
      data: {
        identity: identity.toJSON(),
      }
    };
    return response;
  }

  return createIdentity()
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return {
        data: {
          error: e
        }
      };
    })
    .finally(() => client.disconnect());
}

module.exports.registerIdentity = registerIdentity;
