# SmartResumeAI API Server

Backend API server for SmartResumeAI Chrome extension, built with NestJS and TypeScript.

## Features

- 🔐 Google OAuth authentication
- 🤖 OpenAI integration for resume and cover letter generation
- 💳 Stripe payment processing
- 📊 User management with subscription plans
- 🗄️ PostgreSQL database with TypeORM
- ⚡ Redis for caching and job queues
- 📝 Swagger API documentation
- 🐳 Docker support

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Cache/Queue**: Redis with Bull
- **Authentication**: JWT + Google OAuth
- **AI**: OpenAI GPT-4
- **Payments**: Stripe
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.prod .env.local
   # Edit .env.local with your configuration
   ```

4. Set up the database:
   ```bash
   npm run migration:run
   ```

5. Start the development server:
   ```bash
   npm run start:dev
   ```

### Environment Variables

Required environment variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=smart_resume_ai

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRO_PRICE_ID=price_your-pro-price-id
STRIPE_PRO_PLUS_PRICE_ID=price_your-pro-plus-price-id

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
- Development: http://localhost:3000/api/docs
- Production: https://api.smartresumeai.com/api/docs

## Docker Deployment

### Development

```bash
docker-compose -f docker-docker-compose.yaml up -d
```

### Production

```bash
docker-compose -f docker-docker-compose.yaml --env-file .env.prod up -d
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/google` - Initiate Google OAuth
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile
- `POST /api/v1/auth/logout` - Logout user

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/stats` - Get user statistics

### Generations
- `POST /api/v1/generations` - Create generation request
- `GET /api/v1/generations` - Get user generations
- `GET /api/v1/generations/:id` - Get specific generation
- `POST /api/v1/generations/:id/regenerate` - Regenerate content
- `DELETE /api/v1/generations/:id` - Delete generation

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get specific order
- `GET /api/v1/orders/stats` - Get order statistics

### Stripe
- `POST /api/v1/stripe/create-checkout-session` - Create checkout session
- `POST /api/v1/stripe/create-addon-session` - Create addon session
- `GET /api/v1/stripe/prices` - Get available prices
- `POST /api/v1/stripe/webhook` - Handle Stripe webhooks

## Database Schema

### Users
- Basic user information
- Subscription plan and limits
- Stripe customer information

### Orders
- Payment information
- Subscription and addon purchases
- Order status tracking

### Generations
- Resume and cover letter generation requests
- Generated content storage
- Generation status and metadata

## Subscription Plans

- **Free**: 3 generations
- **Pro**: 30 generations/month
- **Pro+**: 100 generations/month
- **Add-ons**: Additional generations ($0.50 each)

## Development

### Scripts

```bash
npm run start:dev      # Start development server
npm run build          # Build for production
npm run start:prod     # Start production server
npm run start:worker   # Start background worker
npm run lint           # Run ESLint
npm run test           # Run tests
npm run migration:generate  # Generate migration
npm run migration:run       # Run migrations
npm run migration:revert    # Revert migration
```

### Code Structure

```
src/
├── auth/              # Authentication module
├── users/             # User management
├── generations/       # Content generation
├── orders/            # Order management
├── stripe/            # Payment processing
├── openai/            # AI integration
├── database/          # Database configuration
└── main.ts           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

