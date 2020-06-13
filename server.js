let port = 9090
const app = require('./app')
const mongodb = require('./mongoDB/mongodb.utils')

mongodb.connect();

app.listen(port, () => {
    console.log(`Store app is running on port ${port}`)
})