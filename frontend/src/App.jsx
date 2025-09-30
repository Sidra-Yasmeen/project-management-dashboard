import React from 'react';
import Kanban from './components/Kanban';
export default function App(){
  return (
    <div className="container py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h2>Project Management Dashboard</h2>
        <div>Logged in as <strong>Ayesha</strong></div>
      </header>
      <Kanban />
    </div>
  )
}
