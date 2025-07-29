import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Brain, 
  Zap,
  Sparkles,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Edit,
  Volume2,
  StopCircle,
  Upload
} from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  model?: string
  isStreaming?: boolean
}

interface ChatInterfaceProps {
  selectedModel: string
}

const modelInfo = {
  'creative-writer': {
    name: 'Creative Writer',
    description: 'Specialized in creative writing, storytelling, and imaginative content',
    color: '#f59e0b',
    capabilities: ['Creative Writing', 'Storytelling', 'Poetry', 'Fiction'],
    prompt: 'You are a Creative Writer AI, specialized in crafting engaging stories, poetry, and imaginative content. You excel at character development, world-building, and creating compelling narratives across all genres.'
  },
  'code-wizard': {
    name: 'Code Wizard',
    description: 'Expert in programming, debugging, and software architecture',
    color: '#10b981',
    capabilities: ['Programming', 'Debugging', 'Architecture', 'Code Review'],
    prompt: 'You are a Code Wizard AI, an expert programmer with deep knowledge of multiple programming languages, frameworks, and software architecture. You provide clean, efficient code solutions and detailed explanations.'
  },
  'art-director': {
    name: 'Art Director',
    description: 'Visual design expert for creative projects and branding',
    color: '#f97316',
    capabilities: ['Visual Design', 'Branding', 'UI/UX', 'Creative Direction'],
    prompt: 'You are an Art Director AI, specializing in visual design, branding, and creative direction. You provide expert guidance on design principles, color theory, typography, and visual storytelling.'
  },
  'music-composer': {
    name: 'Music Composer',
    description: 'Creates original compositions and musical arrangements',
    color: '#8b5cf6',
    capabilities: ['Composition', 'Arrangement', 'Music Theory', 'Sound Design'],
    prompt: 'You are a Music Composer AI, expert in creating original compositions, melodies, and musical arrangements across various genres. You understand music theory, harmony, and sound design.'
  },
  'video-editor': {
    name: 'Video Editor',
    description: 'Professional video editing and post-production specialist',
    color: '#ef4444',
    capabilities: ['Video Editing', 'Motion Graphics', 'Color Grading', 'Audio Sync'],
    prompt: 'You are a Video Editor AI, specialized in video editing, post-production, motion graphics, and visual storytelling. You provide expert guidance on editing techniques and video production.'
  },
  'image-generator': {
    name: 'Image Generator',
    description: 'AI-powered image creation and manipulation specialist',
    color: '#06b6d4',
    capabilities: ['Image Generation', 'Style Transfer', 'Photo Editing', 'Concept Art'],
    prompt: 'You are an Image Generator AI, specialized in creating and manipulating images using AI. You excel at generating concept art, digital illustrations, and providing guidance on visual creation.'
  },
  'brain-storm': {
    name: 'Brain Storm',
    description: 'Ideation and brainstorming specialist for creative problem-solving',
    color: '#ec4899',
    capabilities: ['Ideation', 'Problem Solving', 'Innovation', 'Strategic Thinking'],
    prompt: 'You are a Brain Storm AI, specialized in ideation, creative problem-solving, and innovation. You excel at generating unique ideas, finding creative solutions, and thinking outside the box.'
  },
  'lightning-fast': {
    name: 'Lightning Fast',
    description: 'Quick response specialist for rapid content generation',
    color: '#eab308',
    capabilities: ['Quick Responses', 'Rapid Prototyping', 'Instant Solutions', 'Fast Iteration'],
    prompt: 'You are Lightning Fast AI, optimized for quick, concise, and accurate responses. You provide rapid solutions and instant feedback while maintaining quality and relevance.'
  }
}

const suggestedPrompts = [
  "Write a sci-fi story about AI consciousness",
  "Create a marketing campaign for a new product",
  "Design a user interface for a mobile app",
  "Compose a song about digital transformation",
  "Generate ideas for a startup business",
  "Write code for a React component",
  "Create a brand identity for a tech company",
  "Plan a video editing workflow",
  "Generate creative writing prompts",
  "Brainstorm innovative solutions"
]

