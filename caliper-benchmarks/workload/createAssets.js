'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class CreateWorkload extends WorkloadModuleBase {
    async submitTransaction() {
        const txId = 'tx_' + Date.now() + '_' + this.workerIndex + '_' + this.roundIndex;

        await this.sutAdapter.sendRequests({
            contractId: 'operation_comptable',
            contractFunction: 'CreateTransaction',
            contractArguments: [
                txId,
                'recette',
                '512000',
                '701000',
                '43:D3:00:DF:34:45',
                '100.50'
            ],
            readOnly: false
        });
    }
}

function createWorkloadModule() {
    return new CreateWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;

