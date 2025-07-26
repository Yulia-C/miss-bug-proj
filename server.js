import express from 'express'
import { bugService } from './services/bug.service.js'

const app = express()
app.get('/', (req, res) =>
    res.send('Welcome to MissBug server...'))


// list
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

// add
app.get('/api/bug/save', (req, res) => {
    const { title, severity, _id } = req.query

    const bugToSave = {
        title,
        severity: +severity,
        _id,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

// read
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id

    bugService.getById(bugId)
        .then(bug => res.send(bug))
})

// delete
app.get('/api/bug/:id/remove', (req, res) => {

    const bugId = req.params.id
    bugService.remove(bugId)
        .then(bug => res.send(`bug ${bugId} deleted`))

})

const port = 3030

app.listen(port, () => console.log(`Server ready at port http://127.0.0.1:${port}/`))