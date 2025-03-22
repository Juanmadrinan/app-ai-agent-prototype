
function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="container-bot">
          <div className="figure">
              <div className="eye"></div>
              <div className="eye"></div>
          </div>
      </div>
      <div className="container-chat">
        
      </div>    
    </>
  )
}

export default App
