import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Redirect href="/auth/onboarding" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
