import React, {useEffect, useState} from 'react';
import { fetchTasks, fetchUsers, createTask, updateTask, deleteTask } from '../api';
import './Kanban.css'; // Import the CSS file

export default function Kanban(){
  const [tasks,setTasks]=useState([]);
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [newTitle,setNewTitle]=useState('');
  const [filterUser,setFilterUser]=useState('');
  
  useEffect(()=>{
    load();
  },[]);
  
  async function load(){
    setLoading(true);
    try {
      const [t,u] = await Promise.all([fetchTasks(), fetchUsers()]);
      setTasks(t);
      setUsers(u);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }
  
  const columns = [
    {key:'todo', title:'To Do'},
    {key:'inprogress', title:'In Progress'},
    {key:'done', title:'Done'}
  ];
  
  async function onDrop(e,status){
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    try {
      await updateTask(id,{status});
      load();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }
  
  function onDragStart(e,id){
    e.dataTransfer.setData('text/plain',id);
    e.dataTransfer.effectAllowed = 'move';
  }
  
  function onDragOver(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  }
  
  function onDragLeave(e){
    e.currentTarget.classList.remove('drag-over');
  }
  
  async function addTask(){
    if(!newTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    
    try {
      await createTask({title:newTitle, description:'', status:'todo'});
      setNewTitle('');
      load();
    } catch (error) {
      console.error("Error creating task:", error);
      alert('Failed to create task');
    }
  }
  
  async function advance(task){
    const order = ['todo','inprogress','done'];
    const idx = order.indexOf(task.status);
    const next = order[Math.min(idx+1, 2)];
    
    try {
      await updateTask(task.id, {status: next});
      load();
    } catch (error) {
      console.error("Error advancing task:", error);
      alert('Failed to update task');
    }
  }
  
  async function removeTask(id){
    if(!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(id);
      load();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert('Failed to delete task');
    }
  }
  
  function tasksFor(col){
    return tasks
      .filter(t => t.status === col)
      .filter(t => !filterUser || String(t.assignee_id) === String(filterUser))
      .sort((a,b) => new Date(a.due_date || 0) - new Date(b.due_date || 0));
  }
  
  function getAssigneeName(assigneeId) {
    const user = users.find(u => u.id === assigneeId);
    return user ? user.name : 'Unassigned';
  }
  
  function getAssigneeInitials(name) {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
  
  return (
    <div className="kanban-container">
      <div className="kanban-header">
        <h1 className="kanban-title">Kanban Board</h1>
        <div className="kanban-controls">
          <input 
            className="task-input" 
            placeholder="New task title..." 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addTask()}
          />
          <button className="add-task-btn" onClick={addTask}>
            <i className="fas fa-plus mr-2"></i> Add Task
          </button>
          <select className="user-filter" value={filterUser} onChange={e => setFilterUser(e.target.value)}>
            <option value="">All Users</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="kanban-columns">
          {columns.map(col => (
            <div className="kanban-column" key={col.key}>
              <div className="column-header">
                <h3 className="column-title">{col.title}</h3>
                <span className="column-count">{tasksFor(col.key).length}</span>
              </div>
              <div 
                className="column-body"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={e => onDrop(e, col.key)}
              >
                {tasksFor(col.key).length > 0 ? (
                  tasksFor(col.key).map(task => (
                    <div 
                      key={task.id} 
                      className={`task-card ${task.status}`}
                      draggable
                      onDragStart={e => onDragStart(e, task.id)}
                    >
                      <div className="task-header">
                        <h4 className="task-title">{task.title}</h4>
                        <div className="task-actions">
                          <button 
                            className="task-btn advance-btn" 
                            onClick={() => advance(task)}
                            title="Move to next column"
                          >
                            <i className="fas fa-arrow-right"></i>
                          </button>
                          <button 
                            className="task-btn delete-btn" 
                            onClick={() => removeTask(task.id)}
                            title="Delete task"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="task-assignee">
                        <div className="assignee-avatar">
                          {getAssigneeInitials(getAssigneeName(task.assignee_id))}
                        </div>
                        {getAssigneeName(task.assignee_id)}
                      </div>
                      
                      {task.due_date && (
                        <div className="task-due">
                          <i className="fas fa-calendar-alt due-date-icon"></i>
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                      
                      {task.progress !== undefined && (
                        <div className="task-progress">
                          <div className="d-flex justify-content-between mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="progress-bar-container">
                            <div 
                              className={`progress-bar ${task.status}`} 
                              role="progressbar" 
                              style={{width: `${Math.min(100, task.progress || 0)}%`}}
                              aria-valuenow={task.progress || 0}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <i className="fas fa-clipboard-list"></i>
                    </div>
                    <p className="empty-state-text">No tasks in this column</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}