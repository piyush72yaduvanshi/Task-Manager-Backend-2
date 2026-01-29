# Task Manager Backend

A comprehensive Node.js REST API for task and project management with role-based access control, built with Express.js and MongoDB.

## 🚀 Features

### Authentication & User Management
- User registration with email verification
- Secure login/logout with JWT tokens
- Password reset functionality
- Token refresh mechanism
- Profile management
- Role-based access control (ADMIN, USER)

### Project Management
- Create, read, update, and delete projects
- Project ownership and access control
- Project member management with roles
- Role-based permissions (ADMIN, PROJECT_ADMIN, MEMBER)

### Task Management
- Create and assign tasks to project members
- Task status tracking (TODO, IN_PROGRESS, DONE)
- Task updates and deletion
- File attachments support
- Task assignment by email

### Sub-task Management
- Create sub-tasks within main tasks
- Track completion status
- Update and delete sub-tasks
- User-specific sub-task management

### Notes & Collaboration
- Project-level notes creation
- Member collaboration on notes
- Note management (create, read, update, delete)

### Email Notifications
- Email verification for new users
- Password reset emails
- Automated email templates with Mailgen

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email Service**: Nodemailer with Mailgen
- **File Upload**: Multer
- **Validation**: Express-validator
- **Development**: Nodemon

## 📁 Project Structure

```
src/
├── controllers/          # Business logic
│   ├── auth.controllers.js
│   ├── project.controllers.js
│   ├── projectmember.controllers.js
│   ├── task.controllers.js
│   ├── subTask.controllers.js
│   ├── note.controllers.js
│   └── healthcheck.controllers.js
├── models/              # Database schemas
│   ├── auth.models.js
│   ├── project.models.js
│   ├── projectmember.models.js
│   ├── task.models.js
│   ├── subTask.models.js
│   └── note.models.js
├── routes/              # API endpoints
│   ├── auth.routes.js
│   ├── project.routes.js
│   ├── projectmember.routes.js
│   ├── task.routes.js
│   ├── subTask.routes.js
│   ├── note.routes.js
│   └── healthcheck.routes.js
├── middlewares/         # Custom middleware
│   ├── auth.middlewares.js
│   ├── validateProject.middleware.js
│   ├── validator.middlewares.js
│   └── multer.middlewares.js
├── utils/               # Utility functions
│   ├── api-error.js
│   ├── Api-response.js
│   ├── asyncHandler.js
│   ├── constants.js
│   └── emailSender.js
├── validators/          # Input validation
│   └── validateUserData.js
├── db/                  # Database configuration
│   └── database.db.js
├── app.js              # Express app configuration
└── index.js            # Server entry point
```

## 🗄 Database Models

### User Model
```javascript
{
  avatar: { url, localpath },
  fullname: String,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: ["ADMIN", "USER"],
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  refreshToken: String
}
```

### Project Model
```javascript
{
  name: String (unique),
  description: String,
  createdBy: ObjectId (User)
}
```

### ProjectMember Model
```javascript
{
  user: ObjectId (User),
  project: ObjectId (Project),
  role: ["admin", "project_admin", "member"]
}
```

### Task Model
```javascript
{
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  assignedBy: ObjectId (User),
  status: ["todo", "in_progress", "done"],
  attachments: [{ url, mimetype, size }]
}
```

### SubTask Model
```javascript
{
  title: String,
  task: ObjectId (Task),
  isCompleted: Boolean,
  createdBy: ObjectId (User)
}
```

### Note Model
```javascript
{
  project: ObjectId (Project),
  createdBy: ObjectId (User),
  contant: String
}
```

## 🔌 API Endpoints

### Authentication (`/api/v1/users`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify/:token` - Email verification
- `POST /refresh-access-token` - Refresh access token
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `POST /change-password` - Change current password
- `GET /resend-email` - Resend verification email
- `GET /profile` - Get user profile
- `GET /logout` - User logout

