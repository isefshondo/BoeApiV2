require('dotenv').config()
const mongoose = require('mongoose')

async function main() {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(
      `mongodb+srv://rebecabaruchg:xgpERoWoBmKZZruG@boecluster.ekfb0gh.mongodb.net/?retryWrites=true&w=majority&appName=boeCluster`,
    )
    console.log('Connected to the database')
  } catch (error) {
    console.error(
      `An error occurred while connecting to the database: ${error.message}`,
    )
  }
}

module.exports = main
