const datetime = require('moment');

module.exports = app => {
    const getTasks = (req, res) => {
        const date = req.query.date ? req.query.date : datetime().endOf('day').toDate();
        
        app.db('tasks')
            .where({ user_id: req.user.id })
            .where('estimate_date', '<=', date)
            .where('delete_at', 'is', null)
            .orderBy('estimate_date')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).json(err))
    }
    
    const save = (req, res) => {
        if (!req.body.description.trim()) {
            return res.status(400).send('A tarefa deve conter uma descrição');
        }
        app.db('tasks')
            .insert({
                description: req.body.description,
                estimate_date: req.body.estimate_date,
                done_date: req.body.done_date ? req.body.done_date : null,
                create_at: datetime().format(),
                user_id: req.user.id,
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json(err))
    }
    
    const remove = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, user_id: req.user.id })
            .update({ delete_at: datetime().format() })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json(err))
    }
    
    const updateDoneAt = (req, res, done_date) => {
        app.db('tasks')
            .where({ id: req.params.id, user_id: req.user.id })
            .update({ done_date })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json(err))
    }

    const toggleTask = (req, res) => {
        app.db('tasks')
            .where({ id: req.params.id, user_id: req.user.id })
            .first()
            .then(task => {
                if (!task) {
                    return res.send(400).send('Task not found');
                }
                
                const done_date = task.done_date ? null : new Date();
                updateDoneAt(req, res, done_date);
            })
            .catch(err => res.status(400).json(err))
    }
    
    return {
        getTasks,
        save,
        remove,
        toggleTask
    }
}