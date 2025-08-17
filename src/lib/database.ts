import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined
}

// Create a singleton Prisma client
export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Store the client in global scope to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

// Database utilities
export class DatabaseService {
  // User operations
  static async createUser(data: {
    email: string
    username: string
    password: string
    name?: string
    bio?: string
    avatar?: string
  }) {
    return await prisma.user.create({
      data: {
        ...data,
        role: 'USER'
      }
    })
  }

  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    })
  }

  static async findUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username }
    })
  }

  static async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id }
    })
  }

  // Post operations
  static async createPost(data: {
    title: string
    slug: string
    content: string
    excerpt?: string
    featuredImage?: string
    authorId: string
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  }) {
    return await prisma.post.create({
      data: {
        ...data,
        status: data.status || 'DRAFT'
      },
      include: {
        author: true,
        tags: {
          include: {
            tag: true
          }
        },
        categories: {
          include: {
            category: true
          }
        }
      }
    })
  }

  static async findPostBySlug(slug: string) {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        comments: {
          where: { isApproved: true },
          include: {
            author: true,
            replies: {
              include: {
                author: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        tags: {
          include: {
            tag: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    })
  }

  static async findPublishedPosts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    return await prisma.post.findMany({
      where: { 
        status: 'PUBLISHED',
        publishedAt: { not: null }
      },
      include: {
        author: true,
        tags: {
          include: {
            tag: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit
    })
  }

  // Comment operations
  static async createComment(data: {
    content: string
    authorId: string
    postId: string
    parentId?: string
  }) {
    return await prisma.comment.create({
      data,
      include: {
        author: true,
        post: true
      }
    })
  }

  static async approveComment(id: string) {
    return await prisma.comment.update({
      where: { id },
      data: { isApproved: true }
    })
  }

  // Session operations
  static async createSession(data: {
    userId: string
    token: string
    expiresAt: Date
    userAgent?: string
    ipAddress?: string
  }) {
    return await prisma.session.create({
      data
    })
  }

  static async findSessionByToken(token: string) {
    return await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })
  }

  static async deleteSession(token: string) {
    return await prisma.session.delete({
      where: { token }
    })
  }

  // Search operations
  static async searchPosts(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    
    return await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } }
        ],
        status: 'PUBLISHED'
      },
      include: {
        author: true,
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit
    })
  }

  // Analytics operations
  static async logPageView(data: {
    page: string
    referrer?: string
    userAgent?: string
    ipAddress?: string
    userId?: string
  }) {
    return await prisma.pageView.create({
      data
    })
  }

  // Settings operations
  static async getSetting(key: string) {
    const setting = await prisma.setting.findUnique({
      where: { key }
    })
    return setting?.value
  }

  static async setSetting(key: string, value: string, type: string = 'string') {
    return await prisma.setting.upsert({
      where: { key },
      update: { value, type },
      create: { key, value, type }
    })
  }

  // File operations
  static async createFile(data: {
    filename: string
    originalName: string
    mimeType: string
    size: number
    path: string
    url: string
    uploadedBy: string
  }) {
    return await prisma.file.create({
      data
    })
  }

  // Cleanup operations
  static async cleanupExpiredSessions() {
    return await prisma.session.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    })
  }

  static async cleanupExpiredResetTokens() {
    return await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    })
  }
}

// Export the prisma client for direct use
export { prisma as db }

// Extend DatabaseService with prisma property
;(DatabaseService as any).prisma = prisma
