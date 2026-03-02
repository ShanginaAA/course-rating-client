import type { FC } from 'react';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { extractErrorMessage, loginRequest } from '../../features/auth/api/authApi';
import { useAuth } from '../../features/auth/model/AuthContext';
import styles from './LoginForm.module.scss';

const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Минимум 3 символа')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Только латинские буквы, цифры и . _ -'),
  password: z.string().min(6, 'Минимум 6 символов'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormValues = {
  username: '',
  password: '',
  rememberMe: false,
};

export const LoginForm: FC = () => {
  const navigate = useNavigate();
  const { setAuthFromResponse } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setFormError(null);

    try {
      const authResponse = await loginRequest({
        username: values.username,
        password: values.password,
      });

      const token = authResponse.token.accessToken;
      const serializedUser = JSON.stringify(authResponse.user);

      if (values.rememberMe) {
        window.localStorage.setItem('authToken', token);
        window.localStorage.setItem('authUser', serializedUser);
      } else {
        window.sessionStorage.setItem('authToken', token);
        window.sessionStorage.setItem('authUser', serializedUser);
      }

      setAuthFromResponse(authResponse);
      navigate('/');
    } catch (error) {
      const message = extractErrorMessage(error);
      setFormError(message);
    }
  };

  return (
    <div className={styles.loginForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Вход</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
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
          <label htmlFor="password" className={styles.label}>
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Введите пароль"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            <input type="checkbox" {...register('rememberMe')} />
            {' '}
            Запомнить меня
          </label>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.link}
            // TODO: восстановление пароля
            onClick={() => undefined}
          >
            Забыли пароль?
          </button>
        </div>

        {formError && <p className={styles.error}>{formError}</p>}

        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? 'Входим…' : 'Войти'}
        </button>

        <p className={styles.hint}>
          У вас ещё нет аккаунта?{' '}
          <Link className={styles.hintLink} to={'/register'}>
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
};
