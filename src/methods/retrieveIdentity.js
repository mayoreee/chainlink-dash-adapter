const Dash = require('dash');

const retrieveIdentity = (network, identityId) => {
  const clientOpts = {
    network: network,
  };

  const client = new Dash.Client(clientOpts);

  const getIdentity = async () => {
    const identity = await client.platform.identities.get(identityId);

    const response = {
      status: 200,
      data: {
        identity: identity.toJSON(),
      }
    };
    return response;
  }

  return getIdentity()
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

module.exports.retrieveIdentity = retrieveIdentity;
