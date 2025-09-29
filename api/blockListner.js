const { connectGateway } = require('./connexion');

let gateway, network, contract;

// Initialize Fabric listeners and contract
async function initFabricListener() {
  try {
    // 1. Connect to gateway
    gateway = await connectGateway('admin');
    // 2. Get network and contract
    network = await gateway.getNetwork('mychannel');
    contract = network.getContract('product');

    // 3. Block listener (full blocks)
    await network.addBlockListener(
      async (blockEvent) => {
        console.log(`ðŸ”” Bloc #${blockEvent.blockNumber} crÃ©Ã©`);
      },
      { filtered: false }
    );
    console.log('âœ… Listener de blocs activÃ©');

  } catch (err) {
    console.error('âŒ Erreur d\u2019initialisation FabricListener:', err);
    process.exit(1);
  }
}


async function closeFabricListener() {
  if (gateway) {
    await gateway.disconnect();
    console.log('ðŸ”’ Fabric Gateway dÃ©connectÃ©');
  }
}

async function main() {

  try {
    gateway = await connectGateway('admin');
    // 2. Get network and contract
    network = await gateway.getNetwork('mychannel');
    contract = network.getContract('product');

    const listener = async (event) => {
      console.log(`Event received: ${event.eventName}`);
      const payload = event.payload.toString('utf8');
      console.log(`Payload: ${payload}`);
    };

    const eventService = network.getEventService();
    await eventService.connect();
    await eventService.registerListener('blockListener', listener);

    console.log('Listening for events...');
  } finally {
    gateway.disconnect();
  }
}

//main().catch(console.error);

module.exports = { initFabricListener, closeFabricListener, main };
