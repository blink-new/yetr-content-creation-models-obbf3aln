import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Code, 
  Palette, 
  Music, 
  Video, 
  Image as ImageIcon, 
  Brain, 
  Zap,
  Star,
  Users,
  TrendingUp,
  Clock,
  Filter,
  Search,
  Play,
  MessageSquare,
  Download,
  Share,
  Bookmark
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import toast from 'react-hot-toast'

interface ModelGalleryProps {
  onSelectModel: (modelId: string) => void
  selectedModel: string
}

const aiModels = [
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Master of storytelling, poetry, and creative content. Brings imagination to life with vivid narratives and compelling characters.',
    icon: Sparkles,
    color: '#f59e0b',
    category: 'Writing',
    rating: 4.9,
    users: '12.5K',
    trending: true,
    capabilities: ['Creative Writing', 'Storytelling', 'Poetry', 'Fiction', 'Screenwriting'],
    specialties: ['Sci-fi narratives', 'Character development', 'World building', 'Dialogue writing'],
    lastUpdated: '2 days ago',
    examples: [
      'Write a short story about time travel',
      'Create a character backstory for a fantasy novel',
      'Compose a poem about artificial intelligence'
    ],
    performance: {
      speed: 85,
      creativity: 95,
      accuracy: 90
    }
  },
  {
    id: 'code-wizard',
    name: 'Code Wizard',
    description: 'Expert programmer with deep knowledge of multiple languages and frameworks. Your ultimate coding companion for any project.',
    icon: Code,
    color: '#10b981',
    category: 'Programming',
    rating: 4.8,
    users: '8.3K',
    trending: false,
    capabilities: ['Full-stack Development', 'Debugging', 'Code Review', 'Architecture'],
    specialties: ['React/TypeScript', 'Python/Django', 'System design', 'API development'],
    lastUpdated: '1 week ago',
    examples: [
      'Create a React component with TypeScript',
      'Debug this Python function',
      'Design a REST API architecture'
    ],
    performance: {
      speed: 90,
      creativity: 75,
      accuracy: 95
    }
  },
  {
    id: 'art-director',
    name: 'Art Director',
    description: 'Visual design expert specializing in branding, UI/UX, and creative direction for digital and print projects.',
    icon: Palette,
    color: '#f97316',
    category: 'Design',
    rating: 4.7,
    users: '6.1K',
    trending: true,
    capabilities: ['Visual Design', 'Branding', 'UI/UX', 'Creative Direction'],
    specialties: ['Brand identity', 'User interfaces', 'Design systems', 'Visual storytelling'],
    lastUpdated: '3 days ago',
    examples: [
      'Design a logo for a tech startup',
      'Create a color palette for a mobile app',
      'Plan a user interface layout'
    ],
    performance: {
      speed: 80,
      creativity: 95,
      accuracy: 85
    }
  },
  {
    id: 'music-composer',
    name: 'Music Composer',
    description: 'Creates original compositions, melodies, and musical arrangements across various genres and styles.',
    icon: Music,
    color: '#8b5cf6',
    category: 'Music',
    rating: 4.6,
    users: '4.2K',
    trending: false,
    capabilities: ['Composition', 'Arrangement', 'Music Theory', 'Sound Design'],
    specialties: ['Electronic music', 'Film scores', 'Pop arrangements', 'Classical composition'],
    lastUpdated: '5 days ago',
    examples: [
      'Compose a melody for a video game',
      'Create chord progressions for a pop song',
      'Write a film score theme'
    ],
    performance: {
      speed: 75,
      creativity: 90,
      accuracy: 80
    }
  },
  {
    id: 'video-editor',
    name: 'Video Editor',
    description: 'Professional video editing and post-production specialist for content creators and filmmakers.',
    icon: Video,
    color: '#ef4444',
    category: 'Video',
    rating: 4.5,
    users: '3.8K',
    trending: true,
    capabilities: ['Video Editing', 'Motion Graphics', 'Color Grading', 'Audio Sync'],
    specialties: ['YouTube content', 'Short films', 'Social media videos', 'Documentary editing'],
    lastUpdated: '1 day ago',
    examples: [
      'Plan a video editing workflow',
      'Create a storyboard for a commercial',
      'Design motion graphics concepts'
    ],
    performance: {
      speed: 85,
      creativity: 85,
      accuracy: 90
    }
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'AI-powered image creation and manipulation for artistic and commercial projects.',
    icon: ImageIcon,
    color: '#06b6d4',
    category: 'Visual',
    rating: 4.8,
    users: '15.7K',
    trending: true,
    capabilities: ['Image Generation', 'Style Transfer', 'Photo Editing', 'Concept Art'],
    specialties: ['Digital art', 'Product mockups', 'Character design', 'Landscape art'],
    lastUpdated: '6 hours ago',
    examples: [
      'Generate a futuristic cityscape',
      'Create character concept art',
      'Design a product mockup'
    ],
    performance: {
      speed: 70,
      creativity: 95,
      accuracy: 85
    }
  },
  {
    id: 'brain-storm',
    name: 'Brain Storm',
    description: 'Ideation and brainstorming specialist for creative problem-solving and innovation.',
    icon: Brain,
    color: '#ec4899',
    category: 'Strategy',
    rating: 4.7,
    users: '7.9K',
    trending: false,
    capabilities: ['Ideation', 'Problem Solving', 'Innovation', 'Strategic Thinking'],
    specialties: ['Business strategy', 'Product development', 'Marketing campaigns', 'Creative solutions'],
    lastUpdated: '4 days ago',
    examples: [
      'Brainstorm startup ideas',
      'Generate marketing campaign concepts',
      'Solve complex business problems'
    ],
    performance: {
      speed: 90,
      creativity: 95,
      accuracy: 85
    }
  },
  {
    id: 'lightning-fast',
    name: 'Lightning Fast',
    description: 'Quick response specialist for rapid content generation and instant creative solutions.',
    icon: Zap,
    color: '#eab308',
    category: 'General',
    rating: 4.4,
    users: '9.6K',
    trending: false,
    capabilities: ['Quick Responses', 'Rapid Prototyping', 'Instant Solutions', 'Fast Iteration'],
    specialties: ['Quick answers', 'Rapid brainstorming', 'Fast content', 'Instant feedback'],
    lastUpdated: '2 hours ago',
    examples: [
      'Quick answer to any question',
      'Rapid content generation',
      'Instant problem solving'
    ],
    performance: {
      speed: 95,
      creativity: 70,
      accuracy: 85
    }
  }
]

