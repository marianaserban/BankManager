const router = require("express").Router();
const auth=require('../controllers/auth')
const clients=require('../controllers/clients')
const accounts=require('../controllers/accounts')

router.post('/register', auth.register);
router.post('/login', auth.login);

router.post('/generateClients/:noOfRecords', clients.generateClients)
router.post('/generateAccounts', accounts.generateAccounts)

router.get('/clients', clients.getClients);
router.get('/client/:id',clients.getClientById);
router.post('/client',auth.checkAuthorization,clients.addClient);
router.delete('/client/:id',auth.checkAuthorization,clients.deleteClient);
router.put('/client/:id',auth.checkAuthorization,clients.editClient);

router.get('/accounts/:id', accounts.getAccounts);
router.get('/utils', accounts.getDistinct);
router.post('/client/:id/account',auth.checkAuthorization, accounts.addAccount);
router.delete('/client/:id/account/:accountId',auth.checkAuthorization, accounts.deleteAccount);
router.put('/client/:id/account/:accountId',auth.checkAuthorization, accounts.editAccount);

module.exports = router;