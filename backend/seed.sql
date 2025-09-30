USE pm_dashboard;
INSERT INTO users (name,email) VALUES ('Ayesha Khan','ayesha@example.com'),('Bilal Ahmed','bilal@example.com'),('Client John','john@example.com');
INSERT INTO tasks (title,description,status,due_date,assignee_id,progress) VALUES
('Design project board','Set up initial boards and columns','todo',NULL,1,0),
('Build API endpoints','Create tasks API and user endpoints','inprogress',NULL,2,40),
('Deploy demo','Deploy frontend and backend to staging','todo','2025-10-05',3,0),
('QA & testing','Run end-to-end tests and fix bugs','done','2025-09-20',2,100);
