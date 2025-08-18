"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MessageCircle, Heart, Eye, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface MyPost {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  views: number
  likes: number
  comments: number
}

export default function MyPostsPage() {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const [myPosts, setMyPosts] = useState<MyPost[]>([])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    // Mock data for user's posts
    const mockMyPosts: MyPost[] = [
      {
        id: "1",
        title: "직장에서의 인간관계가 너무 힘들어요",
        content: "상사와의 관계가 좋지 않아서 매일 출근하는 것이 스트레스입니다...",
        category: "직장/진로",
        createdAt: "2024-01-15",
        views: 127,
        likes: 23,
        comments: 8,
      },
      {
        id: "2",
        title: "진로 선택에 대한 고민",
        content: "현재 하고 있는 일이 정말 내가 원하는 일인지 확신이 서지 않습니다...",
        category: "직장/진로",
        createdAt: "2024-01-12",
        views: 89,
        likes: 15,
        comments: 12,
      },
      {
        id: "3",
        title: "가족과의 갈등으로 힘들어요",
        content: "부모님과의 의견 차이로 인해 자주 다투게 되는데...",
        category: "가족/친구",
        createdAt: "2024-01-10",
        views: 156,
        likes: 31,
        comments: 19,
      },
    ]

    setMyPosts(mockMyPosts)
  }, [isLoggedIn, router])

  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`)
  }

  const handleDeletePost = (postId: string) => {
    setMyPosts(myPosts.filter((post) => post.id !== postId))
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-black text-green-800">내가 쓴 글</h1>
              <p className="text-green-600 mt-1">{user?.nickname}님이 작성한 고민들</p>
            </div>
          </div>

          {myPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">아직 작성한 글이 없어요</h3>
              <p className="text-green-600 mb-6">첫 번째 고민을 털어놓아 보세요</p>
              <Button onClick={() => router.push("/")} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                고민 작성하러 가기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border border-green-100 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => handlePostClick(post.id)}>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                        <div className="flex items-center text-green-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.createdAt}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-green-800 mb-2 group-hover:text-green-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-green-600 text-sm mb-4 line-clamp-2">{post.content}</p>

                      <div className="flex items-center space-x-4 text-green-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePost(post.id)
                      }}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
