import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TournamentList from "./TournamentList";
import { secondary, tertiary } from "../../theme/colors";
import TournamentDetails from "./TournamentDetails";
import NewTournament from "./NewTournament";
import EditTournament from "./EditTournament";
import EditStage from "../stages/EditStage";
import NewStage from "../stages/NewStage";
import StageDetails from "../stages/StageDetails";
import EditStageOrder from "../stages/EditStageOrder";
import MatchDetailsSE from "../matches_se/MatchDetailsSE";
import EditTeamNamesSE from "../matches_se/EditTeamNamesSE";
import EditMatchScoresSE from "../matches_se/EditMatchScoresSE";
import EditMatchInfoSE from "../matches_se/EditMatchInfoSE";
import MatchDetailsRR from "../matches_rr/MatchDetailsRR";
import EditTeamNamesRR from "../matches_rr/EditTeamNamesRR";
import EditMatchInfoRR from "../matches_rr/EditMatchInfoRR";
import EditMatchScoresRR from "../matches_rr/EditMatchScoresRR";

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
        <Stack.Screen
            name="EditStageOrder"
            component={EditStageOrder}
            options={{
                title: 'Edit Stage Order',
            }}
        />
        <Stack.Screen
            name="MatchDetailsSE"
            component={MatchDetailsSE}
            options={{
                title: 'Match Details',
            }}
        />
        <Stack.Screen
            name="EditTeamNamesSE"
            component={EditTeamNamesSE}
            options={{
                title: 'Edit Team Names',
            }}
        />
        <Stack.Screen
            name="EditMatchInfoSE"
            component={EditMatchInfoSE}
            options={{
                title: 'Edit Match Information',
            }}
        />
        <Stack.Screen
            name="EditMatchScoresSE"
            component={EditMatchScoresSE}
            options={{
                title: 'Edit Match Scores',
            }}
        />
        <Stack.Screen
            name="MatchDetailsRR"
            component={MatchDetailsRR}
            options={{
                title: 'Match Details',
            }}
        />
        <Stack.Screen
            name="EditTeamNamesRR"
            component={EditTeamNamesRR}
            options={{
                title: 'Edit Team Names',
            }}
        />
        <Stack.Screen
            name="EditMatchInfoRR"
            component={EditMatchInfoRR}
            options={{
                title: 'Edit Match Information',
            }}
        />
        <Stack.Screen
            name="EditMatchScoresRR"
            component={EditMatchScoresRR}
            options={{
                title: 'Edit Match Scores',
            }}
        />
    </Stack.Navigator>
  );
}

export default TournamentStack