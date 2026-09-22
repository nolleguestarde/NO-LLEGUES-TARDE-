import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="route/[id]" options={{ title: 'Detalle de ruta' }} />
        <Stack.Screen name="company/[id]" options={{ title: 'Empresa' }} />
        <Stack.Screen name="place/[id]" options={{ title: 'Lugar' }} />
        <Stack.Screen name="places" options={{ title: 'Lugares' }} />
        <Stack.Screen name="schedules" options={{ title: 'Horarios' }} />
        <Stack.Screen name="reports" options={{ title: 'Reportar novedad' }} />
        <Stack.Screen name="search" options={{ title: 'Buscar' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
