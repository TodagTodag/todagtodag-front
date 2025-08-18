"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  nickname: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (nickname: string, password: string) => void
  signup: (nickname: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("todak-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (nickname: string, password: string) => {
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem("todak-users") || "[]")
    const existingUser = users.find((u: any) => u.nickname === nickname && u.password === password)

    if (existingUser) {
      const userData = {
        id: existingUser.id,
        nickname: existingUser.nickname,
      }
      setUser(userData)
      localStorage.setItem("todak-user", JSON.stringify(userData))
    } else {
      throw new Error("닉네임 또는 비밀번호가 올바르지 않습니다.")
    }
  }

  const signup = (nickname: string, password: string) => {
    // Check if nickname already exists
    const users = JSON.parse(localStorage.getItem("todak-users") || "[]")
    const existingUser = users.find((u: any) => u.nickname === nickname)

    if (existingUser) {
      throw new Error("이미 사용 중인 닉네임입니다.")
    }

    const userData = {
      id: Date.now().toString(),
      nickname,
      password, // In a real app, this would be hashed
    }

    // Save to users list
    users.push(userData)
    localStorage.setItem("todak-users", JSON.stringify(users))

    // Set current user
    const currentUser = {
      id: userData.id,
      nickname: userData.nickname,
    }
    setUser(currentUser)
    localStorage.setItem("todak-user", JSON.stringify(currentUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("todak-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