export default function ChatInterface({ selectedModel }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentModel = modelInfo[selectedModel as keyof typeof modelInfo] || modelInfo['creative-writer']

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat-${selectedModel}`)
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }
  }, [selectedModel])

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat-${selectedModel}`, JSON.stringify(messages))
    }
  }, [messages, selectedModel])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        model: selectedModel,
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      let fullResponse = ''
      await blink.ai.streamText(
        {
          prompt: `${currentModel.prompt}\n\nUser request: ${input}`,
          model: 'gpt-4o-mini',
          maxTokens: 2000
        },
        (chunk) => {
          fullResponse += chunk
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: fullResponse }
                : msg
            )
          )
        }
      )

      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, isStreaming: false }
            : msg
        )
      )

      toast.success('Response generated successfully!')

    } catch (error) {
      console.error('Error generating response:', error)
      toast.error('Failed to generate response. Please try again.')
      
      // Remove the failed assistant message
      setMessages(prev => prev.filter(msg => msg.id !== (Date.now() + 1).toString()))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard!')
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        
        try {
          // Convert to base64 for transcription
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const dataUrl = reader.result as string
              const base64Data = dataUrl.split(',')[1]
              resolve(base64Data)
            }
            reader.onerror = reject
            reader.readAsDataURL(audioBlob)
          })

          // Transcribe audio
          const { text } = await blink.ai.transcribeAudio({
            audio: base64,
            language: 'en'
          })

          if (text.trim()) {
            setInput(text)
            toast.success('Audio transcribed successfully!')
          } else {
            toast.error('No speech detected in audio')
          }
        } catch (error) {
          console.error('Transcription error:', error)
          toast.error('Failed to transcribe audio')
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      recorder.start()
      setIsRecording(true)
      toast.success('Recording started...')
    } catch (error) {
      console.error('Error starting recording:', error)
      toast.error('Failed to start recording. Please check microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
      toast.success('Recording stopped. Processing...')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Upload file to storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `uploads/${file.name}`,
        { upsert: true }
      )

      // Add file reference to input
      setInput(prev => prev + `\n\n[Uploaded file: ${file.name}](${publicUrl})`)
      toast.success('File uploaded successfully!')
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Failed to upload file')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(`chat-${selectedModel}`)
    toast.success('Chat cleared!')
  }

  const exportChat = () => {
    const chatData = {
      model: currentModel.name,
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `yetr-chat-${selectedModel}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Chat exported successfully!')
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: currentModel.color }}
            />
            <div>
              <h1 className="text-lg font-semibold">{currentModel.name}</h1>
              <p className="text-sm text-muted-foreground">{currentModel.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentModel.capabilities.map((cap) => (
              <Badge key={cap} variant="secondary" className="text-xs">
                {cap}
              </Badge>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="ml-2"
            >
              Clear Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportChat}
              disabled={messages.length === 0}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
            >
              <div className="mb-8">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${currentModel.color}20` }}
                >
                  <Sparkles 
                    className="w-8 h-8"
                    style={{ color: currentModel.color }}
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">Ready to create something amazing?</h2>
                <p className="text-muted-foreground">
                  I'm {currentModel.name}, your AI assistant for {currentModel.description.toLowerCase()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.slice(0, 6).map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="p-4 text-left rounded-lg glass-effect hover:border-primary/50 transition-all"
                  >
                    <p className="text-sm">{prompt}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`message-bubble ${message.role} max-w-[80%]`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.isStreaming && (
                        <div className="flex gap-1 mt-2">
                          <div className="typing-indicator"></div>
                          <div className="typing-indicator"></div>
                          <div className="typing-indicator"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {message.role === 'assistant' && !message.isStreaming && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="h-6 px-2 text-xs hover:bg-white/10"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-white/10"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-white/10"
                      >
                        <ThumbsDown className="h-3 w-3 mr-1" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs hover:bg-white/10"
                      >
                        <Share className="h-3 w-3 mr-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="min-h-[60px] pr-40 resize-none bg-input border-border focus:border-primary/50 transition-colors"
              disabled={isLoading}
            />
            
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="*/*"
              />
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                disabled={isLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-accent ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
                disabled={isLoading}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>AI Model: {currentModel.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>Status: {isLoading ? 'Thinking...' : 'Ready'}</span>
              </div>
            </div>
            <div>
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}