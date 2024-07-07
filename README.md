# Organization Authentication API

This project provides an authentication API for an organization management system, built with Node.js, Express, and
Sequelize. The API allows users to register, log in, and manage organizations and users within those organizations.

## Table of Contents

- [Organization Authentication API](#organization-authentication-api)
    - [Table of Contents](#table-of-contents)
    - [Getting Started](#getting-started)
        - [Prerequisites](#prerequisites)
        - [Installation](#installation)
        - [Environment Variables](#environment-variables)
        - [Database Setup](#database-setup)
    - [Project Structure](#project-structure)
    - [API Endpoints](#api-endpoints)
        - [Authentication](#authentication)
        - [Users](#users)
        - [Organizations](#organizations)
    - [Testing](#testing)
    - [Error Handling](#error-handling)
    - [Contributing](#contributing)
    - [License](#license)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (>=14.x)
- npm (>=6.x)
- PostgreSQL (or another supported SQL database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/organization-auth.git
   cd organization-auth
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the project with the following content:

```env
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Database Setup

1. Ensure your PostgreSQL database is running and accessible.

2. Run the database migrations and seed the database:

   ```bash
   npm run migrate
   npm run seed
   ```

## Project Structure

```
organization_auth/
├── dist/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── organisation.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorMiddleware.ts
│   ├── models/
│   │   ├── organisation.ts
│   │   └── user.ts
│   ├── routes/
│   │   ├── api.routes.ts
│   │   ├── auth.routes.ts
│   │   └── index.ts
│   ├── tests/
│   │   ├── auth.spec.ts
│   │   ├── organisation.spec.ts
│   │   └── user.spec.ts
│   ├── types/
│   │   └── express/
│   │       ├── index.d.ts
│   │       └── express.d.ts
│   └── index.ts
├── .env
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── vercel.json
```

## API Endpoints

### Authentication

- **Register**: `POST /auth/register`
    - Request body: `{ firstName, lastName, email, password, phone }`
    - Response: `{ status, data: { accessToken, user } }`

- **Login**: `POST /auth/login`
    - Request body: `{ email, password }`
    - Response: `{ status, data: { accessToken, user } }`

### Users

- **Get User by ID**: `GET /api/users/:id`
    - Response: `{ status, data: user }`

### Organizations

- **Get All Organizations**: `GET /api/organizations`
    - Response: `{ status, data: { organizations } }`

- **Get Organization by ID**: `GET /api/organizations/:orgId`
    - Response: `{ status, data: organization }`

- **Create Organization**: `POST /api/organizations`
    - Request body: `{ name, description }`
    - Response: `{ status, data: organization }`

- **Add User to Organization**: `POST /api/organizations/:orgId/users`
    - Request body: `{ userId }`
    - Response: `{ status, message }`

## Testing

The project uses Jest for testing. To run the tests, use the following command:

```bash
npm test
```

The tests cover the authentication routes, user routes, and organization routes.

## Error Handling

The API includes middleware for handling errors:

- `notFoundErrorHandler`: Handles 404 errors for routes that do not exist.
- `generalErrorHandler`: Handles general server errors and returns a structured error response.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin my-feature-branch`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
