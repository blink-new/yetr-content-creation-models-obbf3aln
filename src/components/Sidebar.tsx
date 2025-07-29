import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Grid3X3, 
  Search, 
  FileText, 
  HelpCircle,
  Plus,
  Bot,
  Sparkles,
  Zap,
  Brain,
  Palette,
  Code,
  Music,
  Video,
  Image as ImageIcon,
  User,
  Settings,
  LogOut,
  Trash2,
  Clock
} from 'lucide-react'
import { ViewType } from '../App'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { blink } from '../blink/client'
import toast from 'react-hot-toast'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  user: any
}

const navigationItems = [
  { id: 'chat' as ViewType, label: 'New dialogue', icon: MessageSquare, shortcut: 'Ctrl+N' },
  { id: 'search' as ViewType, label: 'AI Search', icon: Search },
  { id: 'gallery' as ViewType, label: 'Model Gallery', icon: Grid3X3 },
  { id: 'content' as ViewType, label: 'Content Center', icon: FileText },
  { id: 'help' as ViewType, label: 'Help', icon: HelpCircle },
]

const aiModels = [
  { id: 'creative-writer', name: 'Creative Writer', icon: Sparkles, color: '#f59e0b' },
  { id: 'code-wizard', name: 'Code Wizard', icon: Code, color: '#10b981' },
  { id: 'art-director', name: 'Art Director', icon: Palette, color: '#f97316' },
  { id: 'music-composer', name: 'Music Composer', icon: Music, color: '#8b5cf6' },
  { id: 'video-editor', name: 'Video Editor', icon: Video, color: '#ef4444' },
  { id: 'image-generator', name: 'Image Generator', icon: ImageIcon, color: '#06b6d4' },
  { id: 'brain-storm', name: 'Brain Storm', icon: Brain, color: '#ec4899' },
  { id: 'lightning-fast', name: 'Lightning Fast', icon: Zap, color: '#eab308' },
]

interface ChatHistory {
  id: string
  title: string
  model: string
  lastMessage: string
  timestamp: Date
  messageCount: number
}

export default function Sidebar({ currentView, onViewChange, user }: SidebarProps) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  // Load chat history from localStorage
  useEffect(() => {
    const loadChatHistory = () => {
      const history: ChatHistory[] = []
      
      aiModels.forEach(model => {
        const savedMessages = localStorage.getItem(`chat-${model.id}`)
        if (savedMessages) {
          try {
            const messages = JSON.parse(savedMessages)
            if (messages.length > 0) {
              const lastUserMessage = messages.filter((msg: any) => msg.role === 'user').pop()
              if (lastUserMessage) {
                history.push({
                  id: `${model.id}-${Date.now()}`,
                  title: lastUserMessage.content.slice(0, 30) + (lastUserMessage.content.length > 30 ? '...' : ''),
                  model: model.name,
                  lastMessage: lastUserMessage.content,
                  timestamp: new Date(lastUserMessage.timestamp),
                  messageCount: messages.length
                })
              }
            }
          } catch (error) {
            console.error(`Error loading chat history for ${model.id}:`, error)
          }
        }
      })

      // Sort by timestamp (most recent first)
      history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      setChatHistory(history.slice(0, 10)) // Show only last 10 chats
      setIsLoadingHistory(false)
    }

    loadChatHistory()
    
    // Refresh history every 5 seconds when on chat view
    const interval = setInterval(() => {
      if (currentView === 'chat') {
        loadChatHistory()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [currentView])

  const handleNewChat = () => {
    onViewChange('chat')
    toast.success('Starting new conversation!')
  }

  const handleModelSelect = (modelId: string) => {
    onViewChange('gallery')
    // The gallery component will handle model selection
    toast.success(`Switched to ${aiModels.find(m => m.id === modelId)?.name}`)
  }

  const clearAllChats = () => {
    aiModels.forEach(model => {
      localStorage.removeItem(`chat-${model.id}`)
    })
    setChatHistory([])
    toast.success('All chat history cleared!')
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen"
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.displayName || user?.email || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">
              YETR by Yeti AI
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => blink.auth.logout()}
            className="h-8 w-8 p-0 hover:bg-sidebar-accent"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New dialogue
          <span className="ml-auto text-xs opacity-70">Ctrl+N</span>
        </motion.button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {navigationItems.slice(1).map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => onViewChange(item.id)}
                className={`sidebar-item w-full text-left ${isActive ? 'active' : ''}`}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="text-sm">{item.label}</span>
                {item.shortcut && (
                  <span className="ml-auto text-xs opacity-50">{item.shortcut}</span>
                )}
              </motion.button>
            )
          })}
        </div>

        <Separator className="mx-4" />

        {/* AI Models */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              AI Models
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewChange('gallery')}
              className="h-6 px-2 text-xs hover:bg-sidebar-accent"
            >
              View All
            </Button>
          </div>
          <div className="space-y-1">
            {aiModels.slice(0, 6).map((model) => {
              const Icon = model.icon
              return (
                <motion.button
                  key={model.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleModelSelect(model.id)}
                  className="sidebar-item w-full text-left group"
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: model.color }}
                  />
                  <Icon className="h-4 w-4 mr-3 opacity-70 group-hover:opacity-100" />
                  <span className="text-sm">{model.name}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        <Separator className="mx-4" />

        {/* Recent Chats */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Chats
            </h3>
            {chatHistory.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllChats}
                className="h-6 px-2 text-xs hover:bg-sidebar-accent text-red-400 hover:text-red-300"
                title="Clear all chats"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="space-y-1">
            {isLoadingHistory ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-8 bg-muted/50 rounded"></div>
                  </div>
                ))}
              </div>
            ) : chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <motion.button
                  key={chat.id}
                  whileHover={{ x: 4 }}
                  onClick={() => onViewChange('chat')}
                  className="sidebar-item w-full text-left group"
                  title={chat.lastMessage}
                >
                  <Bot className="h-4 w-4 mr-3 opacity-50" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{chat.title}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{chat.model}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(chat.timestamp)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
                    {chat.messageCount}
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-xs text-muted-foreground">No recent chats</p>
                <p className="text-xs text-muted-foreground">Start a conversation!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>YETR by Yeti AI</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              title="Settings"
            >
              <Settings className="h-3 w-3" />
            </Button>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online" />
          </div>
        </div>
      </div>
    </motion.aside>
  )
}