### Projects (`/api/v1/projects`)
- `POST /get-projects` - Get all projects
- `POST /get-project-by-id/:projectId` - Get project by ID
- `POST /create-project` - Create new project
- `PUT /update-project/:projectId` - Update project
- `DELETE /delete-project/:projectId` - Delete project

### Project Members (`/api/v1/members`)
- `POST /add-member/:projectId` - Add member to project
- `POST /get-members/:projectId` - Get project members
- `PUT /update-member/:projectId` - Update project member
- `PUT /update-member-role/:projectId` - Update member role
- `DELETE /delete-member/:projectId` - Remove member from project

### Tasks (`/api/v1/tasks`)
- `POST /create-task/:projectId` - Create new task
- `POST /get-tasks/:projectId` - Get project tasks
- `POST /get-task-by-id/:taskId` - Get task by ID
- `PUT /update-task/:taskId` - Update task
- `DELETE /delete-task/:taskId` - Delete task
- `PUT /update-task-status/:taskId` - Update task status

### Sub-tasks (`/api/v1/sub-tasks`)
- `POST /create/:taskId` - Create sub-task
- `POST /get-sub-tasks/:taskId` - Get task sub-tasks
- `POST /get-sub-task-by-id/:subTaskId` - Get sub-task by ID
- `PUT /update-sub-task/:subTaskId` - Update sub-task
- `DELETE /delete-sub-task/:subTaskId` - Delete sub-task

### Notes (`/api/v1/notes`)
- `POST /get-notes/:projectId` - Get project notes
- `POST /create/:projectId` - Create note
- `GET /get-note-by-id/:noteId` - Get note by ID
- `PUT /update/:noteId` - Update note
- `DELETE /delete/:noteId` - Delete note

### Health Check (`/api/v1/healthcheck`)
- `GET /` - API health status

## 🔐 Authentication & Authorization

### JWT Token System
- **Access Token**: Short-lived token for API access
- **Refresh Token**: Long-lived token for refreshing access tokens
- **Email Verification Token**: For email verification process
- **Password Reset Token**: For password reset functionality

### Role-Based Access Control
- **ADMIN**: Full system access
- **PROJECT_ADMIN**: Project-level administrative access
- **MEMBER**: Basic project member access

### Middleware Protection
- `isLoggedIn`: Validates JWT tokens
- `validateProjectIdAndRole`: Validates project access and roles
- `validateProjectMember`: Validates project membership with specific roles

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd task-manager-backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp env.example .env
```

4. Configure environment variables
```env
PORT=8080
MONGO_DB_URL=mongodb://localhost:27017/taskmanager
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
BASE_URL=http://localhost:3000
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAILTRAP_FROM=noreply@taskmanager.com
```

5. Start the development server
```bash
npm start
```

The server will start on `http://localhost:8080`

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | No (default: 8080) |
| `MONGO_DB_URL` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration time | Yes |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Yes |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration time | Yes |
| `BASE_URL` | Frontend application URL | Yes |
| `MAILTRAP_HOST` | Email service host | Yes |
| `MAILTRAP_PORT` | Email service port | Yes |
| `MAILTRAP_USERNAME` | Email service username | Yes |
| `MAILTRAP_PASSWORD` | Email service password | Yes |
| `MAILTRAP_FROM` | Email sender address | Yes |

## 🔧 Development

### Scripts
- `npm start` - Start development server with nodemon

### Code Style
- Prettier configuration included
- ESLint configuration recommended
- ES6+ modules used throughout

### Error Handling
- Custom `ApiError` class for consistent error responses
- `ApiResponse` class for standardized success responses
- Global error handling middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🐛 Known Issues

- Some typos in variable names (e.g., `contant` instead of `content`)
- Missing error handling in some controller methods
- Inconsistent error messages and status codes

## 🔮 Future Enhancements

- File upload functionality for task attachments
- Real-time notifications with WebSocket
- Task due dates and reminders
- Project templates
- Advanced search and filtering
- API rate limiting
- Comprehensive logging system
- Unit and integration tests
