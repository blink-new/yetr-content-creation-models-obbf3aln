import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@blinkdotnew/sdk'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import ModelGallery from './components/ModelGallery'
import AISearch from './components/AISearch'
import ContentCenter from './components/ContentCenter'
import { Toaster } from 'react-hot-toast'

// Initialize Blink SDK
const blink = createClient({
  projectId: 'yetr-content-creation-models-obbf3aln',
  authRequired: true
})

export type ViewType = 'chat' | 'gallery' | 'search' | 'content' | 'help'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('chat')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState('creative-writer')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            setCurrentView('chat')
            break
          case 'k':
            e.preventDefault()
            setCurrentView('search')
            break
          case 'g':
            e.preventDefault()
            setCurrentView('gallery')
            break
          case 'f':
            e.preventDefault()
            setCurrentView('content')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold gradient-text">Loading YETR...</h2>
          <p className="text-muted-foreground mt-2">Initializing AI models</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">YETR</h1>
            <p className="text-xl text-muted-foreground mb-2">by Yeti AI</p>
            <p className="text-sm text-muted-foreground">
              Off-the-wall content creation models
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => blink.auth.login()}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold glow-effect hover:bg-primary/90 transition-all"
          >
            Sign In to Continue
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
    setCurrentView('chat')
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'gallery':
        return <ModelGallery onSelectModel={handleModelSelect} selectedModel={selectedModel} />
      case 'search':
        return <AISearch />
      case 'content':
        return <ContentCenter />
      case 'help':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Help & Support</h2>
              <p className="text-muted-foreground">
                Welcome to YETR by Yeti AI! Here are some quick tips:
              </p>
              <div className="mt-6 space-y-4 text-left max-w-md mx-auto">
                <div className="p-4 rounded-lg glass-effect">
                  <h3 className="font-semibold mb-2">Getting Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Select an AI model from the gallery and start chatting to create amazing content.
                  </p>
                </div>
                <div className="p-4 rounded-lg glass-effect">
                  <h3 className="font-semibold mb-2">Voice Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the microphone icon to record voice messages that will be transcribed automatically.
                  </p>
                </div>
                <div className="p-4 rounded-lg glass-effect">
                  <h3 className="font-semibold mb-2">File Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload files in the chat or content center to work with your documents and media.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <ChatInterface selectedModel={selectedModel} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView}
        user={user}
      />
      
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {renderMainContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App