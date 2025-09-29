package main

import (
	"encoding/json"
	"fmt"
	
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ComptableContract implémente le smart contract pour enregistrer des écritures comptables
type ComptableContract struct {
	contractapi.Contract
}

// Transaction définit la structure d'une écriture comptable en partie double
type Transaction struct {
	ID                  string  `json:"id"`
	Type                string  `json:"type"`               // "recette" ou "depense"
	DebitAccountNumber  string  `json:"debitAccountNumber"` // ex. "512000"
	CreditAccountNumber string  `json:"creditAccountNumber"`// ex. "401100"
	MacAddress			string	`json:"MacAddress"`
	Amount              float64 `json:"amount"`             // ex. 1500.00
}

// InitLedger populates the ledger with some initial transactions
func (c *ComptableContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	transactions := []Transaction{
		{ID: "tx1", Type: "recette", DebitAccountNumber: "512", CreditAccountNumber: "701", MacAddress: "43:D3:00:DF:34:45", Amount: 1000.00},
		{ID: "tx2", Type: "depense", DebitAccountNumber: "615", CreditAccountNumber: "512", MacAddress: "43:D4:00:DF:05:40", Amount: 250.50},
	}

	for _, tx := range transactions {
		txJSON, err := json.Marshal(tx)
		if err != nil {
			return err
		}

		// Use key "TRANSACTION~<ID>"
		err = ctx.GetStub().PutState("TRANSACTION~"+tx.ID, txJSON)
		if err != nil {
			return fmt.Errorf("failed to put initial transaction %s: %v", tx.ID, err)
		}
	}
	return nil
}

// CreateTransaction enregistre une nouvelle écriture
func (c *ComptableContract) CreateTransaction(ctx contractapi.TransactionContextInterface,
	tranID string, opType string,
	debitAcc string, creditAcc string, macAddr string,
	amount float64) error {
	// Vérifier existence
	exists, err := c.TransactionExists(ctx, tranID)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("transaction %s already exists", tranID)
	}

	// Convertir montant
	// amount, err := strconv.ParseFloat(amountStr, 64)
	// if err != nil {
	// 	return fmt.Errorf("invalid amount: %s", err)
	// }

	tx := Transaction{
		ID:                  tranID,
		Type:                opType,
		DebitAccountNumber:  debitAcc,
		CreditAccountNumber: creditAcc,
		MacAddress:			 macAddr,
		Amount:              amount,
	}

	txJSON, err := json.Marshal(tx)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("TRANSACTION~"+tranID, txJSON)
}

// TransactionExists retourne true si la transaction existe
func (c *ComptableContract) TransactionExists(ctx contractapi.TransactionContextInterface, tranID string) (bool, error) {
	data, err := ctx.GetStub().GetState("TRANSACTION~" + tranID)
	if err != nil {
		return false, err
	}
	return data != nil, nil
}

// ReadTransaction renvoie l’écriture
func (c *ComptableContract) ReadTransaction(ctx contractapi.TransactionContextInterface, tranID string) (*Transaction, error) {
	data, err := ctx.GetStub().GetState("TRANSACTION~" + tranID)
	if err != nil {
		return nil, err
	}
	if data == nil {
		return nil, fmt.Errorf("transaction %s does not exist", tranID)
	}
	var tx Transaction
	if err := json.Unmarshal(data, &tx); err != nil {
		return nil, err
	}
	return &tx, nil
}

// QueryAllTransactions retourne toutes les écritures
func (c *ComptableContract) QueryAllTransactions(ctx contractapi.TransactionContextInterface) ([]*Transaction, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("TRANSACTION~", "TRANSACTION~\ufff0")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var transactions []*Transaction
	for resultsIterator.HasNext() {
		kv, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var tx Transaction
		if err := json.Unmarshal(kv.Value, &tx); err != nil {
			return nil, err
		}
		transactions = append(transactions, &tx)
	}
	return transactions, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&ComptableContract{})
	if err != nil {
		fmt.Printf("Error create chaincode: %s", err)
		return
	}
	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}

