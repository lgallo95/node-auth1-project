const db = require('../../data/db-config')
const Users = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted (req, res, next) {
  if (req.session.user) {
    console.log(req.session)
    next()
  } else {
    next({ status: 401, message: "You shall not pass!" })
}
}

// /*
//   If the username in req.body already exists in the database

//   status 422
//   {
//     "message": "Username taken"
//   }
// */


async function checkUsernameFree (req, res, next) {
try {
  const {username} = req.body
  const [users] = await Users.findBy({username})
  if(!users) {
    next()
  }
  else {
    res.status(422).json({message: 'Username taken'})
  }
}
catch (err) {
next(err)
}
}
// /*
//   If the username in req.body does NOT exist in the database

//   status 401
//   {
//     "message": "Invalid credentials"
//   }
// */
// function checkUsernameExists() {
//   if(!req.body.username) {
//     next({ status: 401, message: "Invalid credentials" })
//   }
//   else {
//     next()
//   }
// }


async function checkUsernameExists (req, res, next) {
  try {
    const {username} = req.body
    const [users] = await Users.findBy({username})
    if(users) {
      req.user = users
      next()
    }
    else {
      res.status(401).json({message: 'Invalid credentials'})
    }
  }
  catch (err) {
  next(err)
  }
}

// /*
//   If password is missing from req.body, or if it's 3 chars or shorter

//   status 422
//   {
//     "message": "Password must be longer than 3 chars"
//   }
// */
// function checkPasswordLength() {
// if(!req.body.password || !req.body.password.length ) {

// }
// }

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length < 3 ) {
    next ({ message: "Password must be longer than 3 chars", status: 422 })
  } else {
    next()
  }
  
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
restricted,
checkUsernameFree,
checkUsernameExists,
checkPasswordLength,
  
}