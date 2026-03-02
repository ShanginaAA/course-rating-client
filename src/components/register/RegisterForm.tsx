import type { FC } from 'react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { extractErrorMessage, registerRequest } from '../../features/auth/api/authApi';
import { useAuth } from '../../features/auth/model/AuthContext';
import { useQuery } from '@tanstack/react-query';
import type { Category } from '../../shared/types/domain';
import { getCategories } from '../../features/categories/api/categoriesApi';
import styles from './RegisterForm.module.scss';

const usernameSchema = z
  .string()
  .min(3, 'Минимум 3 символа')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Только латинские буквы, цифры и . _ -');

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Фамилия обязательна'),
    name: z.string().min(1, 'Имя обязательно'),
    lastName: z.string().optional(),
    username: usernameSchema,
    email: z.string().email('Введите корректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Минимум 6 символов'),
    interests: z.array(z.string()).min(1, 'Выберите хотя бы один интерес'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли должны совпадать',
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const defaultValues: RegisterFormValues = {
  lastName: '',
  firstName: '',
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  interests: [],
};

export const RegisterForm: FC = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const selectedInterests = watch('interests');

  const toggleInterest = (id: string) => {
    const current = selectedInterests ?? [];
    const exists = current.includes(id);
    const next = exists ? current.filter((value) => value !== id) : [...current, id];

    setValue('interests', next, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    setFormError(null);
    setIsRegistered(false);

    try {
      await registerRequest({
        username: values.username,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        name: values.name,
        lastName: values.lastName ?? '',
        interests: values.interests.map((id) => Number(id)),
      });

      setIsRegistered(true);
    } catch (error) {
      const message = extractErrorMessage(error);
      setFormError(message);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const isInterestSelected = (id: string) => selectedInterests?.includes(id) ?? false;

  return (
    <div className={styles.registerForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Регистрация</h2>
        <p className={styles.formSubtitle}>
          Заполните данные профиля и выберите интересы, чтобы получать персональные рекомендации.
        </p>
      </div>

      {isRegistered ? (
        <p className={styles.success}>
          Регистрация прошла успешно. Теперь вы можете{' '}
          <button type="button" className={styles.hintLink} onClick={handleLoginClick}>
            войти
          </button>
          .
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="firstName" className={styles.label}>
                Фамилия
              </label>
              <input
                id="firstName"
                type="text"
                className={styles.input}
                placeholder="Фамилия"
                autoComplete="family-name"
                {...register('firstName')}
              />
              {errors.firstName && <p className={styles.error}>{errors.firstName.message}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Имя
              </label>
              <input
                id="name"
                type="text"
                className={styles.input}
                placeholder="Имя"
                autoComplete="given-name"
                {...register('name')}
              />
              {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="lastName" className={styles.label}>
                Отчество
              </label>
              <input
                id="lastName"
                type="text"
                className={styles.input}
                placeholder="Отчество"
                autoComplete="additional-name"
                {...register('lastName')}
              />
              {errors.lastName && <p className={styles.error}>{errors.lastName.message}</p>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>
                Логин
              </label>
              <input
                id="username"
                type="text"
                className={styles.input}
                placeholder="Логин"
                autoComplete="username"
                {...register('username')}
              />
              {errors.username && <p className={styles.error}>{errors.username.message}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Электронная почта
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="name@university.ru"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <input
                id="password"
                type="password"
                className={styles.input}
                placeholder="Придумайте пароль"
                autoComplete="new-password"
                {...register('password')}
              />
              {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Повторите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={styles.input}
                placeholder="Повторите пароль"
                autoComplete="new-password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Интересы</span>
            {isCategoriesLoading && <p className={styles.error}>Загружаем список интересов...</p>}
            {isCategoriesError && (
              <p className={styles.error}>Не удалось загрузить интересы. Попробуйте позже.</p>
            )}
            {!isCategoriesLoading && !isCategoriesError && (
              <>
                <div className={styles.chips}>
                  {(categories ?? []).map((category) => {
                    const selected = isInterestSelected(category.id);

                    return (
                      <button
                        key={category.id}
                        type="button"
                        className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
                        onClick={() => toggleInterest(category.id)}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
                {errors.interests && <p className={styles.error}>{errors.interests.message}</p>}
              </>
            )}
          </div>

          {formError && <p className={styles.error}>{formError}</p>}

          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? 'Регистрируем…' : 'Регистрация'}
          </button>

          <p className={styles.hint}>
            У Вас уже есть аккаунт?{' '}
            <button type="button" className={styles.hintLink} onClick={handleLoginClick}>
              Войдите
            </button>
          </p>
        </form>
      )}
    </div>
  );
};
