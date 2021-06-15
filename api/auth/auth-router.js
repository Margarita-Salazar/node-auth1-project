const router = require('express').Router()

const bcrypt = require('bcryptjs');

const Users = require('../users/users-model')

const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware')

// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next)=>{
  let {username, password} = req.body;
  const hash = bcrypt.hashSync(password, 8);
  
  try{
    const newUser = await Users.add({username, password: hash})
    res.status(200).json(newUser)
    
  }catch(err){
    next(err)
  }
})

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/login',checkUsernameExists, (req, res, next)=>{
  const { username } = req.body;
  Users.findBy({username})
    .first()
    .then(user=>{
      req.session.user = user
      res.status(200).json({
        message: `Welcome ${user.username}!`
      })
      
    })
    .catch(next)
})

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.get('/logout', (req, res)=>{
  res.json({
    message: 'logout'
  })
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router
