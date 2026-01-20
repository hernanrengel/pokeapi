# Pokemon API Application

A full-stack application to explore and manage your favorite Pokemon, built with React, TypeScript, Express, and MySQL.

## 🚀 Features

### Frontend
- **Pokemon List**: Browse all available Pokemon from PokeAPI with pagination
- **Search**: Find Pokemon by name, abilities and types
- **Details**: View detailed information for each Pokemon including types, stats, and sprites
- **Favorites System**: Save your favorite Pokemon (authentication required)
- **User Authentication**: Register and login with JWT
- **Interface**: Responsive design with Material-UI
- **Unit Tests**: Test coverage with Vitest and React Testing Library

### Backend
- **RESTful API**: Endpoints for Pokemon and favorites
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **JWT Authentication**: Secure user authentication system
- **Database**: Persistence with MySQL and Prisma ORM
- **PokeAPI Proxy**: Caching and optimization of external API queries
- **Validation**: Data validation with custom middleware

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool
- **Material-UI (MUI)** - UI Components
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Formik + Yup** - Form management and validation
- **Vitest** - Testing framework

### Backend
- **Node.js** with TypeScript
- **Express 5** - Web framework
- **Prisma** - ORM
- **MySQL 8** - Database
- **JWT** - Authentication
- **bcryptjs** - Password encryption
- **Swagger** - API documentation
- **Jest** - Testing framework

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pokeapi
   ```

2. **Start all services**
   ```bash
   docker compose up --build
   ```

   This will start:
   - **Frontend**: http://localhost:3000
   - **Backend**: http://localhost:4000
   - **API Documentation**: http://localhost:4000/api-docs
   - **MySQL**: Port 3306
   - **phpMyAdmin**: http://localhost:8080

3. **Run Prisma migrations** (first time only)
   ```bash
   docker compose exec backend npx prisma migrate dev
   ```

## 🔧 Local Development (without Docker)

### Backend

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**
   
   Create `.env` file:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/pokeapi"
   PORT=4000
   JWT_SECRET="your-secret-key"
   ```

3. **Run migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Api Documentation**
   ```bash
   http://localhost:4000/api-docs
   ```

### Frontend

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables** (optional)
   
   Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test                 # Run tests in watch mode
npm run test:coverage   # View test coverage
```

### Backend Tests
```bash
cd backend
npm test
```

## 📁 Project Structure

```
pokeapi/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context (Auth, Favorites)
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API services
│   │   ├── theme/           # Material-UI configuration
│   │   └── types/           # TypeScript definitions
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── middleware/      # Authentication middleware
│   │   ├── services/        # Business logic
│   │   └── types/           # TypeScript definitions
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
└── docker-compose.yml
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires authentication)

### Pokemon
- `GET /api/pokemon` - List Pokemon (paginated)
- `GET /api/pokemon/search` - Search Pokemon by name, ability, or type
- `GET /api/pokemon/:id` - Get Pokemon details

### Favorites (authentication required)
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add Pokemon to favorites
- `GET /api/favorites/:id` - Get specific favorite with Pokemon details
- `DELETE /api/favorites/:pokemonId` - Remove from favorites

## 📚 API Documentation

Interactive API documentation is available through **Swagger UI** at:
- **Local**: http://localhost:4000/api-docs
- **Docker**: http://localhost:4000/api-docs

### Using Swagger UI

1. **Navigate to the documentation**: Open your browser and go to `http://localhost:4000/api-docs`

2. **Explore endpoints**: All endpoints are organized by tags (Authentication, Pokemon, Favorites)

3. **Test endpoints**:
   - Click on any endpoint to expand it
   - Click "Try it out" button
   - Fill in required parameters
   - Click "Execute" to make the request

4. **Authenticate for protected endpoints**:
   - First, register or login using the `/api/auth/register` or `/api/auth/login` endpoints
   - Copy the JWT token from the response
   - Click the "Authorize" button at the top of the page
   - Enter: `Bearer <your-token>` (replace `<your-token>` with your actual token)
   - Click "Authorize" and then "Close"
   - Now you can test protected endpoints like favorites

### Example: Adding a Pokemon to Favorites

1. Login via `/api/auth/login` and get your token
2. Click "Authorize" and paste your token
3. Navigate to `POST /api/favorites`
4. Click "Try it out"
5. Enter request body:
   ```json
   {
     "pokemonId": 25
   }
   ```
6. Click "Execute" to add Pikachu to your favorites!

## 🗄️ Database Schema

### Table `users`
- `id` (UUID) - Primary key
- `email` (String) - Unique
- `password` (String) - bcrypt hash
- `name` (String?) - Optional
- `createdAt` (DateTime)

### Table `favorites`
- `id` (UUID) - Primary key
- `pokemonId` (Int)
- `userId` (String) - Foreign key to users
- `createdAt` (DateTime)
- Unique constraint: `[pokemonId, userId]`

## 🌐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://user:password@localhost:3306/pokeapi"
PORT=4000
JWT_SECRET="your-secret-key-here"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
```