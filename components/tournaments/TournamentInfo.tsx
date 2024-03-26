import { Alert, StyleSheet, View } from "react-native";
import { error, primary } from "../../theme/colors";
import { List, Text } from "react-native-paper";
import CustomButton from "../custom/CustomButton";
import { useState } from "react";

const TournamentInfo = ({ navigation, token, tournamentList, setTournamentList, tournamentInfo, setTournamentInfo }: any) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            marginHorizontal: 5
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        }
    });

    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')
    var displayedTournamentInfo = { ...tournamentInfo }
    delete displayedTournamentInfo["id"]
    delete displayedTournamentInfo["user_id"]

    const deleteTournament = () => {
        Alert.prompt(
            "Confirm deletion",
            `Delete this tournament will delete all stages and matches connected to it. Type "${tournamentInfo.name}" to confirm.`,
            (input: string) => {
                if (input === tournamentInfo.name) {
                    fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${tournamentInfo.id}/${token}`, { method: 'DELETE' })
                    .then(() => {
                        setTournamentList(tournamentList.filter((t: any) => t.id !== tournamentInfo.id))
                        navigation.goBack()
                    })
                    .catch((error: any) => {
                        setServerErrorMessage(error.message)
                    })
                }
                else {
                    Alert.alert("Error", "The input is not correct")
                }
            })
    }

    return (
        <View style={styles.container}>
            <List.Section>
                {
                    Object.entries(displayedTournamentInfo).map(([key, value]: any) => {
                        var displayedValue: string = '' 
                        if (value.constructor === Array) {
                            displayedValue = value.length > 0 ? value.join('; ') : 'N/A'
                        }
                        else {
                            displayedValue = value ? value as string : 'N/A'
                        }
                        return <List.Item
                            key={key}
                            title={key}
                            description={displayedValue}
                            style={styles.item}
                        />
                    })
                }
            </List.Section>
            <CustomButton buttonText="Edit" onPress={() => navigation.navigate("EditTournament", { navigation, token, tournamentList, setTournamentList, tournamentInfo, setTournamentInfo })} />
            <CustomButton buttonText="Delete" onPress={deleteTournament} buttonColor={error} />
            <Text style={styles.errorText}>{serverErrorMessage}</Text>
        </View>
    )
}

export default TournamentInfo