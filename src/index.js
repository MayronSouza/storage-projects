const express = require('express')

const app = express()

app.use(express.json())

const projects = []

// Middleware
function projectExists(req, res, next) {
  const { id } = req.params

  const project = projects.find(p => p.id == id)

  if (!project) {
    return res.json({ message: 'Project not exists' })
  } else {
    return next()
  }
}

// Rota que lista todos os projetos e suas tarefas
app.get('/projects', (req, res) => {
  return res.json(projects)
})

app.post('/projects', (req, res) => {
  const { id, title} = req.body

  const project = {
    id,
    title,
    task: []
  }

  projects.push(project)

  return res.status(201).json(project)

})

app.put('/projects/:id', projectExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id == id)
  project.title = title
  return res.json(project)
})

app.delete('/projects/:id', projectExists, (req, res) => {
  const { id } = req.params

  const project = projects.find(p => p.id == id)

  if (project) {
    projects.splice(project, 1)
    
    return res.json(project)
  } else {
    return res.status(404).json({ message: 'Project not found' })
  }
})

app.post('/projects/:id/tasks', projectExists, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id == id)

  project.task.push({ title })

  return res.status(201).json(project)

})

app.listen(3000, () => console.log('Server on line...'))