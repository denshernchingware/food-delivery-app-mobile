import useAuthStore from "@/store/auth.store";
import { Redirect, Tabs } from "expo-router";

export default function Layout() {
     const { isAuthenticated } = useAuthStore();
    console.log(isAuthenticated)
     if(!isAuthenticated) return <Redirect href="/sign-in" />
    return (
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    title:"home",
                }}
            />
        </Tabs>
    );
}