const express = require('express')
const cors = require('cors')
const TelegramApi = require('node-telegram-bot-api')
const jwt = require('jsonwebtoken')
const path = require('node:path')
require('dotenv').config({path: path.resolve(__dirname, '.env')})

const {getUserByEmail, getUserById, getAllProblems, getTicket} = require("./api");

// asdfpiertzxvcbot
const token = process.env.TELEGRAM_API


const bot = new TelegramApi(token, {polling: true})

bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  if (text === '/start') {
    await bot.sendMessage(chatId, 'Перейти на сайт', {
      reply_markup: {
        inline_keyboard: [
          [{text: 'Сайт', web_app: {url: 'https://rodent-accepted-shiner.ngrok-free.app/form'}}]
        ]
      }
    })
  }
})

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
const tokenKey = process.env.TOKEN_KEY;


app.post('/api/auth', async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res
      .status(400)
      .json({message: 'password and email is required'});
  }

  const user = await getUserByEmail(email)
  if (password == 123 && user[0]) {
    return res.status(200).json({
      id: user[0].id,
      email: email,
      name: `${user[0].first_name} ${user[0].last_name}`,
      token: jwt.sign({id: user[0].id, email: email}, tokenKey),
    });
  }

  return res
    .status(404)
    .json({message: 'User not found'});
});

app.use(async (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      tokenKey,
      async (err, payload) => {
        if (err) next();
        else if (payload) {
          console.log(payload)
          const user = await getUserById(payload.id);
          req.user = user
          next()

          if (!req.user) next();
        }
      }
    );
  }
});

app.get('/api/ticket/:id', async (req, res) => {
  if (!req.user) return res
    .status(401)
    .json({message: 'Not authorized'});

  try {
    const id = req.params.id
    console.log({id})
    const ticket = await getTicket(id)
    res.send(ticket)
  } catch (e) {
    res.status(400).json({messgae: e.message})
  }
})


app.get('/api/problems', async (req, res) => {
  if (!req.user) return res
    .status(401)
    .json({message: 'Not authorized'});

  try {
    const items = await getAllProblems()
    return res.send({items})
  } catch (e) {
    res.status(400).json({messgae: e.message})
  }
})

app.get('/user', (req, res) => {
  if (req.user) return res.status(200).json(req.user);
  else
    return res
      .status(401)
      .json({message: 'Not authorized'});
});

app.post('/auth', async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    return res.status(400).json({message: 'Пароль и email обязательны'})
  }
  try {
    const user = await getUserByEmail(email.trim())
    if (!user[0] || password !== 123) {
      return res.status(400).json({message: 'Не правильный email или ппроль'})
    }
  } catch (e) {
    return res.status(400).json({message: e.message})
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})