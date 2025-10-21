import express from "express"
import cors from 'cors';

const app = express()
app.use(cors())
app.use(express.json());

let tasks = [
    { id: 1, text: 'Learn Express.js routes', completed: false },
    { id: 2, text: 'Set up React frontend', completed: false },
    { id: 3, text: 'Implement GET all tasks', completed: true },
];

// POST a new task (CREATE operation)
app.post('/api/tasks', (req, res) => {
    // 1. Get the data from the request body (thanks to express.json() middleware)
    const newTaskText = req.body.text;

    // Basic Validation: Ensure text is provided
    if (!newTaskText) {
        // Send a 400 Bad Request error if required data is missing
        return res.status(400).json({ error: 'Please provide task text' });
    }

    // 2. Create the new task object
    const newTask = {
        id: tasks.length + 1,
        text: newTaskText,
        completed: false
    };

    // 3. Add the new task to our in-memory array
    tasks.push(newTask);

    // 4. Respond to the client with the newly created task (and a 201 Created status)
    res.status(201).json(newTask);
});

// PUT/PATCH to update a specific task (UPDATE operation)
// e.g., PUT /api/tasks/1 to update the task with id 1
app.put('/api/tasks/:id', (req, res) => {
    // 1. Get the ID from the URL parameter and e0nsure it's a number
    const taskId = parseInt(req.params.id);

    // 2. Find the task in the array
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    // Handle Task Not Found (404 Error)
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // 3. Update the task properties based on the request body
    const task = tasks[taskIndex];

    // Check if 'completed' status was sent in the body
    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    // Check if 'text' was sent in the body
    if (req.body.text) {
        task.text = req.body.text;
    }

    // 4. Send the updated task back to the client
    res.json(task);
});

// DELETE a specific task (DELETE operation)
// e.g., DELETE /api/tasks/1 to delete the task with id 1
app.delete('/api/tasks/:id', (req, res) => {
    // 1. Get the ID from the URL parameter
    const taskId = parseInt(req.params.id);

    // 2. Find the task in the array (similar to PUT)
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    // Handle Task Not Found (404 Error)
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // 3. Remove the task from the array using splice
    tasks.splice(taskIndex, 1); // splice(start index, number of elements to remove)

    // 4. Respond with a 204 No Content status, which is common for successful deletions
    res.status(204).send(); // send() without a body is often used for 204
});

const PORT = 5000

app.get('/', (req, res) => {
    // Send a response back to the client
    res.send('Hello from the Task Tracker API!');
});

app.get('/api/tasks', (req, res) => {
    // res.json() sends the JavaScript object/array as a JSON string
    res.json(tasks);
})

app.listen(PORT, () => {
    console.log(`server successfully running on port ${PORT}`)
})