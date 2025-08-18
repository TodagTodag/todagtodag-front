"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Shield, MessageCircle } from "lucide-react"

const categories = [
  { name: "연애/결혼", count: 234, color: "bg-rose-100 text-rose-700" },
  { name: "직장/진로", count: 189, color: "bg-blue-100 text-blue-700" },
  { name: "가족/친구", count: 156, color: "bg-green-100 text-green-700" },
  { name: "학업/시험", count: 98, color: "bg-purple-100 text-purple-700" },
  { name: "건강/정신", count: 87, color: "bg-orange-100 text-orange-700" },
  { name: "기타", count: 76, color: "bg-gray-100 text-gray-700" },
]

export function Sidebar() {
  const router = useRouter()

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm border border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif font-bold text-lg flex items-center text-green-800">
            <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
            고민 카테고리
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="ghost"
              className="w-full justify-between p-2 h-auto hover:bg-green-50 text-green-700 transition-all duration-300 hover:scale-105 hover:shadow-md hover:translate-x-1"
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="font-sans text-sm">{category.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>{category.count}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-green-50/80 backdrop-blur-sm border border-green-300">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-sans font-semibold text-sm text-green-800 mb-1">안전한 익명 공간</h4>
              <p className="font-sans text-xs text-green-700 leading-relaxed">
                개인정보는 수집하지 않으며, 모든 대화는 익명으로 진행됩니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm border border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif font-bold text-lg flex items-center text-green-800">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            커뮤니티 통계
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-sans text-sm text-green-600">사용자 수</span>
            <span className="font-sans font-semibold text-green-800">2,847명</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-sans text-sm text-green-600">오늘 고민</span>
            <span className="font-sans font-semibold text-green-800">47개</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
