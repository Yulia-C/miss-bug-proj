import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'

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

    // console.log('GETTING BUGS');
    // console.log(filter, sort, page);

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
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot add bug')

    const { title, severity, description, labels = ['critical'], owner } = req.body
    // const bugToSave = bugService.getEmptyBug(req.body)
    const bugToSave = {
        title,
        severity: +severity,
        description,
        labels,
        owner
    }

    bugService.save(bugToSave, loggedInUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

// Update
app.put('/api/bug/:id', (req, res) => {
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot update bug')

    const { title, severity, _id, description, labels, owner } = req.body
    const bugToSave = {
        title,
        severity: +severity,
        _id,
        description,
        labels,
        owner
    }

    bugService.save(bugToSave, loggedInUser)
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
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Cannot delete bug')

    const bugId = req.params.id
    bugService.remove(bugId, loggedInUser)
        .then(() => res.send(`bug ${bugId} deleted`))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send(err)
        })
})

// USER API

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => {
            res.send(users)
            console.log('GETTING USERS:');
            console.log(users);
        })
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            loggerService.error('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

// AUTH API 

app.post('/api/auth/signup', (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname
    }

    userService.add(credentials)
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot sign up')
            }
        })
        .catch(err => {
            loggerService.error('Username taken', err)
            res.status(400).send('Username taken')
        })
})

app.post('/api/auth/login', (req, res) => {
    // const credentials = req.body
    const credentials = {
        username: req.body.username,
        password: req.body.password
    }

    authService.checkLogin(credentials)
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Invalid credentials', err)
            res.status(404).send('Invalid credentials')
        })

})


app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => loggerService.info(`Server ready at PORT http://127.0.0.1:${PORT}/`))
// or
// app.listen(port, () => loggerService.info(`Server ready at port http://localhost:${port}/`))