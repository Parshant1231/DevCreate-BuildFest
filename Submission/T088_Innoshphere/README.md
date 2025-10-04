# AdaptivePlanr - Smart Education & E-Learning Platform

A comprehensive web-based platform for intelligent timetable scheduling and e-learning management for higher education institutions. Built with modern technologies to address the complex challenges of class scheduling, faculty management, and student learning in the NEP 2020 era.

## 🚀 Features

### Authentication & User Management
- **Multi-role Authentication**: Admin, Faculty, Student, and Approver roles
- **Secure Login/Signup**: Modern UI with demo credentials
- **Role-based Access Control**: Different permissions for different user types
- **Password Reset**: Secure password recovery system

### Intelligent Timetable Management
- **Advanced Optimization Engine**: AI-powered genetic algorithms for optimal scheduling
- **Conflict Detection**: Automatic identification and resolution of scheduling conflicts
- **Multi-department Support**: Handle complex institutional structures
- **Multi-shift Scheduling**: Support for morning, afternoon, and evening shifts
- **Real-time Progress Tracking**: Live optimization progress with metrics

### Approval Workflow System
- **Multi-level Approvals**: Department → Academic → Administrative workflow
- **Review & Feedback**: Collaborative review process with comments
- **Status Tracking**: Real-time approval status updates
- **Audit Trail**: Complete history of approvals and changes

### Learning Management System
- **Course Management**: Comprehensive course catalog with prerequisites
- **Learning Modules**: Video lessons, documents, quizzes, and assignments
- **Assignment System**: Create, submit, and grade assignments
- **Progress Tracking**: Student progress monitoring and analytics
- **Grade Management**: Comprehensive grading system with feedback

### Department & Resource Management
- **Department Configuration**: Manage departments with preferences and constraints
- **Faculty Management**: Faculty profiles with availability and workload tracking
- **Classroom Management**: Resource allocation and utilization optimization
- **Time Slot Configuration**: Flexible time slot management

### Analytics & Reporting
- **Performance Metrics**: Classroom utilization, faculty workload balance
- **Conflict Analysis**: Detailed conflict reporting and resolution suggestions
- **Student Satisfaction**: Department and course satisfaction tracking
- **System Analytics**: Usage statistics and performance monitoring

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + useState/useReducer
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner + React Toast
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── AuthPage.tsx      # Main auth page
│   │   ├── LoginForm.tsx     # Login form
│   │   ├── SignupForm.tsx    # Registration form
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/            # Dashboard components
│   │   ├── DashboardLayout.tsx
│   │   └── Dashboard.tsx
│   ├── timetable/            # Timetable management
│   │   └── TimetableOptimizer.tsx
│   ├── approval/             # Approval workflow
│   │   └── ApprovalWorkflow.tsx
│   ├── department/           # Department management
│   │   └── DepartmentManager.tsx
│   ├── learning/             # Learning management
│   │   └── LearningHub.tsx
│   ├── ui/                   # Reusable UI components
│   └── CourseManager.tsx     # Enhanced course management
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── types/
│   └── index.ts              # TypeScript type definitions
├── hooks/
│   └── use-toast.ts          # Toast notifications
├── lib/
│   └── utils.ts              # Utility functions
└── pages/
    ├── Index.tsx
    └── NotFound.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd adaptive-planr
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the application.

### Demo Credentials

The application includes demo credentials for testing different user roles:

#### Administrator
- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Full system access and management

#### Faculty
- **Email**: faculty@example.com
- **Password**: faculty123
- **Access**: Course management and timetable creation

#### Student
- **Email**: student@example.com
- **Password**: student123
- **Access**: View timetable and access learning materials

## 📱 Usage Guide

### For Administrators

1. **Login** with admin credentials
2. **Set up Departments** - Configure departments, shifts, and preferences
3. **Manage Faculty** - Add faculty members with availability and workload constraints
4. **Configure Classrooms** - Set up classrooms with resources and capacity
5. **Generate Timetables** - Use the optimization engine to create optimal schedules
6. **Review Approvals** - Manage the approval workflow for generated timetables

### For Faculty

1. **Login** with faculty credentials
2. **Manage Courses** - Add and configure courses with prerequisites
3. **Create Learning Content** - Upload videos, documents, and create assignments
4. **Grade Submissions** - Review and grade student assignments
5. **View Schedule** - Access personal timetable and class schedules

### For Students

1. **Login** with student credentials
2. **View Timetable** - Access personal class schedule
3. **Access Learning Materials** - View courses, modules, and assignments
4. **Submit Assignments** - Upload and submit coursework
5. **Track Progress** - Monitor academic progress and grades

### For Approvers

1. **Login** with approver credentials
2. **Review Timetables** - Evaluate generated timetables for approval
3. **Provide Feedback** - Add comments and suggestions
4. **Approve/Reject** - Make final decisions on timetable implementations

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=AdaptivePlanr
VITE_VERSION=1.0.0
```

### Customization

- **Themes**: Modify `tailwind.config.ts` for custom color schemes
- **Components**: Customize UI components in `src/components/ui/`
- **Validation**: Update Zod schemas for form validation rules
- **Types**: Extend TypeScript interfaces in `src/types/index.ts`

## 🧪 Testing

Run the test suite:
```bash
npm run test
# or
yarn test
# or
pnpm test
```

Run linting:
```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## 📦 Building for Production

Build the project:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

Preview the production build:
```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 🌟 Key Features in Detail

### Intelligent Optimization Engine

The platform uses advanced genetic algorithms to optimize timetable generation:

- **Fitness Function**: Evaluates timetables based on multiple criteria
- **Constraint Handling**: Respects faculty availability, classroom capacity, and department preferences
- **Conflict Resolution**: Automatically resolves scheduling conflicts
- **Performance Metrics**: Tracks teacher workload balance, classroom utilization, and student satisfaction

### Multi-Department Support

Handles complex institutional structures:

- **Department Preferences**: Customizable slot preferences and constraints
- **Cross-Department Courses**: Support for courses spanning multiple departments
- **Resource Sharing**: Intelligent allocation of shared resources
- **Workload Distribution**: Balanced distribution of classes across departments

### Approval Workflow

Comprehensive review process:

- **Multi-level Approvals**: Department → Academic → Administrative
- **Role-based Permissions**: Different approval levels for different roles
- **Feedback System**: Structured feedback and revision requests
- **Audit Trail**: Complete history of changes and approvals

### Learning Management

Integrated e-learning capabilities:

- **Course Catalog**: Comprehensive course management with prerequisites
- **Learning Modules**: Various content types (videos, documents, quizzes)
- **Assignment System**: Create, submit, and grade assignments
- **Progress Tracking**: Monitor student progress and engagement

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check the inline code documentation
- **Issues**: Open an issue on GitHub
- **Discussions**: Join the project discussions

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Machine learning-based insights
- **Integration APIs**: Connect with existing institutional systems
- **Multi-language Support**: Internationalization
- **Cloud Deployment**: Scalable cloud infrastructure
- **Real-time Collaboration**: Live editing and collaboration features

---

**AdaptivePlanr** - Revolutionizing education management with intelligent scheduling and comprehensive learning tools.