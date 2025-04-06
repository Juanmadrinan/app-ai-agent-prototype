import { Chat } from "./Chat"
function App() {
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="container">
        <div className="container-bot">
          <div className="figure">
            <div className="eye"></div>
            <div className="eye"></div>
          </div>
          <div className="options">
            <div className="oneandtwo">
              <div className="voice">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="63%" fill="#DFF5FF"><path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" /></svg>
              </div>
              <div className="message">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="60%" fill="#DFF5FF"><path d="M880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" /></svg>
              </div>
            </div>
          </div>
          <div className="option-text">
            <p>Press X for Audio and Y for Write</p>
          </div>
        </div>
        <div className="container-chat">
          <div className="container-message-chat">
            <div className="message-chat">
              {/* <form>
                <div className="chat">
                  <Chat></Chat>
                </div>
                <button onSubmit={handleClick}></button>
              </form> */}
              <Chat></Chat>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
