import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { DatabaseService, prisma } from './database'

// Types
export interface UserSession {
  id: string
  email: string
  username: string
  role: string
  name?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  name?: string
  bio?: string
}

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
const JWT_EXPIRES_IN = '7d'
const SESSION_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
const SALT_ROUNDS = 12

export class AuthService {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS)
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  // JWT token management
  static generateToken(payload: UserSession): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  static verifyToken(token: string): UserSession | null {
    try {
      return jwt.verify(token, JWT_SECRET) as UserSession
    } catch (error) {
      return null
    }
  }

  // Session management
  static generateSessionToken(): string {
    return randomBytes(32).toString('hex')
  }

  static getSessionExpiry(): Date {
    return new Date(Date.now() + SESSION_EXPIRES_IN)
  }

  // User registration
  static async registerUser(data: RegisterData) {
    // Check if user already exists
    const existingUser = await DatabaseService.findUserByEmail(data.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const existingUsername = await DatabaseService.findUserByUsername(data.username)
    if (existingUsername) {
      throw new Error('Username already taken')
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password)

    // Create user
    const user = await DatabaseService.createUser({
      ...data,
      password: hashedPassword
    })

    // Create session
    const sessionToken = this.generateSessionToken()
    const sessionExpiry = this.getSessionExpiry()

    await DatabaseService.createSession({
      userId: user.id,
      token: sessionToken,
      expiresAt: sessionExpiry
    })

    // Generate JWT token
    const jwtToken = this.generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      name: user.name || undefined
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role
      },
      sessionToken,
      jwtToken
    }
  }

  // User login
  static async loginUser(credentials: LoginCredentials) {
    // Find user by email
    const user = await DatabaseService.findUserByEmail(credentials.email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated')
    }

    // Verify password
    const isValidPassword = await this.comparePassword(credentials.password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    // Create session
    const sessionToken = this.generateSessionToken()
    const sessionExpiry = this.getSessionExpiry()

    await DatabaseService.createSession({
      userId: user.id,
      token: sessionToken,
      expiresAt: sessionExpiry
    })

    // Generate JWT token
    const jwtToken = this.generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      name: user.name || undefined
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role
      },
      sessionToken,
      jwtToken
    }
  }

  // User logout
  static async logoutUser(sessionToken: string) {
    await DatabaseService.deleteSession(sessionToken)
  }

  // Verify session
  static async verifySession(sessionToken: string): Promise<UserSession | null> {
    const session = await DatabaseService.findSessionByToken(sessionToken)
    
    if (!session) {
      return null
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      await DatabaseService.deleteSession(sessionToken)
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role,
      name: session.user.name || undefined
    }
  }

  // Password reset
  static async generatePasswordResetToken(email: string): Promise<string> {
    const user = await DatabaseService.findUserByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    })

    return token
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired reset token')
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword)

    // Update user password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword }
    })

    // Mark token as used
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true }
    })

    return true
  }

  // Middleware for protecting routes
  static async requireAuth(sessionToken: string): Promise<UserSession> {
    const user = await this.verifySession(sessionToken)
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  }

  static async requireRole(sessionToken: string, requiredRole: string): Promise<UserSession> {
    const user = await this.requireAuth(sessionToken)
    
    if (user.role !== requiredRole && user.role !== 'ADMIN') {
      throw new Error('Insufficient permissions')
    }
    
    return user
  }

  // Utility functions
  static async getUserById(userId: string) {
    const user = await DatabaseService.findUserById(userId)
    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      createdAt: user.createdAt
    }
  }

  static async updateUserProfile(userId: string, data: {
    name?: string
    bio?: string
    avatar?: string
  }) {
    return await prisma.user.update({
      where: { id: userId },
      data
    })
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await DatabaseService.findUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Verify current password
    const isValidPassword = await this.comparePassword(currentPassword, user.password)
    if (!isValidPassword) {
      throw new Error('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    return true
  }
}

// Export types
