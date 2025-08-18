"use client"

import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { CreatePostButton } from "@/components/create-post-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, MessageCircle, Clock, User } from "lucide-react"

const getCategoryPosts = (category: string) => {
  const allPosts = [
    {
      id: 1,
      title: "직장에서 상사와의 갈등이 너무 힘들어요",
      content: "매일 출근하는 게 두려워요. 상사가 저에게만 유독 까다롭게 대하는 것 같아서...",
      category: "직장/진로",
      author: "익명",
      time: "2시간 전",
      replies: 12,
      hearts: 24,
      tags: ["직장갈등", "상사", "스트레스"],
    },
    {
      id: 2,
      title: "연인과 결혼 문제로 고민이에요",
      content: "3년째 사귀고 있는데 결혼에 대한 생각이 달라서 힘들어요...",
      category: "연애/결혼",
      author: "익명",
      time: "4시간 전",
      replies: 8,
      hearts: 15,
      tags: ["결혼", "연애", "미래"],
    },
    {
      id: 3,
      title: "부모님과의 관계가 너무 어려워요",
      content: "성인이 되었는데도 부모님이 제 모든 일에 간섭하셔서...",
      category: "가족/친구",
      author: "익명",
      time: "6시간 전",
      replies: 15,
      hearts: 32,
      tags: ["가족", "부모", "독립"],
    },
    {
      id: 4,
      title: "취업 준비가 너무 막막해요",
      content: "졸업을 앞두고 있는데 취업이 안 되어서 불안해요...",
      category: "직장/진로",
      author: "익명",
      time: "8시간 전",
      replies: 6,
      hearts: 18,
      tags: ["취업", "진로", "불안"],
    },
    {
      id: 5,
      title: "시험 스트레스로 잠을 못 자요",
      content: "중요한 시험을 앞두고 있는데 너무 긴장되어서...",
      category: "학업/시험",
      author: "익명",
      time: "10시간 전",
      replies: 4,
      hearts: 9,
      tags: ["시험", "스트레스", "불면"],
    },
  ]

  return allPosts.filter((post) => post.category === category)
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryName = decodeURIComponent(params.name as string)

  const filteredPosts = getCategoryPosts(categoryName)

  const handlePostClick = (postId: number) => {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`)
    if (postElement) {
      postElement.classList.add("animate-pulse", "scale-95")
      setTimeout(() => {
        router.push(`/post/${postId}`)
      }, 200)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 animate-fadeIn">
      <div className="animate-fadeIn">
        <Header />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-slideUp animation-delay-200">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mb-4 text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              전체 게시물로 돌아가기
            </Button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-serif font-black text-4xl md:text-5xl text-green-800 mb-4">{categoryName} 고민</h1>
                <p className="font-sans text-lg text-green-700 mb-6">
                  {categoryName} 관련 고민들을 모아봤어요 ({filteredPosts.length}개)
                </p>
              </div>
              <CreatePostButton />
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <Card
                  key={post.id}
                  data-post-id={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] active:scale-95 animate-slideInUp"
                  style={{ animationDelay: `${400 + index * 150}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center space-x-1 text-green-600">
                          <User className="w-3 h-3" />
                          <span className="text-xs">{post.author}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-green-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{post.time}</span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-green-900 mb-2 group-hover:text-green-700 transition-colors">
                      {post.title}
                    </h3>

                    <p className="font-sans text-green-700 text-sm mb-4 line-clamp-2">{post.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-green-600">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.hearts}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.replies}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm animate-slideInUp animation-delay-400">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-serif font-bold text-lg text-green-800 mb-2">
                    아직 {categoryName} 관련 고민이 없어요
                  </h3>
                  <p className="text-green-600 font-sans mb-4">첫 번째 고민을 공유해보세요!</p>
                  <CreatePostButton />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
