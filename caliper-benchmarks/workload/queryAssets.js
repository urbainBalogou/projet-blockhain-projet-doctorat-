'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class QueryWorkload extends WorkloadModuleBase {
    async submitTransaction() {
        // Récupère le même txId que celui créé par CreateWorkload
        const txId = 'tx' + this.workerIndex + '_' + this.roundIndex;

        await this.sutAdapter.sendRequests({
            contractId: 'operation_comptable',
            contractFunction: 'ReadTransaction',
            contractArguments: [txId],
            readOnly: true
        });
    }
}

function createWorkloadModule() {
    return new QueryWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;

