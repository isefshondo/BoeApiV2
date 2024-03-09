require('dotenv').config()
const mongoose = require('mongoose')

async function main() {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(
      `mongodb+srv://OberonsTeam:${process.env.DB_PASSWORD}@boeapiv2cluster.sh14dnv.mongodb.net/?retryWrites=true&w=majority&appName=BoeApiV2Cluster`,
    )
    console.log('Connected to the database')
  } catch (error) {
    console.error(
      `An error occurred while connecting to the database: ${error.message}`,
    )
  }
}

module.exports = main
