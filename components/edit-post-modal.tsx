"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Shield, Save, X, Loader2 } from "lucide-react"
import type { Post } from "@/lib/posts"

interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (post: {
    title: string
    content: string
    category: string
    tags: string[]
  }) => void
  post: Post | null
  isSubmitting?: boolean
}

export function EditPostModal({ isOpen, onClose, onSubmit, post, isSubmitting = false }: EditPostModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const categories = ["연애/결혼", "가족/친구", "직장/진로", "학업/시험", "건강/정신", "기타"]

  useEffect(() => {
    if (post && isOpen) {
      setTitle(post.title)
      setContent(post.content)
      setCategory(post.category)
      setTags(post.tags || [])
      setTagInput("")
    }
  }, [post, isOpen])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    if (title.trim() && content.trim() && category && !isSubmitting) {
      onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        tags,
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setCategory("")
    setTags([])
    setTagInput("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-green-200">
        <DialogHeader className="border-b border-green-100 pb-4">
          <DialogTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
            <Edit className="w-6 h-6 text-green-600" />
            게시글 수정하기
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
            <Shield className="w-4 h-4" />
            <span>익명성은 그대로 유지됩니다</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 카테고리 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">카테고리</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="border-green-200 focus:border-green-400">
                <SelectValue placeholder="고민 카테고리를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 제목 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">제목</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="고민의 제목을 간단히 적어주세요"
              className="border-green-200 focus:border-green-400"
              maxLength={100}
            />
            <div className="text-xs text-gray-500 text-right">{title.length}/100</div>
          </div>

          {/* 내용 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">고민 내용</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="마음 편히 고민을 털어놓아 주세요. 여러분의 이야기를 들어드릴게요."
              className="min-h-[200px] border-green-200 focus:border-green-400 resize-none"
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 text-right">{content.length}/2000</div>
          </div>

          {/* 태그 입력 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">태그 (선택사항)</label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="태그를 입력하고 Enter를 눌러주세요"
                className="border-green-200 focus:border-green-400"
                maxLength={20}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                disabled={!tagInput.trim() || tags.length >= 5}
              >
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-xs text-gray-500">최대 5개까지 추가할 수 있습니다</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-green-100">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || !category || isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                수정 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                수정 완료
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
