import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Globe, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Clock,
  ExternalLink,
  Bookmark,
  Share,
  Filter,
  TrendingUp,
  Zap
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { createClient } from '@blinkdotnew/sdk'
import toast from 'react-hot-toast'

const blink = createClient({
  projectId: 'yetr-content-creation-models-obbf3aln',
  authRequired: true
})

interface SearchResult {
  id: string
  title: string
  snippet: string
  url: string
  type: 'web' | 'image' | 'video' | 'news'
  source: string
  timestamp?: string
  thumbnail?: string
}

const trendingSearches = [
  'AI content creation trends 2024',
  'Creative writing with AI',
  'Best practices for AI-generated art',
  'Future of artificial intelligence',
  'Machine learning in creative industries',
  'AI tools for content creators'
]

const recentSearches = [
  'How to use AI for storytelling',
  'Creative AI models comparison',
  'AI-generated music techniques',
  'Visual design with AI assistance'
]

export default function AISearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState('all')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    try {
      const searchResults = await blink.data.search(query, {
        type: searchType === 'all' ? undefined : searchType as any,
        limit: 20
      })

      // Transform search results to our format
      const transformedResults: SearchResult[] = []

      // Add organic results
      if (searchResults.organic_results) {
        transformedResults.push(...searchResults.organic_results.map((result: any, index: number) => ({
          id: `organic-${index}`,
          title: result.title,
          snippet: result.snippet || result.description || '',
          url: result.link,
          type: 'web' as const,
          source: new URL(result.link).hostname,
        })))
      }

      // Add news results
      if (searchResults.news_results) {
        transformedResults.push(...searchResults.news_results.map((result: any, index: number) => ({
          id: `news-${index}`,
          title: result.title,
          snippet: result.snippet || '',
          url: result.link,
          type: 'news' as const,
          source: result.source || new URL(result.link).hostname,
          timestamp: result.date,
        })))
      }

      // Add image results
      if (searchResults.image_results) {
        transformedResults.push(...searchResults.image_results.slice(0, 8).map((result: any, index: number) => ({
          id: `image-${index}`,
          title: result.title || 'Image result',
          snippet: result.source || '',
          url: result.original || result.link,
          type: 'image' as const,
          source: result.source || 'Image',
          thumbnail: result.thumbnail,
        })))
      }

      setResults(transformedResults)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleTrendingSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setTimeout(() => handleSearch(), 100)
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      case 'news': return FileText
      default: return Globe
    }
  }

  const filteredResults = searchType === 'all' 
    ? results 
    : results.filter(result => result.type === searchType)

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">AI Search</h1>
          <p className="text-muted-foreground">
            Search the web with AI-powered insights and real-time information
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search anything..."
              className="pl-12 pr-24 h-14 text-lg bg-input border-border focus:border-primary/50 transition-colors"
              disabled={isLoading}
            />
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>

        {!hasSearched ? (
          /* Initial State */
          <div className="space-y-8">
            {/* Trending Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-semibold">Trending Searches</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trendingSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTrendingSearch(search)}
                    className="p-4 text-left rounded-lg glass-effect hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-accent" />
                      </div>
                      <span className="text-sm group-hover:text-primary transition-colors">
                        {search}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Recent Searches</h2>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => handleTrendingSearch(search)}
                    className="flex items-center gap-3 p-3 w-full text-left rounded-lg hover:bg-muted/50 transition-all"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {/* Search Filters */}
            <Tabs value={searchType} onValueChange={setSearchType} className="mb-6">
              <TabsList className="grid w-full grid-cols-5 bg-muted/50">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="web">Web</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Results */}
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 rounded-lg glass-effect animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                    </div>
                  ))}
                </motion.div>
              ) : filteredResults.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {filteredResults.map((result, index) => {
                    const Icon = getResultIcon(result.type)
                    
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg glass-effect hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          {result.thumbnail ? (
                            <img
                              src={result.thumbnail}
                              alt={result.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                                {result.title}
                              </h3>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {result.type}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {result.snippet}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{result.source}</span>
                                {result.timestamp && (
                                  <>
                                    <span>•</span>
                                    <span>{result.timestamp}</span>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                >
                                  <Bookmark className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs"
                                >
                                  <Share className="h-3 w-3 mr-1" />
                                  Share
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="h-8 px-2 text-xs"
                                >
                                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    Visit
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try different keywords or search terms
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}