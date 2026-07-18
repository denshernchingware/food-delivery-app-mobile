import seed from "@/lib/seed"
import {  Button, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Search = () => {
    return (
        <SafeAreaView>
            <Text>search</Text>
           <Button
                title="Seed"
                onPress={() =>
                seed().catch((error) => {
                console.log(error);
        })
    }
/>
        </SafeAreaView>
    )
}
export default Search