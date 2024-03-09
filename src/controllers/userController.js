require('dotenv').config()
const jsonwebtoken = require('jsonwebtoken')
const { User: UserModel, User } = require('../models/User')
const bcrypt = require('bcrypt')

const userController = {
  signUp: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      }

      const doesUserAlreadyExist = await UserModel.findOne({
        email: user.email,
      })
      if (doesUserAlreadyExist) {
        return res
          .status(400)
          .json({ message: 'This e-mail is already being used' })
      }

      const newUser = new User(user)
      await newUser.save()
      res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  signIn: async (req, res) => {
    try {
      const doesUserExist = await UserModel.findOne({
        email: req.body.email,
      })

      if (!doesUserExist) {
        return res.status(404).json({ message: 'User not found' })
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        doesUserExist.password,
      )

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid password' })
      }

      const data = {
        email: doesUserExist.email,
        name: doesUserExist.name,
      }

      const jwt = jsonwebtoken.sign(
        { id: doesUserExist._id },
        process.env.PRIVATE_KEY,
        { expiresIn: '60m' },
      )

      res
        .status(200)
        .json({ message: 'User logged in successfully', jwt, data })
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}

module.exports = userController
