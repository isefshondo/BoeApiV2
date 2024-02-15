const mongoose = require('mongoose')

async function main() {
  try {
    mongoose.set('strictQuery', true)
    // TODO: Insert the database URL into the .connect function
    await mongoose.connect()
    console.log('Connected to the database')
  } catch (error) {
    console.error(
      `An error occurred while connecting to the database: ${error.message}`,
    )
  }
}

module.exports = main
