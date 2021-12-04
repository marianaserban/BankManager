const db = require("../config/db");
const faker = require("faker");

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const generateClients = async (req, res) => {
    try {
        let number = req.params.noOfRecords
        for (let i = 0; i < number; i++) {

          let client = {
            fistName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            dateOfBirth: formatDate(faker.date.between("01.01.1920","01.01.2004")),
            jobTitle:faker.name.jobTitle(),
            company:faker.company.companyName()
          }
            const res = await db.collection('clients').add(client);
        }
        res.status(201).json({message:"Clients added"});
    } catch (e){
        res.status(500).json({message:e.message});
    }
};

const getClients = async (req, res) => {
    try {
        let clients = [];
    
        const response = await db.collection('clients').get();
     
        response.forEach(doc => {
          let client = {};
          client.id = doc.id;
          client.firstName=doc.data().fistName;
          client.lastName = doc.data().lastName;
          client.dateOfBirth = doc.data().dateOfBirth
          client.jobTitle=doc.data().jobTitle;
          client.company=doc.data().company;
          clients.push(client);
        });

         res.status(200).json({clients:clients});
     } catch (e){
         res.status(500).json({message:e.message});
     }
  
};

const deleteClient = async (req, res) => {
    try {
       const id = req.params.id;

       await db.collection('clients').doc(id).collection('accounts').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            });
        });
	   await db.collection("clients").doc(id).delete();
       res.status(202).json({message:"Deleted"});
    } catch (e){
        res.status(500).json({message:e.message});
    }
};

const addClient = async (req, res) => {
    try {
       let client = {
           company:req.body.company,
           dateOfBirth:req.body.dateOfBirth,
           fistName:req.body.fistName,
           jobTitle:req.body.jobTitle,
           lastName:req.body.lastName,
       }
       console.log('Inserez', client)
       await db.collection('clients').add(client);
       res.status(202).json({message:"Client added"});
    } catch (e){
        res.status(500).json({message:e.message});
    }
};

const getClientById = async (req, res) => {
    let client={};
    let id = req.params.id;
    db.collection("clients").doc(id).get().then((docRef) => {
        client = {...docRef.data()};
        client.id = docRef.id;
    }).then(()=>{
        res.status(200).json({client:client});
    }).catch((e)=>{
        res.status(500).json({message:e.message});
    });
};

const editClient = async (req, res) => {
    try {
        const id = req.params.id;
        let client ={
            
            lastName:req.body.lastName,
            jobTitle:req.body.jobTitle,
            company:req.body.company,
            dateOfBirth:req.body.dateOfBirth,
            fistName:req.body.fistName,
            
        }
      console.log('EDITEZ', client, id)
      let update= await db.collection("clients").doc(id).update(client);
      return res.json({message:"Changes saved"});
    } catch (e){
        return res.json({message:e.message});
    }
};

module.exports = {
    generateClients,
    getClients,
    deleteClient,
    addClient,
    getClientById,
    editClient
}