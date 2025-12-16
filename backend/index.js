require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000 
const mongoose = require('mongoose'); 

app.get('/', (req, res) => {
  res.send('Hello World!')
})


async function main() {
  await mongoose.connect(process.env.DB_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main().then(() => console.log("Mongodb connected successfully")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
 /// step by step of using mongo  ; 
 // 1 .setup mongoose
 //2.setup schema
//3. setup model 
//3. setup route
