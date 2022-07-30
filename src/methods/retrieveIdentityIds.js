const Dash = require('dash');

const retrieveIdentityIds = (network, wallet) => {
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

  const getIdentityIds = async () => {
    const account = await client.getWalletAccount();
    const identities = await account.identities.getIdentityIds();

    const response = {
      status: 200,
      data: {
        identities: identities,
      }
    };
    return response;
  }

  return getIdentityIds()
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

module.exports.retrieveIdentityIds = retrieveIdentityIds;
