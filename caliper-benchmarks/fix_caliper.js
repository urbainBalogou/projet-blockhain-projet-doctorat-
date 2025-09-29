const fs = require('fs');
const filePath = './node_modules/@hyperledger/caliper-fabric/lib/FabricConnectorFactory.js';

let content = fs.readFileSync(filePath, 'utf8');

// Remplace la fonction pour ignorer fabric-gateway
const newFunction = `const _determineInstalledNodeSDKandVersion = () => {
    // Force l'utilisation de fabric-network uniquement
    let sdk, packageVersion;
    
    if (CaliperUtils.moduleIsInstalled('fabric-network')) {
        packageVersion = semver.coerce(require('fabric-network/package').version);
        sdk = 'fabric-network';
    }
    
    if (!sdk) {
        throw new Error('Unable to detect required Fabric binding packages');
    }
    return {sdk, packageVersion};
};`;

// Remplace la fonction existante
content = content.replace(
    /const _determineInstalledNodeSDKandVersion = \(\) => \{[\s\S]*?\};/,
    newFunction
);

fs.writeFileSync(filePath, content);
console.log('Fonction patchée avec succès');
