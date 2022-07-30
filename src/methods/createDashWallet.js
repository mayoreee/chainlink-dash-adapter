const Dash = require('dash');

const createDashWallet = (network) => {
  const clientOpts = {
    network: network,
    wallet: {
      mnemonic: null,
      offlineMode: true
    }
  };

  const client = new Dash.Client(clientOpts);

  const createWallet = async () => {
    const account = await client.getWalletAccount();

    const mnemonic = client.wallet.exportWallet();
    const address = account.getUnusedAddress();

    const response = {
      status: 200,
      data: {
        mnemonic: mnemonic,
        address: address.address
      }
    };
    return response;
  }

  return createWallet()
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

module.exports.createDashWallet = createDashWallet;
