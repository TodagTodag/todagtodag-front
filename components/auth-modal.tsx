"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Lock, User, Heart } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (nickname: string, password: string) => void
  onSignup: (nickname: string, password: string) => void
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLoginMode) {
        await onLogin(nickname, password)
      } else {
        await onSignup(nickname, password)
      }
      onClose()
      setPassword("")
      setNickname("")
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">토닥토닥에 오신 걸 환영해요!</h2>
              <p className="text-green-100 text-sm">함께 고민을 나눠봐요</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-green-700 font-medium">
                닉네임
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                <Input
                  id="nickname"
                  type="text"
                  placeholder={isLoginMode ? "닉네임을 입력해주세요" : "익명으로 사용할 닉네임"}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-700 font-medium">
                비밀번호
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "처리 중..." : isLoginMode ? "로그인" : "회원가입"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-green-600 text-sm">
              {isLoginMode ? "아직 계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            </p>
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-green-700 font-medium hover:text-green-800 transition-colors mt-1"
            >
              {isLoginMode ? "회원가입하기" : "로그인하기"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
