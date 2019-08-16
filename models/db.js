axios = require('axios')

const
  { API } = process.env
const
  CRUD = require('./api'),
  util = require('util'),
  bcrypt = require('bcrypt-nodejs')


const createUser = user => {
  let response = "";
  return new Promise((resolve, reject) => {
    bcrypt.hash(user.password, null, null, (error, hash) => {
      user.password = hash
      response = CRUD("Users").Insert(user),
        response.isError ? reject(response) : resolve(response)
    })
  })
}
const uniqueUsername = username => {
  let response = "";
  return new Promise((resolve, reject) => {
    response = CRUD("Users").Count("username=" + username)
    response.isError ? reject(response) : resolve(response)
  })
}

const uniqueEmail = mail => {
  let response = "";
  return new Promise((resolve, reject) => {
    response = CRUD("Users").Count("email=" + mail)
    response.isError ? reject(response) : resolve(response)
  })
}
const getRowUsername = username => {
  let response = "";
  return new Promise((resolve, reject) => {
    response = CRUD("Users").RowUsername(username)
    response.isError ? reject(response) : resolve(response)
  })
}
const getRowId = id => {
  let response = "";
  return new Promise((resolve, reject) => {
    response = CRUD("Users").RowId(id)
    response.isError ? reject(response) : resolve(response)
  })
}
const updateUser = (id, row) => {
  let response = "";
  return new Promise((resolve, reject) => {
    response = CRUD("Users").Update(id, row)
    response.isError ? reject(response) : resolve(response)
  })
}
const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

// FUNCTION TO GET ID FROM USERNAME
const getId = username => {
  return new Promise((resolve, reject) => {
    response = CRUD("Users").RowUsername(username)
    response.isError ? reject(response) : resolve(response)
  })
}


const getNotes = (user) => {
  return new Promise((resolve, reject) => {
    response = CRUD("Notes").ListBY("user="+user)
    response.isError ? reject(response) : resolve(response)
  })
}



module.exports = {
  createUser,
  updateUser,
  getNotes,
  uniqueUsername,
  getRowUsername,
  getRowId,
  uniqueEmail,
  comparePassword,
  getId
}
