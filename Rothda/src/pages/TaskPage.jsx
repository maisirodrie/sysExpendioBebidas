import React, { useEffect } from 'react'
import { useTasks } from '../context/TasksContext'
import TaskCard from '../components/TaskCard'
import { Link } from 'react-router-dom'
import taskModel from '../../../src/models/task.model'

function TaskPage() {

    const {getTasks, tasks} = useTasks()

    useEffect(() =>{
        getTasks()
    }, [])

  return (

    <div>

        <TaskCard/>

    </div>
  )
}

export default TaskPage
