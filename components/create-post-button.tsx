"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"
import { CreatePostModal } from "./create-post-modal"
import { CustomAlert } from "./custom-alert"
import { AuthModal } from "./auth-modal"
import { createPost } from "@/lib/posts"
import { useAuth } from "@/lib/auth"

export function CreatePostButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleButtonClick = () => {
    if (!user) {
      setShowAlert(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const handleAlertConfirm = () => {
    setShowAlert(false)
    setShowAuthModal(true)
  }

  const handlePostSubmit = async (post: {
    title: string
    content: string
    category: string
    tags: string[]
  }) => {
    setIsSubmitting(true)
    try {
      const newPost = await createPost({
        ...post,
        authorId: user?.id,
      })
      console.log("새 고민 게시물 생성됨:", newPost)

      window.dispatchEvent(new CustomEvent("postCreated"))

      router.push(`/post/${newPost.id}`)
    } catch (error) {
      console.error("게시물 생성 실패:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleButtonClick}
        size="lg"
        className="bg-green-600 hover:bg-green-700 text-white font-sans font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <MessageSquarePlus className="w-5 h-5 mr-2" />
        익명으로 고민 털어놓기
      </Button>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostSubmit}
        isSubmitting={isSubmitting}
      />

      <CustomAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={handleAlertConfirm}
        title="로그인이 필요해요"
        message="고민을 나누려면 먼저 로그인해주세요. 토닥토닥에서 안전하게 마음을 털어놓아보세요!"
        type="info"
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
