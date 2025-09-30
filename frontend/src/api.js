const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export async function fetchTasks(){
  const res = await fetch(API+'/api/tasks');
  return res.json();
}
export async function fetchUsers(){
  const res = await fetch(API+'/api/users');
  return res.json();
}
export async function createTask(payload){
  const res = await fetch(API+'/api/tasks',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  return res.json();
}
export async function updateTask(id,payload){
  const res = await fetch(API+`/api/tasks/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  return res.json();
}
export async function deleteTask(id){
  await fetch(API+`/api/tasks/${id}`,{method:'DELETE'});
}
