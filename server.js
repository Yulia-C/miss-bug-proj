import express from 'express'
const app = express()
app.get('/', (req, res) =>
    res.send('Hello there'))

app.get('/nono', (req, res) =>
    res.redirect('/'))

const port = 3030

app.listen(port, () => console.log(`Server ready at port http://127.0.0.1:${port}/`))