import { StyleSheet, View } from "react-native";
import { error, primary } from "../../theme/colors";
import { List } from "react-native-paper";
import CustomButton from "../custom/CustomButton";

const TournamentInfo = ({ navigation, token, tournamentList, setTournamentList, tournamentInfo, setTournamentInfo }: any) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            padding: 5,
            margin: 5
        }
    });

    var displayedTournamentInfo = { ...tournamentInfo }
    delete displayedTournamentInfo["id"]
    delete displayedTournamentInfo["user_id"]

    const deleteTournament = () => {
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${tournamentInfo.id}/${token}`, { method: 'DELETE' })
        .then(() => {
            setTournamentList(tournamentList.filter((t: any) => t.id !== tournamentInfo.id))
            navigation.goBack()
        })
    }

    return (
        <View style={styles.container}>
            <List.Section>
                {
                    Object.entries(displayedTournamentInfo).map(([key, value]) => 
                        <List.Item
                            key={key}
                            title={key}
                            description={value as string}
                            style={styles.item}
                        />
                    )
                }
            </List.Section>
            <CustomButton buttonText="Edit" onPress={() => navigation.navigate("EditTournament", { navigation, token, tournamentList, setTournamentList, tournamentInfo, setTournamentInfo })} />
            <CustomButton buttonText="Delete" onPress={deleteTournament} buttonColor={error} />
        </View>
    )
}

export default TournamentInfo