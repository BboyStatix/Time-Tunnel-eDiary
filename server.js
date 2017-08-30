const express = require('express')
const app = express()

//for use in production. serve the build folder for files optimized
//for production created by npm run build in client directory
// app.use(express.static(path.join(__dirname, 'client/build')))

app.listen(3001, () => {
  console.log('Example app listening on port 3001!')
})
