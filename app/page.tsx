import { Header } from "@/components/header"
import { PostList } from "@/components/post-list"
import { CreatePostButton } from "@/components/create-post-button"
import { Sidebar } from "@/components/sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100">
      <div className="animate-fade-in">
        <Header />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8 animate-slide-up-delay-1">
              <h1 className="font-serif font-black text-4xl md:text-5xl text-green-800 mb-4 transform transition-all duration-700 ease-out">
                마음을 토닥토닥
              </h1>
              <p className="font-sans text-lg text-green-700 mb-6 transform transition-all duration-700 ease-out delay-200">
                혼자 고민하지 마세요. 익명으로 주변에 말 못할 고민을 얘기해보세요.
              </p>
              <div className="transform transition-all duration-700 ease-out delay-300">
                <CreatePostButton />
              </div>
            </div>

            <div className="animate-slide-up-delay-2">
              <PostList />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:mt-[200px] animate-slide-in-right-delay-3">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
