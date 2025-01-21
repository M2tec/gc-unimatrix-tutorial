import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { loadModule } from './services/cardanoWasm';
import './index.css'

const AppLoader=()=>{
  const [cslReady,setCSLReady]=useState(null);
  
  useEffect(()=>{
    (async()=>{
      loadModule().then(lib=>{if(lib)setCSLReady(true)});
    })()
  },[]);

  if(!cslReady)
    return <h3 className="centered" >Loading dependencies...</h3>

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppLoader />
  </React.StrictMode>,
)
