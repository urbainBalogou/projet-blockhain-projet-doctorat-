'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class CreateWorkload extends WorkloadModuleBase {
    async submitTransaction() {
        const txId = 'tx' + this.workerIndex + '_' + this.roundIndex;

        await this.sutAdapter.sendRequests({
            contractId: 'operation_comptable',   // 👈 Ton vrai nom de chaincode
            contractFunction: 'CreateTransaction',
            contractArguments: [
                txId,                      // tranID
                'recette',                 // type (recette ou depense)
                '512000',                  // debitAcc
                '701000',                  // creditAcc
                '43:D3:00:DF:34:45',       // MacAddress
                '100.50'                   // amount (⚠️ doit être string côté Caliper)
            ],
            readOnly: false
        });
    }
}

function createWorkloadModule() {
    return new CreateWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;

