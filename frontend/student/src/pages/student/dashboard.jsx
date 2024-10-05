// student_dashboard.tsx
import React, { useState, useEffect } from 'react';
import Navbar from '@/Navbar';
import AppGrid from '@/Apps';
import Dashboard from '@/Home';
import Chat from '@/chat';
import {getProject} from "@/callbacks/student"

const StudentDashboard = () => {
  const [curr, setCurr] = useState('Dashboard');
  const [project, setProject] = useState("")
  
  useState(() => {//on mount: get project using team id in localstorage - creds.team
  if (typeof window !== undefined) (async () => {
  		try {
  			const creds = localStorage.getItem("creds");
  			const temp = await getProject(creds.team);
  			console.log(temp)
  			setProject(temp);
  		} catch (error) {
  			console.error(error)
  		}
  	})();
  }, [])
  

  const handleTabChange = (event, newValue) => {
    setCurr(newValue);
  };
//credentials in localstorage
//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.data.event === 'login-with-token') {
//         const { loginToken } = event.data;
//         console.log('Received login token:', loginToken);
//         // You can use the loginToken for further authentication or other actions
//       }
//     };
//     window.addEventListener('message', handleMessage);
// 
//     return () => {
//       window.removeEventListener('message', handleMessage);
//     };
//   }, []);

  return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Navbar currentTab={curr} onTabChange={handleTabChange} />

          <div style={{ flex: 1, overflow: 'hidden' }}>
              {curr === 'Chat' ? <Chat />:""}
              {curr === 'Dashboard' ? <Dashboard /> : ""}
              {curr === 'Apps' ? <AppGrid project={project} setProject={setProject}/> : ""}
          </div>
      </div>
  );
};

export default StudentDashboard;
