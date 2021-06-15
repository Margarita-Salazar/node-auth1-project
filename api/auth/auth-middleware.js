const Users = require("../users/users-model");

const bcrypt = require('bcryptjs');
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
 
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  Users.findBy({username})
    .then(username => {
      if (username.length > 0) {
        next({
          status: 422,
          message: "Username taken",
        });
      } else {
        next();
      }
    })
    .catch(next);
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  const {username, password} = req.body;

  Users.findBy({username})
    .first()
    .then(user=>{
      if (!user || !bcrypt.compareSync(password, user.password)) {
        console.log(req.saveUninitialized)
        next({
          status: 401, 
          message: 'Invalid credentials'
        });
      }else{
        next()
      }
    })
    .catch(next)
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body;

  if (
    !password ||
    !password.trim() ||
    password.length < 3) {
      next({
        status: 422,
        message: "Password must be longer then 3 chars",
      });
    } else {
    next();
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
