import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FolderOpen, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Code, 
  Download,
  Share,
  Trash2,
  Eye,
  Edit,
  Star,
  Clock,
  Filter,
  Grid3X3,
  List,
  Search,
  Plus,
  File,
  Folder,
  MoreHorizontal
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { blink } from '../blink/client'
import toast from 'react-hot-toast'

interface ContentItem {
  id: string
  name: string
  type: 'document' | 'image' | 'video' | 'audio' | 'code' | 'folder'
  size: string
  createdAt: string
  modifiedAt: string
  thumbnail?: string
  description?: string
  tags: string[]
  starred: boolean
  url?: string
  content?: string
}

// Mock data - in a real app, this would come from a database
const initialContentItems: ContentItem[] = [
  {
    id: '1',
    name: 'Frontend-Backend Architecture Diagram',
    type: 'document',
    size: '2.4 MB',
    createdAt: 'Today 00:24',
    modifiedAt: 'Today 00:24',
    description: 'System architecture diagram for full-stack application',
    tags: ['Architecture', 'Diagram', 'System Design'],
    starred: false,
    content: 'Detailed system architecture documentation...'
  },
  {
    id: '2',
    name: 'Doubao frontend clone integrated with OpenRouter API',
    type: 'code',
    size: '156 KB',
    createdAt: 'Yesterday 22:54',
    modifiedAt: 'Yesterday 22:54',
    description: 'React frontend clone with API integration',
    tags: ['React', 'API', 'Clone'],
    starred: true,
    content: 'import React from "react";\n// Frontend implementation...'
  },
  {
    id: '3',
    name: 'Detailed description of Doubao chat interface',
    type: 'document',
    size: '45 KB',
    createdAt: 'July 12, 19:14',
    modifiedAt: 'July 12, 19:14',
    description: 'Comprehensive documentation of chat interface features',
    tags: ['Documentation', 'UI/UX', 'Chat'],
    starred: false,
    content: 'Chat interface documentation with detailed specifications...'
  },
  {
    id: '4',
    name: 'AI-generated landscape artwork',
    type: 'image',
    size: '1.2 MB',
    createdAt: 'July 7, 21:27',
    modifiedAt: 'July 7, 21:27',
    description: 'Beautiful AI-generated landscape with mountains and lakes',
    tags: ['AI Art', 'Landscape', 'Digital Art'],
    starred: true,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
  },
  {
    id: '5',
    name: 'Creative Writing Samples',
    type: 'folder',
    size: '892 KB',
    createdAt: 'July 7, 20:07',
    modifiedAt: 'July 7, 20:07',
    description: 'Collection of AI-generated creative writing pieces',
    tags: ['Writing', 'Creative', 'Stories'],
    starred: false
  },
  {
    id: '6',
    name: 'Product Demo Video',
    type: 'video',
    size: '15.3 MB',
    createdAt: 'June 26, 12:54',
    modifiedAt: 'June 26, 12:54',
    description: 'Demo video showcasing YETR AI capabilities',
    tags: ['Demo', 'Video', 'Product'],
    starred: true,
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=150&fit=crop'
  },
  {
    id: '7',
    name: 'Background Music Track',
    type: 'audio',
    size: '4.7 MB',
    createdAt: 'June 20, 15:30',
    modifiedAt: 'June 20, 15:30',
    description: 'AI-composed background music for videos',
    tags: ['Music', 'Audio', 'Background'],
    starred: false
  }
]

const fileTypeIcons = {
  document: FileText,
  image: ImageIcon,
  video: Video,
  audio: Music,
  code: Code,
  folder: Folder
}

const fileTypeColors = {
  document: '#3b82f6',
  image: '#10b981',
  video: '#ef4444',
  audio: '#8b5cf6',
  code: '#f59e0b',
  folder: '#6b7280'
}

