# Платформа отзывов и оценок курсов

## Стек

- React 18
- TypeScript
- Vite
- React Router 6
- TanStack React Query
- Axios
- React Hook Form + Zod
- SASS (модули).

## Структура:

- src/pages/ — страницы: Home, Catalog, CourseDetails, Login, Register, Admin, Moderator, NotFound.
- src/layouts/ — AppLayout (с хедером/футером), AuthLayout.
- src/features/ — фичи: auth (контекст, API, хранилище), categories API.
- src/components/ — логин (LoginForm), register (RegisterForm).
- src/shared/types/domain.ts — доменные типы: User, Role, Course, Review, Category, Platform и т.д.
