import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import SignUp from "./SignUp";
import { secondary, tertiary } from "../../theme/colors";

const Stack = createNativeStackNavigator();

const ProfileStack = ({ navigation, token, setToken }: any) => {
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