import { useState, useRef, useEffect } from 'react'

export const Chat = () => {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef(null)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (text.trim()) {
      setMessages([...messages, text])
      setText('')
    }
  }

  // Verificamos la compatibilidad al cargar el componente
  useEffect(() => {
    // En Electron, verificamos la disponibilidad de la API de manera segura
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        console.error('Reconocimiento de voz no soportado en este entorno')
        setIsSupported(false)
      }
    } catch (error) {
      console.error('Error al verificar soporte de reconocimiento de voz:', error)
      setIsSupported(false)
    }

    // Cleanup para asegurarnos de detener cualquier reconocimiento activo
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          console.error('Error al detener reconocimiento:', err)
        }
      }
    }
  }, [])

  // Agregar event listener para la tecla "x"
  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (event.key.toLowerCase() === 'x') {
        if (isRecording) {
          stopRecording()
        } else {
          const hasPermission = await requestPermissions()
          if (hasPermission) {
            startRecording()
          } else {
            alert('Se requiere permiso para acceder al micrófono')
          }
        }
      }
    }

    // Agregar el event listener
    document.addEventListener('keydown', handleKeyPress)

    // Limpiar el event listener al desmontar
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [isRecording]) // Dependencia de isRecording para que se actualice el handler cuando cambie

  const startRecording = () => {
    if (!isSupported) {
      console.error('Reconocimiento de voz no disponible')
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      // Limpiamos cualquier instancia previa
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      // Creamos una nueva instancia
      recognitionRef.current = new SpeechRecognition()
      const recognition = recognitionRef.current

      // Configuración
      recognition.lang = 'es-ES'
      recognition.continuous = true
      recognition.interimResults = true

      // Manejo de eventos
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('')

        setText(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        // En caso de que termine inesperadamente
        setIsRecording(false)
      }

      // Iniciamos el reconocimiento
      recognition.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error al iniciar reconocimiento de voz:', error)
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error('Error al detener reconocimiento:', error)
      }
      setIsRecording(false)
    }
  }

  // Para asegurar que se detiene la grabación si se navega a otra página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          console.error('Error al detener reconocimiento:', err)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Función para manejar permisos (importante en Electron)
  const requestPermissions = async () => {
    try {
      // En navegadores modernos podemos verificar/solicitar permisos
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        return true
      }
      return false
    } catch (error) {
      console.error('Error al solicitar permisos de micrófono:', error)
      return false
    }
  }

  return (
    <div className="chat-container">
      {!isSupported ? (
        <div className="error-message">
          El reconocimiento de voz no está disponible en este entorno.
        </div>
      ) : (
        <>
          <div className="container-message-agent">
            <div className="x">
              {messages.map((message, index) => (
                <>
                  <div className="bubble">
                    <div className="figure-mini">
                      <div className="eye-mini"></div>
                      <div className="eye-mini"></div>
                    </div>
                  </div>
                  <div key={index} className="bubble-response">
                    {message}
                  </div>
                </>
              ))}
              <div>
                <p></p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="chat">
              <div className="input-container">
                <div className="status-indicator">
                  {isRecording ? (
                    <p className="recording-status">Grabando... (Presiona X para detener)</p>
                  ) : (
                    <p className="recording-status"></p>
                  )}
                </div>

                <textarea
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Transcripción de voz aquí..."
                  className="transcription-input"
                />
              </div>
            </div>
            <button className="button-chat"></button>
          </form>
        </>
      )}
    </div>
  )
}
