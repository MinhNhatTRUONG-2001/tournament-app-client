import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TournamentList from "./TournamentList";
import { secondary, tertiary } from "../../theme/colors";

const Stack = createNativeStackNavigator();

const TournamentStack = () => {
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
            name="TournamentList"
            component={TournamentList}
            options={{
                title: 'Your tournaments',
            }}
        />
    </Stack.Navigator>
  );
}

export default TournamentStack