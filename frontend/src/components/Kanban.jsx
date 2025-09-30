import React, {useEffect, useState} from 'react';
import { fetchTasks, fetchUsers, createTask, updateTask, deleteTask } from '../api';
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
    const [t,u] = await Promise.all([fetchTasks(), fetchUsers()]);
    setTasks(t);
    setUsers(u);
    setLoading(false);
  }
  const columns = [
    {key:'todo', title:'To Do'},
    {key:'inprogress', title:'In Progress'},
    {key:'done', title:'Done'}
  ];
  async function onDrop(e,status){
    const id = e.dataTransfer.getData('text/plain');
    await updateTask(id,{status});
    load();
  }
  function onDragStart(e,id){
    e.dataTransfer.setData('text/plain',id);
  }
  async function addTask(){
    if(!newTitle) return alert('Enter title');
    await createTask({title:newTitle,description:'',status:'todo'});
    setNewTitle('');
    load();
  }
  async function advance(task){
    const order = ['todo','inprogress','done'];
    const idx = order.indexOf(task.status);
    const next = order[Math.min(idx+1,2)];
    await updateTask(task.id,{status:next});
    load();
  }
  async function removeTask(id){
    if(!confirm('Delete task?')) return;
    await deleteTask(id);
    load();
  }
  function tasksFor(col){
    return tasks.filter(t=>t.status===col).sort((a,b)=> new Date(a.due_date||0)-new Date(b.due_date||0));
  }
  return (
    <div>
      <div className="mb-3 d-flex gap-2">
        <input className="form-control" placeholder="New task title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
        <button className="btn btn-primary" onClick={addTask}>Add</button>
        <select className="form-select w-auto" value={filterUser} onChange={e=>setFilterUser(e.target.value)}>
          <option value="">All users</option>
          {users.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
      {loading ? <div>Loading…</div> :
      <div className="row">
        {columns.map(col=>(
          <div className="col" key={col.key}>
            <div className="card">
              <div className="card-body" style={{minHeight:300}}
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>onDrop(e,col.key)}
              >
                <h5>{col.title}</h5>
                {tasksFor(col.key).filter(t=>!filterUser || String(t.assignee_id)===String(filterUser)).map(task=>(
                  <div key={task.id} className="card mb-2" draggable onDragStart={e=>onDragStart(e,task.id)}>
                    <div className="card-body p-2">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{task.title}</strong>
                          <div className="small text-muted">{task.assignee_name || 'Unassigned'}</div>
                        </div>
                        <div>
                          <button className="btn btn-sm btn-outline-secondary me-1" onClick={()=>advance(task)}>→</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>removeTask(task.id)}>✕</button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <small>Due: {task.due_date || '—'}</small>
                        <div className="progress mt-1" style={{height:6}}>
                          <div className="progress-bar" role="progressbar" style={{width:Math.min(100,task.progress||0)+'%'}} aria-valuenow={task.progress||0}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      }
    </div>
  )
}
