import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ToastProvider } from 'react-native-toast-notifications';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <ToastProvider>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(routes)/welcome-intro/index" />
        <Stack.Screen name="(routes)/login/index" />
        <Stack.Screen name="(routes)/sign-up/index" />
        <Stack.Screen name="(routes)/forgot-password/index" />
        <Stack.Screen name="(routes)/product-details/index" />
        <Stack.Screen name="(routes)/product-review/index" />
        <Stack.Screen name="(routes)/treatment-review/index" />
        <Stack.Screen name="(routes)/cart/index" />
        <Stack.Screen name="(routes)/products/index" />
        <Stack.Screen name="(routes)/treatment-details/index" />
        <Stack.Screen name="(routes)/booking/index" />
        <Stack.Screen name="(routes)/payment/index" />
        <Stack.Screen name="(routes)/treatments/index" />
        <Stack.Screen name="(routes)/profile-details/index" />
      </Stack>
    </ToastProvider>
  );
}
