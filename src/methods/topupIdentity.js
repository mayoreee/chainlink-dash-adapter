const Dash = require('dash');

const topupIdentity = (network, wallet, identityId, topupAmount) => {
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

  const topupIdentityBalance = async () => {
    await client.platform.identities.topUp(identityId, topupAmount);
    const identity = await client.platform.identities.get(identityId);

    const response = {
      status: 200,
      data: {
        balance: identity.toJSON().balance,
      }
    };
    return response;
  }

  return topupIdentityBalance()
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

module.exports.topupIdentity = topupIdentity;
