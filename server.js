import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Welcome to MissBug server...')
})

//* Express Routing:
// list 
app.get('/api/bug', (req, res) => {
    const { txt, sortBy, sortDir, pageIdx, minSeverity } = req.query

    const filter = {
        txt: txt || '',
        minSeverity: parseInt(minSeverity) || 0,
    }

    const sort = {
        sortBy: sortBy,
        sortDir: parseInt(sortDir) || 1
    }

    const page = {
        pageIdx: parseInt(pageIdx) || 0
    }

    console.log('GETTING BUGS');
    console.log(filter, sort, page);

    bugService.query(filter, sort, page)
        .then(bugs => { res.send(bugs) })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot load bugs')
        })

})

app.get('/api/bug/totalCount', (req, res) => {
    bugService.getTotalCount()
        .then((count) => res.send(count))
        .catch((err) => {
            loggerService.error('Cannot get total bugs', err)
            res.status(503).send('Cannot get total bugs')
        })
})

// Create
app.post('/api/bug', (req, res) => {
    const { title, severity, description, labels = ['critical'] } = req.body
    // const bugToSave = bugService.getEmptyBug(req.body)
    const bugToSave = {
        title,
        severity: +severity,
        description,
        labels
    }
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

// Update
app.put('/api/bug/:id', (req, res) => {
    const { title, severity, _id, description, labels } = req.body
    const bugToSave = {
        title,
        severity: +severity,
        _id,
        description,
        labels
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send(err)
        })
})

// read by id
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
app.delete('/api/bug/:id', (req, res) => {

    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} deleted`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

const port = 3030
app.listen(port, () => loggerService.info(`Server ready at port http://127.0.0.1:${port}/`))
// or
// app.listen(port, () => loggerService.info(`Server ready at port http://localhost:${port}/`))