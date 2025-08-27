const { connect } = require("mongoose")
const { MONGODB_URI } = require("./secrets")

const ConnectDB = async () => {
    try {
        await connect(MONGODB_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("Error Connecting MongoDB", + error)
        process.exit(1)
    }
}

module.exports = ConnectDB;