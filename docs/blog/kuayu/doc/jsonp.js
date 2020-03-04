
const express = require('express')
const app = express()
const port = 3000

app.get('/login', (req, res) => { 
  res.set('Content-Type', 'text/javascript')
  console.log(req.query)
  // 根据不用的callback 传递不同的数据
  let data
  switch ( req.query.id ) {
    case '1':
      data = {name: 'lucy', age: 23, id: 1}
      break;
    case  '2':
      data = {name: 'peter', age: 34, id: 2}
      break
  }
  res.send(`${req.query.callback}(${JSON.stringify(data)})`) 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))