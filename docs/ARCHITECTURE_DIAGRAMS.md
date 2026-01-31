# Kyle and Kenny - Architecture Diagrams

## Table of Contents
1. [High-Level System Overview](#1-high-level-system-overview)
2. [Mid-Level Component Architecture](#2-mid-level-component-architecture)
3. [Low-Level Flow Diagrams](#3-low-level-flow-diagrams)
4. [Data Lineage](#4-data-lineage)
5. [Class/Component Structure](#5-classcomponent-structure)
6. [Sequence Diagrams](#6-sequence-diagrams)

---

## 1. High-Level System Overview

### 1.1 Complete System Architecture

```mermaid
graph TD
    subgraph "Client Layer"
        BROWSER[Web Browser]
        MOBILE[Mobile Browser]
    end

    subgraph "CDN/Edge"
        VERCEL[Vercel Edge Network]
        STATIC[Static Assets]
    end

    subgraph "Astro Application"
        SSG[Static Site Generation]
        SSR[Server-Side Rendering]
        ISLANDS[Astro Islands]
    end

    subgraph "Content Layer"
        MDX[MDX Content]
        ASSETS[Image Assets]
        CONFIG[Site Config]
    end

    subgraph "Backend Services"
        PRISMA[Prisma ORM]
        AUTH[Authentication]
        SUPABASE[Supabase]
    end

    subgraph "Database"
        DB[(PostgreSQL)]
    end

    BROWSER --> VERCEL
    MOBILE --> VERCEL
    VERCEL --> STATIC
    VERCEL --> SSR
    
    SSG --> MDX
    SSG --> ASSETS
    SSG --> CONFIG
    
    SSR --> ISLANDS
    ISLANDS --> AUTH
    AUTH --> PRISMA
    PRISMA --> DB
    SUPABASE --> DB

    classDef client fill:#e1f5fe
    classDef edge fill:#fff3e0
    classDef app fill:#e8f5e9
    classDef content fill:#fce4ec
    classDef backend fill:#f3e5f5
    classDef database fill:#fff9c4
    
    class BROWSER,MOBILE client
    class VERCEL,STATIC edge
    class SSG,SSR,ISLANDS app
    class MDX,ASSETS,CONFIG content
    class PRISMA,AUTH,SUPABASE backend
    class DB database
```

### 1.2 Simplified Architecture

```mermaid
graph LR
    USER[User] --> CDN[Vercel CDN]
    CDN --> ASTRO[Astro App]
    ASTRO --> CONTENT[Content/MDX]
    ASTRO --> API[API Routes]
    API --> DB[(Database)]
```

---

## 2. Mid-Level Component Architecture

### 2.1 Page Structure

```mermaid
flowchart TB
    subgraph "Pages"
        INDEX[/ - Home]
        BLOG[/blog - Blog List]
        POST[/blog/:slug - Post]
        ABOUT[/about - About]
        PROJECTS[/projects - Projects]
        TAGS[/tags - Tags]
    end

    subgraph "Layouts"
        BASE[BaseLayout]
        POST_LAYOUT[PostLayout]
        PAGE_LAYOUT[PageLayout]
    end

    subgraph "Components"
        HEADER[Header]
        FOOTER[Footer]
        NAV[Navigation]
        CARD[PostCard]
        TOC[TableOfContents]
        COMMENTS[Comments]
    end

    INDEX --> BASE
    BLOG --> BASE
    POST --> POST_LAYOUT
    ABOUT --> PAGE_LAYOUT
    PROJECTS --> PAGE_LAYOUT
    TAGS --> BASE

    BASE --> HEADER
    BASE --> FOOTER
    BASE --> NAV

    POST_LAYOUT --> TOC
    POST_LAYOUT --> COMMENTS
    POST_LAYOUT --> CARD
```

### 2.2 Content Structure

```mermaid
flowchart TB
    subgraph "Content Collections"
        POSTS[blog/]
        PROJECTS_C[projects/]
        PAGES[pages/]
    end

    subgraph "Content Schema"
        TITLE[title: string]
        DATE[date: Date]
        TAGS_S[tags: string[]]
        DRAFT[draft: boolean]
        IMAGE[image: ImageMetadata]
        DESC[description: string]
    end

    subgraph "Output"
        HTML[HTML Pages]
        RSS[RSS Feed]
        SITEMAP[Sitemap]
        OG[OG Images]
    end

    POSTS --> TITLE
    POSTS --> DATE
    POSTS --> TAGS_S
    POSTS --> DRAFT
    POSTS --> IMAGE
    POSTS --> DESC

    POSTS --> HTML
    POSTS --> RSS
    HTML --> SITEMAP
    HTML --> OG
```

### 2.3 Component Architecture

```mermaid
flowchart TB
    subgraph "UI Components"
        direction TB
        
        subgraph "Navigation"
            HEADER[Header.astro]
            NAV[Navigation.astro]
            SIDEBAR[Sidebar.astro]
            THEME[ThemeToggle.astro]
        end

        subgraph "Content"
            CARD[PostCard.astro]
            LIST[PostList.astro]
            TOC[TOC.astro]
            PROSE[Prose.astro]
        end

        subgraph "Interactive"
            SEARCH[Search.tsx]
            COMMENTS[Comments.tsx]
            SHARE[ShareButtons.tsx]
        end

        subgraph "Layout"
            BASE[BaseLayout.astro]
            POST_L[PostLayout.astro]
            PROJECT_L[ProjectLayout.astro]
        end
    end
```

---

## 3. Low-Level Flow Diagrams

### 3.1 Page Request Flow

```mermaid
flowchart TD
    REQ[HTTP Request] --> CDN{Vercel CDN}
    
    CDN -->|Cached| CACHE[Return Cached HTML]
    CDN -->|Not Cached| EDGE[Edge Function]
    
    EDGE --> ROUTE{Route Type}
    
    ROUTE -->|Static| STATIC[Pre-built HTML]
    ROUTE -->|SSR| SSR_RENDER[Server Render]
    ROUTE -->|API| API_ROUTE[API Handler]
    
    STATIC --> HYDRATE[Hydrate Islands]
    SSR_RENDER --> HYDRATE
    
    HYDRATE --> RESPONSE[HTML Response]
    API_ROUTE --> JSON[JSON Response]
    CACHE --> RESPONSE
    
    RESPONSE --> CLIENT[Client Browser]
    JSON --> CLIENT
```

### 3.2 Blog Post Rendering Flow

```mermaid
flowchart TD
    SLUG[/blog/:slug] --> LOAD[Load MDX Content]
    LOAD --> PARSE[Parse Frontmatter]
    PARSE --> VALIDATE[Validate Schema]
    
    VALIDATE --> META[Extract Metadata]
    VALIDATE --> BODY[Process MDX Body]
    
    META --> TITLE[title]
    META --> DATE[date]
    META --> TAGS[tags]
    META --> IMAGE[featured image]
    
    BODY --> REMARK[Remark Plugins]
    REMARK --> REHYPE[Rehype Plugins]
    REHYPE --> KATEX[KaTeX Math]
    REHYPE --> SYNTAX[Syntax Highlighting]
    
    SYNTAX --> HTML[HTML Content]
    
    META --> LAYOUT[PostLayout]
    HTML --> LAYOUT
    
    LAYOUT --> TOC[Generate TOC]
    LAYOUT --> OG[Generate OG Image]
    LAYOUT --> RENDER[Render Page]
```

### 3.3 Authentication Flow

```mermaid
flowchart TD
    USER[User] --> LOGIN[Login Page]
    LOGIN --> CREDS[Enter Credentials]
    CREDS --> VALIDATE[Validate Input]
    
    VALIDATE --> HASH[Hash Password]
    HASH --> DB_CHECK[Check Database]
    
    DB_CHECK --> PRISMA[Prisma Query]
    PRISMA --> USER_REC{User Found?}
    
    USER_REC -->|Yes| VERIFY[Verify Password]
    USER_REC -->|No| ERROR[Return Error]
    
    VERIFY -->|Match| SESSION[Create Session]
    VERIFY -->|No Match| ERROR
    
    SESSION --> JWT[Generate JWT]
    JWT --> COOKIE[Set Cookie]
    COOKIE --> REDIRECT[Redirect Dashboard]
    
    ERROR --> LOGIN
```

---

## 4. Data Lineage

### 4.1 Content Data Lineage

```mermaid
flowchart TB
    subgraph "Source"
        MDX_FILE[*.mdx files]
    end

    subgraph "Parsing"
        FRONTMATTER[Frontmatter YAML]
        CONTENT_BODY[MDX Body]
    end

    subgraph "Processing"
        SCHEMA[Zod Schema Validation]
        TRANSFORM[Content Transform]
        PLUGINS[Remark/Rehype Plugins]
    end

    subgraph "Build Output"
        COLLECTION[Content Collection]
        PAGES[Static Pages]
        ASSETS_OUT[Optimized Assets]
    end

    subgraph "Runtime"
        HTML_PAGE[HTML Document]
        HYDRATED[Hydrated Components]
    end

    MDX_FILE --> FRONTMATTER
    MDX_FILE --> CONTENT_BODY
    
    FRONTMATTER --> SCHEMA
    CONTENT_BODY --> PLUGINS
    
    SCHEMA --> TRANSFORM
    PLUGINS --> TRANSFORM
    
    TRANSFORM --> COLLECTION
    COLLECTION --> PAGES
    COLLECTION --> ASSETS_OUT
    
    PAGES --> HTML_PAGE
    HTML_PAGE --> HYDRATED
```

### 4.2 User Data Lineage

```mermaid
flowchart TB
    subgraph "Input"
        FORM[Login/Register Form]
    end

    subgraph "Validation"
        ZOD[Zod Validation]
        SANITIZE[Input Sanitization]
    end

    subgraph "Processing"
        BCRYPT[Password Hashing]
        JWT_CREATE[JWT Generation]
    end

    subgraph "Storage"
        PRISMA_WRITE[Prisma Write]
        DB[(PostgreSQL)]
    end

    subgraph "Session"
        COOKIE[HTTP Cookie]
        SESSION_STORE[Session Storage]
    end

    FORM --> ZOD
    ZOD --> SANITIZE
    SANITIZE --> BCRYPT
    BCRYPT --> PRISMA_WRITE
    PRISMA_WRITE --> DB
    
    BCRYPT --> JWT_CREATE
    JWT_CREATE --> COOKIE
    DB --> SESSION_STORE
```

---

## 5. Class/Component Structure

### 5.1 Component Hierarchy

```mermaid
classDiagram
    class BaseLayout {
        +Props props
        +slot default
        +slot head
        +render() HTML
    }

    class PostLayout {
        +Post post
        +slot default
        +render() HTML
    }

    class PageLayout {
        +Page page
        +slot default
        +render() HTML
    }

    class Header {
        +boolean showNav
        +render() HTML
    }

    class Footer {
        +Links[] links
        +render() HTML
    }

    class PostCard {
        +Post post
        +boolean featured
        +render() HTML
    }

    class TOC {
        +Heading[] headings
        +render() HTML
    }

    BaseLayout <|-- PostLayout
    BaseLayout <|-- PageLayout
    BaseLayout *-- Header
    BaseLayout *-- Footer
    PostLayout *-- TOC
    PostLayout *-- PostCard
```

### 5.2 Database Schema

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String username
        +String password
        +String name
        +String bio
        +String avatar
        +Role role
        +DateTime createdAt
    }

    class Post {
        +String id
        +String title
        +String slug
        +String content
        +String excerpt
        +String featuredImage
        +Status status
        +DateTime publishedAt
        +String authorId
    }

    class Comment {
        +String id
        +String content
        +Boolean isApproved
        +String authorId
        +String postId
        +String parentId
    }

    class Tag {
        +String id
        +String name
        +String slug
    }

    class Session {
        +String id
        +String token
        +DateTime expiresAt
        +String userId
    }

    User "1" --> "*" Post : author
    User "1" --> "*" Comment : author
    User "1" --> "*" Session : sessions
    Post "1" --> "*" Comment : comments
    Post "*" --> "*" Tag : tags
    Comment "1" --> "*" Comment : replies
```

### 5.3 Service Classes

```mermaid
classDiagram
    class DatabaseService {
        +prisma PrismaClient
        +createUser(data) User
        +findUserByEmail(email) User
        +findUserById(id) User
        +createPost(data) Post
        +findPostBySlug(slug) Post
        +findPublishedPosts(page, limit) Post[]
        +createComment(data) Comment
        +approveComment(id) Comment
        +searchPosts(query) Post[]
    }

    class AuthService {
        +hashPassword(password) string
        +verifyPassword(password, hash) boolean
        +createToken(user) string
        +verifyToken(token) User
    }

    class SessionService {
        +createSession(userId, token) Session
        +findSession(token) Session
        +deleteSession(token) void
        +cleanupExpired() void
    }

    DatabaseService --> AuthService
    DatabaseService --> SessionService
```

---

## 6. Sequence Diagrams

### 6.1 Page Load Sequence

```mermaid
sequenceDiagram
    participant B as Browser
    participant V as Vercel Edge
    participant A as Astro
    participant C as Content
    participant DB as Database

    B->>V: GET /blog/my-post
    V->>V: Check cache
    
    alt Cache Hit
        V-->>B: Cached HTML
    else Cache Miss
        V->>A: Forward request
        A->>C: Load MDX content
        C-->>A: Frontmatter + Body
        A->>A: Process MDX
        A->>A: Render layout
        A->>DB: Fetch comments (if needed)
        DB-->>A: Comments data
        A-->>V: HTML response
        V->>V: Cache response
        V-->>B: HTML + hydration scripts
    end
    
    B->>B: Hydrate islands
```

### 6.2 Comment Submission Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant C as Comments Component
    participant API as API Route
    participant P as Prisma
    participant DB as PostgreSQL

    U->>C: Submit comment
    C->>C: Validate input
    C->>API: POST /api/comments
    API->>API: Verify session
    API->>P: createComment(data)
    P->>DB: INSERT comment
    DB-->>P: Comment record
    P-->>API: Comment object
    API-->>C: Success response
    C->>C: Update UI
    C-->>U: Show confirmation
```

### 6.3 Search Flow Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant S as Search Component
    participant API as API Route
    participant P as Prisma
    participant DB as PostgreSQL

    U->>S: Type search query
    S->>S: Debounce input
    S->>API: GET /api/search?q=query
    API->>P: searchPosts(query)
    P->>DB: SELECT posts WHERE title ILIKE %query%
    DB-->>P: Matching posts
    P-->>API: Post[] results
    API-->>S: JSON response
    S->>S: Render results
    S-->>U: Display matches
```

### 6.4 Build Process Sequence

```mermaid
sequenceDiagram
    participant CLI as astro build
    participant C as Content Loader
    participant P as Plugins
    participant R as Renderer
    participant O as Output

    CLI->>C: Load content collections
    C->>C: Scan content directories
    C->>C: Parse MDX files
    C-->>CLI: Content collection

    CLI->>P: Process content
    P->>P: Remark plugins
    P->>P: Rehype plugins
    P->>P: Image optimization
    P-->>CLI: Processed content

    CLI->>R: Render pages
    R->>R: Generate static pages
    R->>R: Generate SSR routes
    R->>R: Bundle islands
    R-->>CLI: Rendered output

    CLI->>O: Write to dist/
    O->>O: Write HTML files
    O->>O: Write static assets
    O->>O: Generate sitemap
    O->>O: Generate RSS
    O-->>CLI: Build complete
```

---

## 7. Unified System Map

```mermaid
graph TB
    subgraph "Kyle & Kenny Platform"
        subgraph "Delivery"
            CDN[Vercel CDN]
            EDGE[Edge Functions]
        end

        subgraph "Application"
            ASTRO[Astro SSG/SSR]
            ISLANDS[Interactive Islands]
        end

        subgraph "Content"
            MDX[MDX Posts]
            ASSETS[Media Assets]
        end

        subgraph "Backend"
            API[API Routes]
            AUTH[Auth Service]
            PRISMA[Prisma ORM]
        end

        subgraph "Data"
            DB[(PostgreSQL)]
            SUPABASE[Supabase]
        end
    end

    CDN --> EDGE
    EDGE --> ASTRO
    ASTRO --> ISLANDS
    ASTRO --> MDX
    ASTRO --> ASSETS
    
    ISLANDS --> API
    API --> AUTH
    API --> PRISMA
    PRISMA --> DB
    SUPABASE --> DB

    classDef delivery fill:#e1f5fe
    classDef app fill:#c8e6c9
    classDef content fill:#fff3e0
    classDef backend fill:#fce4ec
    classDef data fill:#f3e5f5

    class CDN,EDGE delivery
    class ASTRO,ISLANDS app
    class MDX,ASSETS content
    class API,AUTH,PRISMA backend
    class DB,SUPABASE data
```

---

## Usage

View these diagrams in:
- GitHub/GitLab markdown preview
- VS Code with Mermaid extension
- [Mermaid Live Editor](https://mermaid.live/)
