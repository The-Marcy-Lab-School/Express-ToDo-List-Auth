const Todo = require('../models/Todo');
const userController = require('../controllers/users');

const createTask = async(req, res) => {
  try {
    const payload = await userController.verifyUser;
    const { name, description, dueDate } = req.body;
    await Todo.createTask(payload.userId, name, description, dueDate);
    const data = await Todo.getLastCreated();
    return res.status(201).json(data.rows);
  }
  catch (err) {
    res.status(500).json({ error: 'Internal Server Error: Could not create task. Please try again.' });
  }
};

const getAllTasksByUserId = async(req, res) => {
  try {
    const data = await Todo.getLastCreatedUser();
    const result = await Todo.getAllTasksByUserId(data.rows[0].id);
    console.log(result.json(result.rows));
    return result.json(result.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error: Could not get all tasks from the user.' });
  }
};

const updateTask = (req, res) => {
  const { user, task } = req.params;
  const { name, description, dueDate } = req.body;
  Todo.updateTask(task, user, name, description, dueDate)
    .then(() => res.status(200).json({ message: 'Task successfully updated.' }))
    .catch(() => res.status(500).json({ error: 'Internal Server Error: Task could not be updated.' }));
};

const deleteTask = (req, res) => {
  const { task, user } = req.params;
  Todo.deleteTask(task, user)
    .then(() => res.status(204).json({ message: 'Task successfully deleted.' }))
    .catch(() => res.status(500).json({ error: 'Internal Server Error: Task could not be deleted.' }));
};

const isCompleted = (req, res) => {
  const { task, user } = req.params;
  const { completed } = req.body;
  Todo.isCompleted(task, user, completed)
    .then((data) => res.json(data.rows[0]))
    .catch(() => res.status(500).json({ error: 'Internal Server Error: Could not set task as completed.' }));
};

module.exports = {
  createTask,
  getAllTasksByUserId,
  updateTask,
  deleteTask,
  isCompleted,
};