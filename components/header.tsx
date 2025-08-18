"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, User, LogOut } from "lucide-react"
import Image from "next/image"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/lib/auth"

export function Header() {
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, isLoggedIn, login, signup, logout } = useAuth()

  const handleLogoClick = () => {
    router.push("/")
  }

  const handleMyPosts = () => {
    router.push("/my-posts")
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-green-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              >
                <Image src="/todak-logo.png" alt="토닥토닥 로고" width={32} height={32} className="w-8 h-8" />
                <h1 className="font-serif font-black text-2xl text-green-600">토닥토닥</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="고민 키워드로 검색..."
                  className="w-full pl-10 pr-4 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-green-900 placeholder-green-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={handleMyPosts}
                  >
                    내 글
                  </Button>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-lg">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">{user?.nickname}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={logout}
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => setIsAuthModalOpen(true)}
                  data-auth-trigger
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={login} onSignup={signup} />
    </>
  )
}
