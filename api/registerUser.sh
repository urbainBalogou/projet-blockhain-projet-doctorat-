#!/bin/bash
name=$1
password=$2
export FABRIC_CA_CLIENT_HOME=$HOME/projet-blockchain/fabric-samples/test-network/organizations/org1/admin

cd ../fabric-samples/test-network
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
cd -

fabric-ca-client enroll   -u https://admin:adminpw@localhost:7054   --tls.certfiles $FABRIC_CA_CLIENT_HOME/../../fabric-ca/org1/tls-cert.pem   --home $FABRIC_CA_CLIENT_HOME

echo "[INFO] DÃ©but de l'enregistrement..."
fabric-ca-client register \
  --id.name $name \
  --id.secret $password \
  --id.type client \
  --id.affiliation org1.department1 \
  --tls.certfiles $FABRIC_CA_CLIENT_HOME/../../fabric-ca/org1/ca-cert.pem \
  --home $FABRIC_CA_CLIENT_HOME \
  -u https://localhost:7054

if [ ! $? -eq 0 ]; then
	echo "[ERREUR] Enregistrement Ã©chouÃ© !"
else
	echo "[INFO] Enregistrement terminÃ©..!"
fi

echo ""
echo "[INFO] DÃ©but de l'enrollement..."
fabric-ca-client enroll \
  -u https://$name:$password@localhost:7054 \
  --tls.certfiles $FABRIC_CA_CLIENT_HOME/../../fabric-ca/org1/ca-cert.pem \
  --home $HOME/projet-blockchain/fabric-samples/test-network/organizations/org1/$name

if [ ! $? -eq 0 ]; then
	echo ""
        echo "[ERREUR] Enrollement Ã©chouÃ© !"
else
       echo "[INFO] $name added !!"
       node add_BD_user.js create $name $password
fi

