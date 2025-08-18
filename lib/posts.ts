export interface Post {
  id: number
  title: string
  content: string
  author: string
  authorId?: string
  timestamp: string
  likes: number
  comments: number
  category: string
  tags?: string[]
  isAnonymous: boolean
}

export interface Comment {
  id: number
  postId: number
  content: string
  author: string
  timestamp: string
  likes: number
  isAnonymous: boolean
}

// Mock data - 실제로는 API나 데이터베이스에서 가져올 데이터
const mockPosts: Post[] = [
  {
    id: 1,
    title: "직장 상사와의 관계가 너무 힘들어요",
    content: `입사한 지 6개월 정도 됐는데 상사가 저에게만 유독 까다롭게 대하는 것 같아요. 다른 동료들에게는 친근하게 대하는데 저에게만 차갑고 업무적으로만 대화하려고 해요.

처음에는 제가 실수를 많이 해서 그런가 싶었는데, 요즘은 작은 일에도 과도하게 지적하시고 다른 사람들 앞에서 저를 깎아내리는 말씀을 하세요. 

매일 출근하는 게 스트레스이고, 밤에 잠도 잘 안 와요. 이직을 생각해보기도 하지만 아직 경력이 짧아서 쉽지 않을 것 같고... 어떻게 해야 할까요?`,
    author: "익명",
    authorId: "user1",
    timestamp: "2시간 전",
    likes: 24,
    comments: 8,
    category: "직장/진로",
    tags: ["직장생활", "상사", "스트레스", "인간관계"],
    isAnonymous: true,
  },
  {
    id: 2,
    title: "연인과 결혼 문제로 고민이에요",
    content:
      "3년째 사귀고 있는 연인이 있는데 결혼 이야기만 나오면 계속 미루려고 해요. 저는 결혼하고 싶은데 상대방은 아직 준비가 안 됐다고... 기다려야 할까요 아니면 정리해야 할까요?",
    author: "익명",
    authorId: "user2",
    timestamp: "4시간 전",
    likes: 42,
    comments: 15,
    category: "연애/결혼",
    isAnonymous: true,
  },
  {
    id: 3,
    title: "부모님과의 갈등이 심해져요",
    content:
      "성인이 된 지 오래됐는데도 부모님이 제 모든 일에 간섭하려고 하세요. 특히 진로나 연애 문제에서... 독립하고 싶지만 경제적으로 어려운 상황이라 더 답답합니다.",
    author: "익명",
    authorId: "user3",
    timestamp: "6시간 전",
    likes: 18,
    comments: 6,
    category: "가족/친구",
    isAnonymous: true,
  },
  {
    id: 4,
    title: "취업 준비가 너무 막막해요",
    content:
      "졸업을 앞두고 있는데 취업이 정말 안 되네요. 이미 수십 군데 지원했는데 모두 떨어졌어요. 주변 친구들은 다 취업했는데 저만 뒤처지는 것 같아서 우울합니다...",
    author: "익명",
    authorId: "user4",
    timestamp: "8시간 전",
    likes: 31,
    comments: 12,
    category: "직장/진로",
    isAnonymous: true,
  },
]

const mockComments: Comment[] = [
  {
    id: 1,
    postId: 1,
    content: "저도 비슷한 경험이 있어요. 상사와의 일대일 면담을 요청해서 솔직하게 대화해보시는 건 어떨까요?",
    author: "익명",
    timestamp: "1시간 전",
    likes: 5,
    isAnonymous: true,
  },
  {
    id: 2,
    postId: 1,
    content: "힘드시겠어요... 혹시 HR팀이나 상급자에게 상담받아보셨나요? 문서로 기록해두시는 것도 좋을 것 같아요.",
    author: "익명",
    timestamp: "45분 전",
    likes: 8,
    isAnonymous: true,
  },
  {
    id: 3,
    postId: 1,
    content:
      "저는 그런 상황에서 이직했어요. 정신건강이 더 중요하다고 생각해서... 지금은 훨씬 좋은 환경에서 일하고 있습니다.",
    author: "익명",
    timestamp: "30분 전",
    likes: 3,
    isAnonymous: true,
  },
]

const POSTS_STORAGE_KEY = "todak_posts"
const COMMENTS_STORAGE_KEY = "todak_comments"

