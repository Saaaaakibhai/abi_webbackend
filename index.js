const express = require('express')
const app = express()
// const port = 3000
const port = process.env.PORT || 5000;

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database:"abi",
});

app.get('/', (req, res) => {
    res.send('Amanat Business Invest server is running......!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})