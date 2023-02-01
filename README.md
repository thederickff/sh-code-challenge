### Sword Health Code Challenge

A software to account for maintenance tasks performed during a working day. This application has two types of users (Manager, Technician).
The technician performs tasks and is only able to see, create or update his own performed tasks.
The manager can see tasks from all the technicians, delete them, and should be notified when some tech performs a task.
A task has a summary (max: 2500 characters) and a date when it was performed, the summary from the task can contain personal information.

Three users will be created on first startup, one manager and
two technicians.

The app is not using real jwt token validation, so for simulations purposes
the api requires the id of the user instead, for example use:

```sh
curl -H 'Authorization: Bearer 1' http://localhost:3210/tasks
```

To make a call as the user with id 1.