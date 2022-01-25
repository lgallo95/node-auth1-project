
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')
const Store = require('connect-session-knex')(session)

const authRouter = require('./auth/auth-router')
const usersRouter = require('./users/users-router')

const server = express();

server.use(session({
  name: 'chocolatechip',
  secret: process.env.SECRET || 'keep it secret',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // if true, only works on HTTPS
    httpOnly: false, // if true, javascript can't read cookie
  },
  rolling: true,
  resave: false, // ignore it
  saveUninitialized: false, // if true, server would always save the session
  store: new Store({
    knex: require('../data/db-config'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  })
}))

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
