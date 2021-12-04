const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const saltRounds = 12;
const secret = 'supersecret'

const register = async (req, res) => {
    let data = req.body;
    let emailExist = false;

    const userRef = db.collection('users');
    const snapshot = await userRef.where('email', '==', data.email).get();
    if (!snapshot.empty) {
        emailExist = true;
    };

    if (emailExist) {
        res.send('User already registered.')
    }
    else {
        bcrypt.hash(data.password, saltRounds).then(async function (hash) {
            data.password = hash;
            const user = await db.collection('users').add(data);
            res.send('Succesfull registration');
        });
    }
};

const login = async (req, res) => {
    let data = req.body;

    let emailFound = false;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', data.email).get();

    if (snapshot.empty) {
        let response = {};
        response.message = "No such email address.";
        res.json(response);
        res.send(response)
    } else {
        emailFound = true;
        snapshot.forEach(doc => {
            bcrypt.compare(data.password, doc.data().password).then(async function (result) {
                if (result) {
                    let token = jwt.sign({
                        email: doc.data().email
                    }, secret, { expiresIn: 60 * 60 });

                    let response = {};
                    response.token = token;
                    response.message = 'You have the right to access private resources'
                    res.json(response);
                }
                else {
                    let response = {};
                    response.message = "Password missmatch";
                    res.json(response)
                }
            });
        });
    }
}

function checkAuthorization(req, res, next) {
  const bearerHeader = req.headers['authorization'];
 // const bearerHeader = req.headers.authorization
  
  console.log(req.headers);

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, secret, (err, decoded) => {
      if (err) {
        if (err.expiredAt) {
          res.json({ "message": "Your token expired!" });
        } else {
          res.json({ "message": "Decoding error!" });
        }
      } else {
        console.log(decoded.email);
        next();
      }
    })
  } else {
    res.json({ "message": "Missing token!" })
  }
}

module.exports = {
    register,
    login,
    checkAuthorization
}
