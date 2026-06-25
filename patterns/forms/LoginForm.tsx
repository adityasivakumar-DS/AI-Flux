import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Typography } from '../../components/Typography';
import { Alert } from '../../components/Alert';
import styles from './LoginForm.module.css';

export interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
  logoSrc?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, logoSrc }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          {logoSrc && <img src={logoSrc} alt="AI Flux" className={styles.logo} />}
          <Typography variant="heading-1" className={styles.title}>
            Welcome back
          </Typography>
          <Typography variant="body" color="secondary">
            Sign in to your AI Flux workspace
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {error && (
            <Alert variant="error" onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Input
            type="email"
            label="Email address"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            isRequired
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            isRequired
          />

          <div className={styles.forgot}>
            <a href="/forgot-password" className={styles.link}>
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </form>

        <p className={styles.footer}>
          <Typography variant="small" color="muted">
            Don&apos;t have an account?{' '}
            <a href="/signup" className={styles.link}>
              Start free trial
            </a>
          </Typography>
        </p>
      </div>
    </div>
  );
};
