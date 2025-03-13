# Full-Stack Todo Application

A modern, full-stack Todo application built with Next.js and NestJS, featuring real-time updates, caching, and audit logging.

## Features

- 🚀 **Modern Stack**: Next.js 14 frontend with NestJS 10 backend
- 💾 **Multiple Databases**: PostgreSQL for todos, MongoDB for audit logging
- 🔄 **Real-time Updates**: SWR for efficient data fetching and caching
- 🎯 **Type Safety**: Full TypeScript support throughout the application
- 🎨 **Modern UI**: Tailwind CSS for responsive design
- 🔒 **Data Persistence**: PostgreSQL with TypeORM
- 📝 **Audit Logging**: MongoDB for tracking all changes
- 🚦 **Message Queue**: RabbitMQ for async operations
- 💨 **Performance**: Redis caching layer
- 🐳 **Docker**: Containerized development environment

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

## Project Structure

```
todo-app/
├── frontend/                 # Next.js frontend
│   ├── pages/               # Next.js pages
│   │   ├── index.tsx        # Todo list UI
│   │   └── api/            # API routes
│   └── styles/              # Global styles
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── todos/          # Todo module (PostgreSQL)
│   │   ├── audit/          # Audit module (MongoDB)
│   │   ├── redis/          # Redis caching service
│   │   └── rabbitmq/       # Message queue service
│   └── test/               # Test files
└── docker-compose.yml      # Docker services configuration
```

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd todo-app
\`\`\`

2. Start the Docker containers:
\`\`\`bash
docker-compose up -d
\`\`\`

3. Install and start the backend:
\`\`\`bash
cd backend
npm install
npm run start:dev
\`\`\`

4. Install and start the frontend:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Available Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379
- RabbitMQ: 
  - AMQP: localhost:5672
  - Management UI: http://localhost:15672

## Environment Variables

### Backend (.env)
\`\`\`env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=tododb

# MongoDB Configuration
MONGODB_URI=mongodb://root:root@localhost:27017/audit

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_QUEUE=todo_queue

# Application Configuration
PORT=3001
NODE_ENV=development
\`\`\`

## API Endpoints

### Todos

- `GET /todos` - Get all todos
- `GET /todos/:id` - Get a specific todo
- `POST /todos` - Create a new todo
- `PATCH /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Features in Detail

### Frontend
- Modern UI with Tailwind CSS
- Real-time updates using SWR
- Form handling with react-hook-form
- TypeScript for type safety

### Backend
- NestJS modules for organized code structure
- TypeORM for database operations
- MongoDB for audit logging
- Redis caching layer
- RabbitMQ for async operations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 