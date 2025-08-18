"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Shield, ArrowLeft, Send, Lock, Edit } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { Header } from "@/components/header"
import { getPost, getComments, createComment, updatePost, type Post, type Comment } from "@/lib/posts"
import { EditPostModal } from "@/components/edit-post-modal"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const { isLoggedIn, user } = useAuth()

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const loadPostData = async () => {
      try {
        setLoading(true)
        const postId = Number.parseInt(params.id as string)

        const [postData, commentsData] = await Promise.all([getPost(postId), getComments(postId)])

        if (postData) {
          setPost(postData)
          setLikeCount(postData.likes)
          setComments(commentsData)
        } else {
          // 게시글이 없으면 홈으로 리다이렉트
          router.push("/")
        }
      } catch (error) {
        console.error("게시글 로딩 실패:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadPostData()
    }
  }, [params.id, router])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      setShowAuthPrompt(true)
      return
    }

    if (newComment.trim() && post) {
      setSubmittingComment(true)
      try {
        const newCommentData = await createComment({
          postId: post.id,
          content: newComment.trim(),
        })

        setComments((prev) => [...prev, newCommentData])
        setNewComment("")

        // 게시글의 댓글 수 업데이트
        setPost((prev) => (prev ? { ...prev, comments: prev.comments + 1 } : null))
      } catch (error) {
        console.error("댓글 작성 실패:", error)
      } finally {
        setSubmittingComment(false)
      }
    }
  }

  const handleLoginPrompt = () => {
    // 헤더의 프로필 버튼을 클릭한 것과 같은 효과
    const profileButton = document.querySelector("[data-auth-trigger]") as HTMLButtonElement
    if (profileButton) {
      profileButton.click()
    }
  }

  const handleEditPost = () => {
    setIsEditModalOpen(true)
  }

  const handleUpdatePost = async (postData: {
    title: string
    content: string
    category: string
    tags: string[]
  }) => {
    if (!post || !user) return

    setIsUpdating(true)
    try {
      const updatedPost = await updatePost(post.id, postData, user.id)
      if (updatedPost) {
        setPost(updatedPost)
        setIsEditModalOpen(false)
        // 성공 메시지 표시 (선택사항)
        console.log("게시글이 성공적으로 수정되었습니다.")
      }
    } catch (error) {
      console.error("게시글 수정 실패:", error)
      alert("게시글 수정에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsUpdating(false)
    }
  }

  const isAuthor = post && user && post.authorId === user.id

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-10 bg-green-200 rounded mb-6 w-40"></div>
            <Card className="mb-8 border border-green-200">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-green-200 rounded w-20"></div>
                    <div className="h-3 bg-green-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-8 bg-green-200 rounded mb-4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-green-200 rounded"></div>
                  <div className="h-4 bg-green-200 rounded w-3/4"></div>
                  <div className="h-4 bg-green-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 animate-fadeIn">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 뒤로가기 버튼 */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-green-600 hover:text-green-700 hover:bg-green-50 animate-slideUp"
          style={{ animationDelay: "0.1s" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </Button>

        {/* 게시물 상세 */}
        <Card
          className="mb-8 border border-green-200 shadow-xl bg-white/95 backdrop-blur-sm animate-slideUp"
          style={{ animationDelay: "0.2s" }}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12 bg-green-100 border border-green-300">
                  <AvatarFallback className="bg-green-100 text-green-700 border-0">
                    <Shield className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-sans font-medium text-green-800 flex items-center">
                    {post.author}
                    {/* {post.isAnonymous && <Shield className="w-4 h-4 ml-1 text-green-600" />} */}
                  </p>
                  <p className="font-sans text-sm text-green-600">{post.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className={`${categoryColors[post.category as keyof typeof categoryColors] || categoryColors["기타"]}`}
                >
                  {post.category}
                </Badge>
                {isAuthor && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditPost}
                    className="text-green-600 border-green-300 hover:bg-green-50 hover:border-green-400 bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                )}
              </div>
            </div>

            <h1 className="font-serif font-bold text-2xl text-green-900 mb-4">{post.title}</h1>

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            <div className="prose prose-green max-w-none mb-6">
              <p className="font-sans text-green-800 leading-relaxed whitespace-pre-line">{post.content}</p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-green-200">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`${
                    isLiked
                      ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      : "text-green-600 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  <span className="text-sm">{likeCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{comments.length}</span>
                </Button>
              </div>
              <div className="text-xs text-green-600 flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                익명 보장
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 댓글 작성 */}
        <Card
          className="mb-8 border border-green-200 shadow-lg bg-white/90 backdrop-blur-sm animate-slideUp"
          style={{ animationDelay: "0.3s" }}
        >
          <CardContent className="pt-6">
            {isLoggedIn ? (
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 bg-green-100 border border-green-300">
                  <AvatarFallback className="bg-green-100 text-green-700 border-0">
                    <Shield className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="따뜻한 위로와 조언을 남겨주세요..."
                    className="min-h-[100px] border-green-200 focus:border-green-400 resize-none mb-3"
                    maxLength={500}
                    disabled={submittingComment}
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">{newComment.length}/500</div>
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim() || submittingComment}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {submittingComment ? "작성 중..." : "댓글 작성"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">댓글을 작성하려면 로그인이 필요해요</h3>
                <p className="text-green-600 mb-4">따뜻한 위로와 조언을 나누기 위해 로그인해주세요</p>
                <Button onClick={handleLoginPrompt} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2">
                  로그인하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 댓글 목록 */}
        <div className="space-y-4 animate-slideUp" style={{ animationDelay: "0.4s" }}>
          <h2 className="font-serif font-bold text-xl text-green-900 mb-4">댓글 {comments.length}개</h2>
          <div className={!isLoggedIn ? "relative" : ""}>
            {!isLoggedIn && comments.length > 0 && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                <div className="text-center bg-white/90 p-8 rounded-xl shadow-lg border border-green-200">
                  <Lock className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">댓글을 보려면 로그인이 필요해요</h3>
                  <p className="text-green-600 mb-4">다른 사람들의 따뜻한 조언을 확인해보세요</p>
                  <Button onClick={handleLoginPrompt} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2">
                    로그인하기
                  </Button>
                </div>
              </div>
            )}

            <div className={!isLoggedIn && comments.length > 0 ? "filter blur-[0.5px] pointer-events-none" : ""}>
              {comments.map((comment, index) => (
                <Card
                  key={comment.id}
                  className="border border-green-200 shadow-md bg-white/80 backdrop-blur-sm mb-4 animate-slideUp"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 bg-green-100 border border-green-300">
                        <AvatarFallback className="bg-green-100 text-green-700 border-0">
                          <Shield className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-sans font-medium text-green-800 text-sm flex items-center">
                            {comment.author}
                            {/* {comment.isAnonymous && <Shield className="w-3 h-3 ml-1 text-green-600" />} */}
                          </p>
                          <p className="font-sans text-xs text-green-600">{comment.timestamp}</p>
                        </div>
                        <p className="font-sans text-green-700 text-sm leading-relaxed mb-3">{comment.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-rose-600 hover:bg-rose-50 p-0 h-auto"
                        >
                          <Heart className="w-3 h-3 mr-1" />
                          <span className="text-xs">{comment.likes}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdatePost}
        post={post}
        isSubmitting={isUpdating}
      />
    </div>
  )
}

const categoryColors = {
  "연애/결혼": "bg-rose-100 text-rose-700 border-rose-300",
  "직장/진로": "bg-blue-100 text-blue-700 border-blue-300",
  "가족/친구": "bg-green-100 text-green-700 border-green-300",
  "학업/시험": "bg-purple-100 text-purple-700 border-purple-300",
  "건강/정신": "bg-orange-100 text-orange-700 border-orange-300",
  기타: "bg-gray-100 text-gray-700 border-gray-300",
}
