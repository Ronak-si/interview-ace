# Interview Ace

Build a modern, production-quality AI Interview Preparation Platform for frontend developers.

The application should look like a real SaaS product similar to Vercel, Linear, or Notion with a clean, minimal, responsive UI.

Use ONLY these technologies:

- React (Vite)

- JavaScript (No TypeScript)

- Tailwind CSS

- React Router DOM

- Context API for state management

- Firebase Authentication

- Firebase Firestore

- Gemini API

- React Hook Form

- Recharts

The project should have a professional folder structure suitable for MNC interviews.

Features:

1. Authentication

- Login

- Signup

- Google Login

- Forgot Password

- Protected Routes

2. Dashboard

- Welcome user

- Previous interviews

- Total interviews

- Average score

- Recent activity

- Progress charts

- Responsive cards

3. AI Interview Generator

- Select role:

  - Frontend Developer

  - Backend Developer

  - Full Stack Developer

  - SDE

- Select difficulty:

  - Easy

  - Medium

  - Hard

- Select number of questions

- Generate interview using Gemini API

4. Interview Screen

- One question at a time

- Question counter

- Timer

- Previous/Next buttons

- Answer textarea

- Auto save answers

- Submit interview

5. AI Evaluation

- Overall Score

- Technical Score

- Communication Score

- Problem Solving Score

- Detailed feedback for every answer

- Suggestions for improvement

- Strengths

- Weaknesses

6. Analytics Page

- Interview history

- Performance graph

- Topic-wise performance

- Improvement trend

- Best score

- Average score

7. Profile Page

- Update profile

- Change password

- Logout

8. UI Requirements

- Professional SaaS Dashboard

- Dark and Light mode

- Beautiful gradients

- Glassmorphism cards

- Modern sidebar

- Responsive design

- Loading skeletons

- Toast notifications

- Smooth animations

- Mobile friendly

- Reusable components

9. Project Structure

Create separate folders for:

components

pages

hooks

context

services

firebase

utils

assets

layouts

10. Code Quality

- Modular React components

- Clean folder structure

- Reusable components

- Custom Hooks

- Proper comments

- Error handling

- Loading states

- Form validation

- Environment variables

- Production-ready code

11. Performance

- Lazy Loading

- Code Splitting

- Memoization where needed

- Optimized rendering

12. Deliverables

- Complete React source code

- Professional README

- Installation guide

- Environment setup

- Firebase configuration

- Gemini API integration

- Responsive design

Design the UI to be portfolio-worthy and suitable for placement interviews at Google, Microsoft, Amazon, Adobe, Atlassian, and other top product-based companies.

Do not use dummy layouts. Build a fully functional application with realistic sample data and clean architecture. The code should be easy to understand for a React developer with around one year of experience so it can be confidently explained during technical interviews.
Instead of generating the entire project in one go, ask Loveable to build it module by module:

 Authentication

 Dashboard

 AI Interview Generator

 Interview Screen

 AI Evaluation

 Analytics

 Deployment

This usually produces cleaner, more maintainable code and makes it much easier for you to understand and explain every part during interviews

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/40935c8f-250b-4f59-bb85-b307f03d55a6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
