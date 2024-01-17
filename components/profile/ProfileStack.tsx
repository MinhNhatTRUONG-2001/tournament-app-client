import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import SignUp from "./SignUp";
import { secondary, tertiary } from "../../theme/colors";
import ChangeUserInfo from "./account/ChangeUserInfo";
import ChangePassword from "./account/ChangePassword";
import FAQ from "./help_and_about/FAQ";
import ContactUs from "./help_and_about/ContactUs";
import About from "./help_and_about/About";

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
            <Stack.Screen 
                name="Profile"
                children={() => <Profile navigation={navigation} token={token} setToken={setToken} />}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ title: 'Sign up' }}
            />
            <Stack.Screen
                name="ChangeUserInfo"
                children={() => <ChangeUserInfo navigation={navigation} token={token} />}
                options={{ title: 'Change user information' }}
            />
            <Stack.Screen
                name="ChangePassword"
                children={() => <ChangePassword navigation={navigation} token={token} />}
                options={{ title: 'Change password' }}
            />
            <Stack.Screen
                name="FAQ"
                component={FAQ}
                options={{ title: 'FAQ' }}
            />
            <Stack.Screen
                name="ContactUs"
                component={ContactUs}
                options={{ title: 'Contact us' }}
            />
            <Stack.Screen
                name="About"
                component={About}
                options={{ title: 'About' }}
            />
        </Stack.Navigator>
    );
}

export default ProfileStack