import { Text, View } from "react-native";
import "../styles/global.css"
import { Redirect } from "expo-router";

export default function Index() {

  const signIn = true;
  if (!signIn) return <Redirect href={'/sign-in'} />
    
  return (

    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </View>
  );
}
