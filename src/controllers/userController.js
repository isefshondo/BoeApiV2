const { User: UserModel, User } = require('../models/User')

const userController = {
    signUp: async(req, res) => {
        try {
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            }

            await UserModel.collection.countDocuments({ email: user.email }, async function (err, count) {
                if (count === 0) {
                    const response = await UserModel.insertOne(user);
                    res.status(201).json({ response, message: 'User created successfully' })
                } else {
                    res.status(400).json({ message: 'This e-mail is already being used' })
                }
            });
        } catch(error) {
            console.log(error.message)
        }
    }
}

module.exports = userController