export default function ContentCenter() {
  const [contentItems, setContentItems] = useState<ContentItem[]>(initialContentItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('modified')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredItems = contentItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = selectedType === 'all' || item.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'type':
          return a.type.localeCompare(b.type)
        case 'modified':
        default:
          return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
      }
    })

  const toggleStar = (id: string) => {
    setContentItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    )
    const item = contentItems.find(item => item.id === id)
    toast.success(item?.starred ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setIsUploading(true)

    try {
      for (const file of files) {
        // Upload to Blink storage
        const { publicUrl } = await blink.storage.upload(
          file,
          `content/${file.name}`,
          { upsert: true }
        )

        // Determine file type
        let fileType: ContentItem['type'] = 'document'
        if (file.type.startsWith('image/')) fileType = 'image'
        else if (file.type.startsWith('video/')) fileType = 'video'
        else if (file.type.startsWith('audio/')) fileType = 'audio'
        else if (file.type.includes('javascript') || file.type.includes('typescript') || 
                 file.name.endsWith('.js') || file.name.endsWith('.ts') || 
                 file.name.endsWith('.jsx') || file.name.endsWith('.tsx') ||
                 file.name.endsWith('.py') || file.name.endsWith('.java')) {
          fileType = 'code'
        }

        // Create new content item
        const newItem: ContentItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: fileType,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          createdAt: new Date().toLocaleString(),
          modifiedAt: new Date().toLocaleString(),
          description: `Uploaded ${fileType} file`,
          tags: ['Uploaded', fileType.charAt(0).toUpperCase() + fileType.slice(1)],
          starred: false,
          url: publicUrl,
          thumbnail: fileType === 'image' ? publicUrl : undefined
        }

        setContentItems(prev => [newItem, ...prev])
      }

      toast.success(`Successfully uploaded ${files.length} file(s)!`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files. Please try again.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const deleteItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id))
    setSelectedItems(prev => prev.filter(itemId => itemId !== id))
    toast.success('Item deleted successfully')
  }

  const downloadItem = async (item: ContentItem) => {
    if (item.url) {
      // For files with URLs, download directly
      const link = document.createElement('a')
      link.href = item.url
      link.download = item.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (item.content) {
      // For text content, create a blob and download
      const blob = new Blob([item.content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = item.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
    toast.success('Download started!')
  }

  const shareItem = (item: ContentItem) => {
    if (navigator.share && item.url) {
      navigator.share({
        title: item.name,
        text: item.description,
        url: item.url
      })
    } else if (item.url) {
      navigator.clipboard.writeText(item.url)
      toast.success('Link copied to clipboard!')
    } else {
      toast.error('This item cannot be shared')
    }
  }

  const createFolder = () => {
    const folderName = prompt('Enter folder name:')
    if (folderName) {
      const newFolder: ContentItem = {
        id: Date.now().toString(),
        name: folderName,
        type: 'folder',
        size: '0 KB',
        createdAt: new Date().toLocaleString(),
        modifiedAt: new Date().toLocaleString(),
        description: 'New folder',
        tags: ['Folder'],
        starred: false
      }
      setContentItems(prev => [newFolder, ...prev])
      toast.success('Folder created successfully!')
    }
  }

  const bulkDelete = () => {
    if (selectedItems.length === 0) return
    
    setContentItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
    toast.success(`Deleted ${selectedItems.length} item(s)`)
  }

  const selectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Content Center</h1>
            <p className="text-muted-foreground">
              Manage and organize your AI-generated content
            </p>
          </div>
          
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload files'}
            </Button>
            <Button variant="outline" onClick={createFolder}>
              <Plus className="h-4 w-4 mr-2" />
              Create folder
            </Button>
          </div>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm"
            >
              <option value="all">All types</option>
              <option value="document">Documents</option>
              <option value="code">Code</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="folder">Folders</option>
            </select>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={bulkDelete}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="text-xs"
            >
              {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </Button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-input border border-border rounded-md text-sm"
            >
              <option value="modified">Last modified</option>
              <option value="created">Date created</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
            
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Grid/List */}
        {viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => {
              const Icon = fileTypeIcons[item.type]
              const color = fileTypeColors[item.type]
              const isSelected = selectedItems.includes(item.id)
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`model-card group cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedItems(prev => 
                      prev.includes(item.id) 
                        ? prev.filter(id => id !== item.id)
                        : [...prev, item.id]
                    )
                  }}
                >
                  {/* Thumbnail/Icon */}
                  <div className="relative mb-4">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div 
                        className="w-full h-32 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon 
                          className="w-12 h-12"
                          style={{ color }}
                        />
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(item.id)
                      }}
                      className={`absolute top-2 right-2 h-8 w-8 p-0 ${
                        item.starred ? 'text-yellow-400' : 'text-muted-foreground'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${item.starred ? 'fill-current' : ''}`} />
                    </Button>

                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.size}</span>
                      <span>{item.modifiedAt}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          // View functionality
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadItem(item)
                        }}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          shareItem(item)
                        }}
                      >
                        <Share className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            layout
            className="space-y-2"
          >
            {filteredItems.map((item, index) => {
              const Icon = fileTypeIcons[item.type]
              const color = fileTypeColors[item.type]
              const isSelected = selectedItems.includes(item.id)
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex items-center gap-4 p-4 rounded-lg glass-effect hover:border-primary/50 transition-all group cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedItems(prev => 
                      prev.includes(item.id) 
                        ? prev.filter(id => id !== item.id)
                        : [...prev, item.id]
                    )
                  }}
                >
                  <div className="flex items-center gap-3">
                    {isSelected && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon 
                        className="w-5 h-5"
                        style={{ color }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(item.id)
                        }}
                        className={`h-6 w-6 p-0 ${
                          item.starred ? 'text-yellow-400' : 'text-muted-foreground'
                        }`}
                      >
                        <Star className={`h-3 w-3 ${item.starred ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.size}</span>
                    <span>{item.modifiedAt}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        // View functionality
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadItem(item)
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        shareItem(item)
                      }}
                    >
                      <Share className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-xs text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteItem(item.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try different search terms' : 'Upload your first file to get started'}
            </p>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload files
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}