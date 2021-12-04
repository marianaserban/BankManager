const db = require("../config/db");
const faker = require("faker");

const generateAccounts = async (req, res) => {
    try {

        const response = await db.collection('clients').get();
        let utils=[]

        response.forEach(doc => {

            let noOfAccounts=faker.datatype.number({min: 0,max: 3});
            let accounts = []
            for (let j=0;j<noOfAccounts;j++){
                  let account = {
                      iban:faker.finance.iban(),
                      accountName:faker.finance.accountName(),
                      amount:faker.finance.amount(),
                      currencyName:faker.finance.currencyName(),
                  }
                  util={
                      accountName:account.accountName,
                      currencyName:account.currencyName
                  }
                  utils.push(util)
                  accounts.push(account)

                  db.collection('clients').doc(doc.id).collection('accounts').add(account)
                  db.collection('utils').add(util);
              }

        });

        res.status(201).json({message:"Accounts added"});
    } catch (e){
        res.status(500).json({message:e.message});
    }
};

const getAccounts = async (req, res) => {
    try {
        let id=req.params.id
        let accounts=[]
        const response = await db.collection('clients').doc(id).collection('accounts').get();
      
        response.forEach(doc => {
          let account = {};
          account.id = doc.id;
          account.accountName=doc.data().accountName;
          account.amount = doc.data().amount;
          account.currencyName = doc.data().currencyName
          account.iban=doc.data().iban;
          accounts.push(account);
        });

         res.status(200).json({accounts:accounts});
    } catch (e){
        res.status(500).json({message:e.message});
    }
};

const getDistinct = async (req, res) => {
    try {
        let utils = [];
        const response = await db.collection('utils').get();
        response.forEach(doc => {
          let util = {};
          util.accountName=doc.data().accountName;
          util.currencyName=doc.data().currencyName;
          utils.push(util);
        });
        let unique={}
        const uniqueAccountName = [...new Set(utils.map(item => item.accountName))];
        const uniqueCurrencyName = [...new Set(utils.map(item => item.currencyName))];
        unique.accountName=uniqueAccountName;
        unique.currencyName=uniqueCurrencyName;
        res.status(200).json({utils:unique});
    } catch (e){
        res.json({message:e.message});
    }
};

const addAccount = async (req, res) => {
    try {
        let id=req.params.id
        let account ={
            accountName:req.body.accountName,
            amount:req.body.amount,
            currencyName:req.body.currencyName,
            iban:req.body.iban
        }
        db.collection('clients').doc(id).collection('accounts').add(account)
        res.json({message:"Account added"});
    } catch (e){
        res.json({message:e.message});
    }
};

const deleteAccount = async (req, res) => {
    try {
        let id=req.params.id
        let accountId=req.params.accountId
        let resp= db.collection('clients').doc(id).collection('accounts').doc(accountId).delete()
        res.json({message:"Account deleted!"});
    } catch (e){
        res.json({message:e.message});
    }
};

const editAccount = async (req, res) => {
    try {
        let id=req.params.id
        let accountId=req.params.accountId
        let account ={
            accountName:req.body.accountName,
            amount:req.body.amount,
            currencyName:req.body.currencyName,
            iban:req.body.iban
        }
        console.log("De editat: ", account)
        db.collection('clients').doc(id).collection('accounts').doc(accountId).update(account)
        res.json({message:"Account edited!"});
    } catch (e){
        res.json({message:e.message});
    }
};
module.exports = {
    generateAccounts,
    getAccounts,
    getDistinct,
    addAccount,
    deleteAccount,
    editAccount
}