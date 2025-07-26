import express from 'express'
import { makeId } from './services/util.service.js'

const app = express()
app.get('/', (req, res) =>
    res.send('Welcome to MissBug server...'))

const bugs = [
    {
        title: "Infinite Loop Detected",
        severity: 4,
        _id: "1NF1N1T3"
    },
    {
        title: "Keyboard Not Found",
        severity: 3,
        _id: "K3YB0RD"
    },
    {
        title: "404 Coffee Not Found",
        severity: 2,
        _id: "C0FF33"
    },
    {
        title: "Unexpected Response",
        severity: 1,
        _id: "G0053"
    }
]
// list
app.get('/api/bug', (req, res) =>
    res.send(bugs))

// add
app.get('/api/bug/save', (req, res) => {
    const { title, severity, _id } = req.query

    const bugToSave = {
        title,
        severity: +severity,
    }
    bugToSave._id = _id || makeId()

    if (_id) {
        const idx = bugs.findIndex(bug => bug._id === _id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugs.push(bugToSave)
    }

    res.send(bugToSave)
})

// read
app.get('/api/bug/:id', (req, res) => {

    const bugId = req.params.id
    const bug = bugs.find(bug => bug._id === bugId)

    res.send(bug)
})

// delete
app.get('/api/bug/:id/remove', (req, res) => {

    const bugId = req.params.id
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    res.send(`bug ${bugId} deleted`)
})




const port = 3030

app.listen(port, () => console.log(`Server ready at port http://127.0.0.1:${port}/`))