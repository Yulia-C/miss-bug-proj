import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => {

    res.send('Welcome to MissBug server...')
})

// list
app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

// add
app.get('/api/bug/save', (req, res) => {
    const { title, severity, _id, description } = req.query

    const bugToSave = {
        title,
        severity: +severity,
        _id,
        description,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

// read
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    var visitedBugs = req.cookies.visitedBugs || []

    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }

    if (visitedBugs.length > 3) {
        return res.status(401).send('Wait for a bit')
    }

    console.log('User visited at the following bugs:', visitedBugs)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
  
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

// delete
app.get('/api/bug/:id/remove', (req, res) => {

    const bugId = req.params.id
    bugService.remove(bugId)
        .then(bug => res.send(`bug ${bugId} deleted`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

const port = 3030

app.listen(port, () => loggerService.info(`Server ready at port http://127.0.0.1:${port}/`))