// 로컬 스토리지에서 데이터 로드
const loadPostsFromStorage = (): Post[] => {
  if (typeof window === "undefined") return mockPosts

  try {
    const stored = localStorage.getItem(POSTS_STORAGE_KEY)
    if (stored) {
      const parsedPosts = JSON.parse(stored)
      return parsedPosts.length > 0 ? parsedPosts : mockPosts
    }
  } catch (error) {
    console.error("게시글 로드 실패:", error)
  }
  return mockPosts
}

const loadCommentsFromStorage = (): Comment[] => {
  if (typeof window === "undefined") return mockComments

  try {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY)
    if (stored) {
      const parsedComments = JSON.parse(stored)
      return parsedComments.length > 0 ? parsedComments : mockComments
    }
  } catch (error) {
    console.error("댓글 로드 실패:", error)
  }
  return mockComments
}

// 로컬 스토리지에 데이터 저장
const savePostsToStorage = (posts: Post[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts))
  } catch (error) {
    console.error("게시글 저장 실패:", error)
  }
}

const saveCommentsToStorage = (comments: Comment[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments))
  } catch (error) {
    console.error("댓글 저장 실패:", error)
  }
}

let currentPosts = loadPostsFromStorage()
let currentComments = loadCommentsFromStorage()

// API 함수들 (실제로는 서버 API 호출)
export const getPosts = async (category?: string): Promise<Post[]> => {
  // 실제로는 API 호출
  await new Promise((resolve) => setTimeout(resolve, 100))

  currentPosts = loadPostsFromStorage()

  if (category) {
    return currentPosts.filter((post) => post.category === category)
  }
  return currentPosts
}

export const getPost = async (id: number): Promise<Post | null> => {
  // 실제로는 API 호출
  await new Promise((resolve) => setTimeout(resolve, 100))

  currentPosts = loadPostsFromStorage()
  return currentPosts.find((post) => post.id === id) || null
}

export const getComments = async (postId: number): Promise<Comment[]> => {
  // 실제로는 API 호출
  await new Promise((resolve) => setTimeout(resolve, 100))

  currentComments = loadCommentsFromStorage()
  return currentComments.filter((comment) => comment.postId === postId)
}

export const createPost = async (postData: {
  title: string
  content: string
  category: string
  tags: string[]
  authorId?: string
}): Promise<Post> => {
  // 실제로는 API 호출
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newPost: Post = {
    id: Date.now(), // 고유 ID 생성
    title: postData.title,
    content: postData.content,
    author: "익명",
    authorId: postData.authorId,
    timestamp: "방금 전",
    likes: 0,
    comments: 0,
    category: postData.category,
    tags: postData.tags,
    isAnonymous: true,
  }

  currentPosts = loadPostsFromStorage()
  currentPosts.unshift(newPost)
  savePostsToStorage(currentPosts)

  return newPost
}

export const createComment = async (commentData: {
  postId: number
  content: string
}): Promise<Comment> => {
  // 실제로는 API 호출
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newComment: Comment = {
    id: Date.now(), // 고유 ID 생성
    postId: commentData.postId,
    content: commentData.content,
    author: "익명",
    timestamp: "방금 전",
    likes: 0,
    isAnonymous: true,
  }

  currentComments = loadCommentsFromStorage()
  currentComments.push(newComment)
  saveCommentsToStorage(currentComments)

  currentPosts = loadPostsFromStorage()
  const postIndex = currentPosts.findIndex((post) => post.id === commentData.postId)
  if (postIndex !== -1) {
    currentPosts[postIndex].comments += 1
    savePostsToStorage(currentPosts)
  }

  return newComment
}

export const updatePost = async (
  id: number,
  postData: {
    title: string
    content: string
    category: string
    tags: string[]
  },
  authorId: string,
): Promise<Post | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  currentPosts = loadPostsFromStorage()
  const postIndex = currentPosts.findIndex((post) => post.id === id)

  if (postIndex === -1) return null

  const post = currentPosts[postIndex]

  // 작성자 확인
  if (post.authorId !== authorId) {
    throw new Error("수정 권한이 없습니다.")
  }

  // 게시글 업데이트
  currentPosts[postIndex] = {
    ...post,
    title: postData.title,
    content: postData.content,
    category: postData.category,
    tags: postData.tags,
  }

  savePostsToStorage(currentPosts)
  return currentPosts[postIndex]
}
