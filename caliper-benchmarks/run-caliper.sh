#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     Lancement automatique de Caliper pour Fabric      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Chemins
CALIPER_DIR="/home/vboxuser/projet-blockchain/caliper-benchmarks"
NETWORK_CONFIG="$CALIPER_DIR/network-config.yaml"
KEYSTORE_PATH="/home/vboxuser/projet-blockchain/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore"

# Étape 1 : Vérifier que le réseau Fabric est actif
echo -e "${YELLOW}[1/4] Vérification du réseau Fabric...${NC}"
if ! docker ps | grep -q "peer0.org1.example.com"; then
    echo -e "${RED}✗ Le réseau Fabric ne semble pas être démarré${NC}"
    echo -e "${YELLOW}Démarrez d'abord le réseau avec : ./network.sh up createChannel${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Réseau Fabric actif\n"

# Étape 2 : Vérifier l'existence des fichiers nécessaires
echo -e "${YELLOW}[2/4] Vérification des fichiers...${NC}"

if [ ! -f "$NETWORK_CONFIG" ]; then
    echo -e "${RED}✗ Fichier network-config.yaml introuvable${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} network-config.yaml trouvé"

if [ ! -d "$KEYSTORE_PATH" ]; then
    echo -e "${RED}✗ Dossier keystore introuvable${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Keystore trouvé\n"

# Étape 3 : Trouver et mettre à jour la clé privée
echo -e "${YELLOW}[3/4] Configuration automatique de la clé privée...${NC}"

PRIVATE_KEY=$(ls $KEYSTORE_PATH/*_sk 2>/dev/null | head -n 1)

if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}✗ Aucune clé privée trouvée${NC}"
    exit 1
fi

KEY_BASENAME=$(basename $PRIVATE_KEY)
echo -e "${GREEN}✓${NC} Clé privée détectée : ${YELLOW}$KEY_BASENAME${NC}"

# Calculer le chemin relatif
RELATIVE_KEY="../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/$KEY_BASENAME"

# Créer une sauvegarde
BACKUP_FILE="${NETWORK_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$NETWORK_CONFIG" "$BACKUP_FILE"
echo -e "${GREEN}✓${NC} Sauvegarde créée : $(basename $BACKUP_FILE)"

# Mettre à jour le fichier
sed -i "/clientPrivateKey:/,/path:/ s|path:.*|path: $RELATIVE_KEY|" "$NETWORK_CONFIG"

if grep -q "$KEY_BASENAME" "$NETWORK_CONFIG"; then
    echo -e "${GREEN}✓${NC} Configuration mise à jour avec succès\n"
else
    echo -e "${RED}✗ Erreur lors de la mise à jour${NC}"
    exit 1
fi

# Étape 4 : Lancer Caliper
echo -e "${YELLOW}[4/4] Lancement de Caliper...${NC}\n"

cd "$CALIPER_DIR"

# Vérifier si un fichier de benchmark est spécifié, sinon utiliser benchmark.yaml
BENCHMARK_CONFIG=${1:-"benchmark.yaml"}

# Vérifier que le fichier de benchmark existe
if [ ! -f "$BENCHMARK_CONFIG" ]; then
    echo -e "${RED}✗ Fichier de benchmark introuvable : $BENCHMARK_CONFIG${NC}"
    echo -e "${YELLOW}Fichiers disponibles :${NC}"
    ls -la *.yaml 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✓${NC} Fichier de benchmark : ${YELLOW}$BENCHMARK_CONFIG${NC}\n"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Lancer Caliper
npx caliper launch manager \
    --caliper-bind-sut fabric:2.2 \
    --caliper-workspace ./ \
    --caliper-benchconfig "$BENCHMARK_CONFIG" \
    --caliper-networkconfig network-config.yaml

EXIT_CODE=$?

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓✓✓ Benchmark terminé avec succès ! ✓✓✓${NC}"
else
    echo -e "${RED}✗ Le benchmark a échoué avec le code d'erreur : $EXIT_CODE${NC}"
    echo -e "${YELLOW}Consultez les logs ci-dessus pour plus de détails${NC}"
fi

exit $EXIT_CODE
