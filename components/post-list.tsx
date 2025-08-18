"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Shield } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { getPosts, type Post } from "@/lib/posts"

const categoryColors = {
  "연애/결혼": "bg-rose-100 text-rose-700 border-rose-300",
  "직장/진로": "bg-blue-100 text-blue-700 border-blue-300",
  "가족/친구": "bg-green-100 text-green-700 border-green-300",
  "학업/시험": "bg-purple-100 text-purple-700 border-purple-300",
  "건강/정신": "bg-orange-100 text-orange-700 border-orange-300",
  기타: "bg-gray-100 text-gray-700 border-gray-300",
}

interface PostListProps {
  category?: string
}

export function PostList({ category }: PostListProps = {}) {
  const router = useRouter()
  const [clickedPostId, setClickedPostId] = useState<number | null>(null)
  const [visiblePosts, setVisiblePosts] = useState<number[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await getPosts(category)
      setPosts(fetchedPosts)
      setVisiblePosts([]) // 애니메이션 리셋

      // 순차 애니메이션 적용
      fetchedPosts.forEach((_, index) => {
        setTimeout(() => {
          setVisiblePosts((prev) => [...prev, index])
        }, index * 150)
      })
    } catch (error) {
      console.error("게시글 로딩 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [category])

  useEffect(() => {
    const handlePostCreated = () => {
      loadPosts()
    }

    window.addEventListener("postCreated", handlePostCreated)
    return () => {
      window.removeEventListener("postCreated", handlePostCreated)
    }
  }, [category])

  const handlePostClick = (postId: number) => {
    setClickedPostId(postId)

    setTimeout(() => {
      router.push(`/post/${postId}`)
    }, 200)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-green-200 shadow-lg bg-white/90 backdrop-blur-sm animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-green-200 rounded w-20"></div>
                  <div className="h-3 bg-green-200 rounded w-16"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-green-200 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-green-200 rounded"></div>
                <div className="h-4 bg-green-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Card
          key={post.id}
          className={`hover:shadow-xl transition-all duration-200 border border-green-200 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white/95 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${
            clickedPostId === post.id ? "animate-pulse scale-[0.98]" : ""
          } ${visiblePosts.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{
            animationDelay: visiblePosts.includes(index) ? "0ms" : `${index * 150}ms`,
            transition: "all 0.6s ease-out",
          }}
          onClick={() => handlePostClick(post.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 bg-green-100 border border-green-300">
                  <AvatarFallback className="bg-green-100 text-green-700 border-0">
                    <Shield className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-sans font-medium text-green-800 flex items-center">
                    {post.author}
                    <Shield className="w-3 h-3 ml-1 text-green-600" />
                  </p>
                  <p className="font-sans text-sm text-green-600">{post.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full border ${categoryColors[post.category as keyof typeof categoryColors] || categoryColors["기타"]}`}
                >
                  {post.category}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <h2 className="font-serif font-bold text-xl text-green-900 mb-3 hover:text-green-600 transition-colors">
              {post.title}
            </h2>
            <p className="font-sans text-green-700 mb-4 line-clamp-3 leading-relaxed">{post.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-green-200">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-rose-600 hover:bg-rose-50"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.comments}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
