#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Mise à jour automatique de la configuration Caliper ===${NC}\n"

# Chemins
NETWORK_CONFIG="/home/vboxuser/projet-blockchain/caliper-benchmarks/network-config.yaml"
KEYSTORE_PATH="/home/vboxuser/projet-blockchain/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore"

# Vérifier que le fichier network-config.yaml existe
if [ ! -f "$NETWORK_CONFIG" ]; then
    echo -e "${RED}✗ Erreur : Le fichier $NETWORK_CONFIG n'existe pas${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Fichier network-config.yaml trouvé"

# Vérifier que le dossier keystore existe
if [ ! -d "$KEYSTORE_PATH" ]; then
    echo -e "${RED}✗ Erreur : Le dossier $KEYSTORE_PATH n'existe pas${NC}"
    echo -e "${YELLOW}Assurez-vous que le réseau Fabric est démarré et que les certificats sont générés${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Dossier keystore trouvé"

# Trouver le fichier de clé privée
PRIVATE_KEY=$(ls $KEYSTORE_PATH/*_sk 2>/dev/null | head -n 1)

if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}✗ Erreur : Aucune clé privée trouvée dans $KEYSTORE_PATH${NC}"
    echo -e "${YELLOW}Fichiers présents dans le keystore :${NC}"
    ls -la "$KEYSTORE_PATH"
    exit 1
fi

echo -e "${GREEN}✓${NC} Clé privée trouvée : ${YELLOW}$(basename $PRIVATE_KEY)${NC}"

# Créer une sauvegarde du fichier original
BACKUP_FILE="${NETWORK_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$NETWORK_CONFIG" "$BACKUP_FILE"
echo -e "${GREEN}✓${NC} Sauvegarde créée : $BACKUP_FILE"

# Calculer le chemin relatif depuis le dossier caliper-benchmarks
RELATIVE_KEY="../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/$(basename $PRIVATE_KEY)"

echo -e "\n${YELLOW}Chemin relatif de la clé :${NC} $RELATIVE_KEY"

# Mettre à jour le fichier network-config.yaml
# On cherche la ligne avec "path:" sous "clientPrivateKey:" et on la remplace
sed -i "/clientPrivateKey:/,/path:/ s|path:.*|path: $RELATIVE_KEY|" "$NETWORK_CONFIG"

# Vérifier que la modification a été effectuée
if grep -q "$(basename $PRIVATE_KEY)" "$NETWORK_CONFIG"; then
    echo -e "\n${GREEN}✓✓✓ network-config.yaml mis à jour avec succès ! ✓✓✓${NC}\n"
    
    # Afficher la section modifiée
    echo -e "${YELLOW}Section mise à jour dans le fichier :${NC}"
    grep -A 2 "clientPrivateKey:" "$NETWORK_CONFIG"
    
    echo -e "\n${GREEN}Vous pouvez maintenant lancer Caliper !${NC}"
    echo -e "${YELLOW}Commande suggérée :${NC}"
    echo "cd /home/vboxuser/projet-blockchain/caliper-benchmarks"
    echo "npx caliper launch manager --caliper-bind-sut fabric:2.2 --caliper-workspace ./ --caliper-benchconfig benchmarks/scenario/simple/config.yaml --caliper-networkconfig networks/fabric/network-config.yaml"
else
    echo -e "\n${RED}✗ Attention : La mise à jour n'a peut-être pas fonctionné${NC}"
    echo -e "${YELLOW}Vérifiez manuellement le fichier $NETWORK_CONFIG${NC}"
    exit 1
fi
