const { User: UserModel, User } = require('../models/User')

const userController = {
  signUp: async (req, res) => {
    try {
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
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
      res.status(201).json({ response, message: 'User created successfully' })
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'Internal server error' })
    }
  },
}

module.exports = userController