const categories = ['All', 'Writing', 'Programming', 'Design', 'Music', 'Video', 'Visual', 'Strategy', 'General']

export default function ModelGallery({ onSelectModel, selectedModel }: ModelGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('trending')
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid')
  const [bookmarkedModels, setBookmarkedModels] = useState<string[]>([])

  // Load bookmarked models from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarked-models')
    if (saved) {
      try {
        setBookmarkedModels(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading bookmarked models:', error)
      }
    }
  }, [])

  // Save bookmarked models to localStorage
  useEffect(() => {
    localStorage.setItem('bookmarked-models', JSON.stringify(bookmarkedModels))
  }, [bookmarkedModels])

  const filteredModels = aiModels
    .filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           model.capabilities.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           model.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'All' || model.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.rating - a.rating
        case 'rating':
          return b.rating - a.rating
        case 'users':
          return parseFloat(b.users.replace('K', '')) - parseFloat(a.users.replace('K', ''))
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const handleSelectModel = (modelId: string) => {
    onSelectModel(modelId)
    toast.success(`Selected ${aiModels.find(m => m.id === modelId)?.name}!`)
  }

  const toggleBookmark = (modelId: string) => {
    setBookmarkedModels(prev => {
      const isBookmarked = prev.includes(modelId)
      const newBookmarks = isBookmarked 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
      
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
      return newBookmarks
    })
  }

  const tryModel = (modelId: string, example: string) => {
    onSelectModel(modelId)
    // In a real app, this would also set the example as the initial prompt
    toast.success(`Trying ${aiModels.find(m => m.id === modelId)?.name} with example prompt!`)
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl font-bold gradient-text mb-2">AI Model Gallery</h1>
            <p className="text-muted-foreground">
              Discover and interact with our collection of specialized AI models
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models, capabilities, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-input border border-border rounded-md text-sm"
              >
                <option value="trending">Trending</option>
                <option value="rating">Rating</option>
                <option value="users">Users</option>
                <option value="updated">Recently Updated</option>
                <option value="name">Name</option>
              </select>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('detailed')}
              >
                Detailed
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-9 bg-muted/50">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Models Display */}
        {viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredModels.map((model, index) => {
              const Icon = model.icon
              const isSelected = selectedModel === model.id
              const isBookmarked = bookmarkedModels.includes(model.id)
              
              return (
                <motion.div
                  key={model.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`model-card relative group ${isSelected ? 'ring-2 ring-primary' : ''}`}
                >
                  {/* Trending Badge */}
                  {model.trending && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-accent text-accent-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(model.id)}
                    className={`absolute top-2 left-2 z-10 h-8 w-8 p-0 ${
                      isBookmarked ? 'text-yellow-400' : 'text-muted-foreground'
                    } opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>

                  {/* Model Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${model.color}20` }}
                    >
                      <Icon 
                        className="w-6 h-6"
                        style={{ color: model.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {model.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {model.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{model.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{model.users}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{model.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Performance Bars */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Speed</span>
                      <span>{model.performance.speed}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className="h-1 rounded-full bg-green-500"
                        style={{ width: `${model.performance.speed}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span>Creativity</span>
                      <span>{model.performance.creativity}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1">
                      <div 
                        className="h-1 rounded-full bg-purple-500"
                        style={{ width: `${model.performance.creativity}%` }}
                      />
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.slice(0, 3).map((capability) => (
                        <Badge key={capability} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                      {model.capabilities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{model.capabilities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      variant={isSelected ? "default" : "outline"}
                      style={isSelected ? { backgroundColor: model.color } : {}}
                      onClick={() => handleSelectModel(model.id)}
                    >
                      {isSelected ? 'Selected' : 'Select Model'}
                    </Button>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => tryModel(model.id, model.examples[0])}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Try
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs"
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
          /* Detailed View */
          <motion.div
            layout
            className="space-y-6"
          >
            {filteredModels.map((model, index) => {
              const Icon = model.icon
              const isSelected = selectedModel === model.id
              const isBookmarked = bookmarkedModels.includes(model.id)
              
              return (
                <motion.div
                  key={model.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`model-card ${isSelected ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex gap-6">
                    {/* Model Icon */}
                    <div 
                      className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${model.color}20` }}
                    >
                      <Icon 
                        className="w-10 h-10"
                        style={{ color: model.color }}
                      />
                    </div>

                    {/* Model Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{model.name}</h3>
                            <Badge variant="outline">{model.category}</Badge>
                            {model.trending && (
                              <Badge className="bg-accent text-accent-foreground">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{model.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBookmark(model.id)}
                            className={`h-8 w-8 p-0 ${
                              isBookmarked ? 'text-yellow-400' : 'text-muted-foreground'
                            }`}
                          >
                            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            style={isSelected ? { backgroundColor: model.color } : {}}
                            onClick={() => handleSelectModel(model.id)}
                          >
                            {isSelected ? 'Selected' : 'Select Model'}
                          </Button>
                        </div>
                      </div>

                      {/* Stats and Performance */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{model.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold">{model.users}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Users</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Zap className="h-4 w-4" />
                            <span className="font-semibold">{model.performance.speed}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Speed</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Sparkles className="h-4 w-4" />
                            <span className="font-semibold">{model.performance.creativity}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Creativity</p>
                        </div>
                      </div>

                      {/* Capabilities and Specialties */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Capabilities</h4>
                          <div className="flex flex-wrap gap-1">
                            {model.capabilities.map((capability) => (
                              <Badge key={capability} variant="secondary" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-1">
                            {model.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Example Prompts */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Try these examples</h4>
                        <div className="flex flex-wrap gap-2">
                          {model.examples.map((example, i) => (
                            <Button
                              key={i}
                              variant="ghost"
                              size="sm"
                              onClick={() => tryModel(model.id, example)}
                              className="text-xs h-8 px-3 border border-border hover:border-primary/50"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {example}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {filteredModels.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No models found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}