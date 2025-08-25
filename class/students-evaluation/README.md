# Students Evaluation System

A comprehensive course evaluation system for educational institutions with dynamic course selection based on faculty and department.

## Features

### User Registration

- Full name, email, school name, student ID, level, department, and password
- Form validation with real-time feedback
- Password strength indicator
- Duplicate user prevention

### Dashboard

- **Academic Info Section**: Select faculty, department, and level
- **Dynamic Course Selection**: Courses automatically update based on selections
- **Course Evaluation**: Rate instructors, course content, and equipment
- **Progress Tracking**: Visual progress bar and completion statistics
- **PDF Export**: Download evaluation results
- **Email Integration**: Send evaluation results via email

### Academic Structure

The system supports multiple faculties with their respective departments:

#### Faculty of Science

- Computer Science (100L-500L)
- Mathematics (100L-200L)
- Physics (100L-200L)

#### Faculty of Engineering

- Electrical Engineering (100L-200L)
- Mechanical Engineering (100L-200L)

#### Faculty of Arts

- English (100L-200L)

#### Faculty of Social Sciences

- Economics (100L-200L)
- Political Science (100L-200L)

#### Faculty of Education

- Educational Administration (100L-200L)

#### Faculty of Law

- Private Law (100L-200L)

## How to Use

1. **Register**: Create an account with your academic information
2. **Login**: Access your dashboard
3. **Academic Info**: Select your faculty, department, and level
4. **Course Selection**: Choose from available courses for your level
5. **Evaluation**: Complete the evaluation forms for instructors, course content, and equipment
6. **Submit**: Review and submit your evaluation

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Local Storage for user data
- **PDF Generation**: jsPDF library
- **Email**: EmailJS integration
- **Responsive Design**: Mobile-friendly interface

## File Structure

```
students-evaluation/
├── index.html          # Landing page
├── login.html          # Login form
├── register.html       # Registration form
├── dashboard.html      # Main dashboard
├── js/
│   ├── login.js       # Login functionality
│   ├── register.js    # Registration functionality
│   ├── dashboard.js   # Dashboard functionality
│   └── animations.js  # UI animations
└── style/
    ├── auth.css       # Authentication styles
    ├── dashboard.css  # Dashboard styles
    └── landing.css    # Landing page styles
```

## Setup

1. Clone or download the repository
2. Open `index.html` in a web browser
3. Register a new account
4. Start using the evaluation system

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

- Backend integration for data persistence
- Admin panel for managing courses and users
- Advanced analytics and reporting
- Multi-language support
- Mobile app version
