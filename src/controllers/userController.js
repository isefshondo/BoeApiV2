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
      const doesUserAlreadyExist = await UserModel.findOne({
        email: req.body.email,
      })

      if (!doesUserAlreadyExist) {
        return res.status(404).json({ message: 'User not found' })
      }

      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        doesUserAlreadyExist.password,
      )

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid password' })
      }

      const data = {
        email: doesUserAlreadyExist.email,
        name: doesUserAlreadyExist.name,
      }

      const jwt = jsonwebtoken.sign(
        { id: doesUserAlreadyExist._id },
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
  update: async (req, res) => {
    try {
      const userId = req.headers.userId
      const doesUserAlreadyExist = await UserModel.findById(userId)
      const receivedData = req.body

      if (!doesUserAlreadyExist) {
        return res.status(404).json({ message: 'User not found' })
      }

      const shouldUpdateName = receivedData.name !== doesUserAlreadyExist.name
      const shouldUpdateEmail =
        receivedData.email !== doesUserAlreadyExist.email
      const shouldUpdatePassword =
        receivedData.password !== process.env.DEFAULT_PASSWORD

      const hashedPassword = await bcrypt.hash(receivedData.password, 10)

      const executeUpdateData = [
        { shouldUpdate: shouldUpdateName, data: { name: receivedData.name } },
        {
          shouldUpdate: shouldUpdateEmail,
          data: { email: receivedData.email },
        },
        {
          shouldUpdate: shouldUpdatePassword,
          data: { password: hashedPassword },
        },
      ]

      executeUpdateData.forEach(async (data) => {
        if (data.shouldUpdate)
          await UserModel.findByIdAndUpdate(userId, data.data)
      })

      res.status(200).json({ message: 'User updated successfully' })
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  delete: async (req, res) => {
    try {
      const userId = req.headers.userId
      const doesUserAlreadyExist = await UserModel.findById(userId)

      if (!doesUserAlreadyExist) {
        return res.status(404).json({ message: 'User not found' })
      }

      await UserModel.findByIdAndDelete(userId)

      res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}

module.exports = userController
