import { SplashScreen, Stack } from "expo-router";
import "./styles/global.css";
import * as Sentry from "@sentry/react-native";
import { useEffect } from "react";
import { useFonts } from 'expo-font';
import useAuthStore from "@/store/auth.store";

Sentry.init({
  dsn: "https://f5128783928c3dcb1ad8f63174374af7@o4511753222684672.ingest.us.sentry.io/4511753274720256",

  sendDefaultPii: true,
  enableLogs: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,

  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // spotlight: __DEV__,
});

function RootLayout() {
   const { isLoading, fetchAuthenticatedUser } = useAuthStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });

  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser()
  }, []);

  if(!fontsLoaded || isLoading) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default Sentry.wrap(RootLayout);