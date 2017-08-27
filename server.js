const express = require('express')
const app = express()
// const path = require('path');

// app.use(express.static(path.join(__dirname, 'client/build')))

// app.get('/hello', (req,res) => {
//   console.log('hello')
// })

app.listen(3001, () => {
  console.log('Example app listening on port 3001!')
})
