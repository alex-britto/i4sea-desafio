
export const getAllTasks = async () => {
    const response = await fetch('http://localhost:3000/tasks')
    const data = await response.json()
  
    return data
  }