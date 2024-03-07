import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TournamentList from "./TournamentList";
import { secondary, tertiary } from "../../theme/colors";
import TournamentDetails from "./TournamentDetails";
import NewTournament from "./NewTournament";
import EditTournament from "./EditTournament";

const Stack = createNativeStackNavigator();

const TournamentStack = ({ navigation, token }: any) => {
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
            children={() => <TournamentList navigation={navigation} token={token} />}
            options={{
                title: 'Your tournaments',
            }}
        />
        <Stack.Screen
            name="NewTournament"
            component={NewTournament}
            options={{
                title: 'New Tournament',
            }}
        />
        <Stack.Screen
            name="EditTournament"
            component={EditTournament}
            options={{
                title: 'Edit Tournament',
            }}
        />
        <Stack.Screen
            name="TournamentDetails"
            component={TournamentDetails}
            options={{
                title: 'Tournament Details',
            }}
        />
    </Stack.Navigator>
  );
}

export default TournamentStack