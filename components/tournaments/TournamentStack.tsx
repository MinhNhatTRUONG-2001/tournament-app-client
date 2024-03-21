import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TournamentList from "./TournamentList";
import { secondary, tertiary } from "../../theme/colors";
import TournamentDetails from "./TournamentDetails";
import NewTournament from "./NewTournament";
import EditTournament from "./EditTournament";
import EditStage from "../stages/EditStage";
import NewStage from "../stages/NewStage";
import StageDetails from "../stages/StageDetails";

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
        <Stack.Screen
            name="NewStage"
            component={NewStage}
            options={{
                title: 'New Stage',
            }}
        />
        <Stack.Screen
            name="EditStage"
            component={EditStage}
            options={{
                title: 'Edit Stage',
            }}
        />
        <Stack.Screen
            name="StageDetails"
            component={StageDetails}
            options={{
                title: 'Stage Details',
            }}
        />
    </Stack.Navigator>
  );
}

export default TournamentStack