import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { secondary, tertiary } from "../../theme/colors";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const ProfileStack = ({ token, setToken }: any) => {
    const navigation = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: secondary
                },
                headerTintColor: tertiary
            }}
        >
            <Stack.Screen name="Profile" children={() => <Profile navigation={navigation} token={token} setToken={setToken} />} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign up' }} />
        </Stack.Navigator>
    );
}

export default ProfileStack