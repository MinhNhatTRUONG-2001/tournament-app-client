import { Alert, StyleSheet, View } from "react-native";
import { error, primary } from "../../theme/colors";
import { Text } from "react-native-paper";
import CustomButton from "../custom/CustomButton";
import { useState } from "react";
import { getTimezone } from "../../data/getTimezone";

const TournamentInfo = ({ navigation, token, username, tournamentList, setTournamentList, tournamentInfo, setTournamentInfo, setDisplayedTournamentList, publicTournamentList, setDisplayedPublicTournamentList, setSearchTournamentList, setSearchPublicTournamentList }: any) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            marginHorizontal: 5
        },
        keyText: {
            marginHorizontal: 10,
            marginVertical: 5,
            fontSize: 16,
            fontWeight: 'bold'
        },
        valueText: {
            fontWeight: 'normal'
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        }
    });

    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const deleteTournament = () => {
        Alert.prompt(
            "Confirm deletion",
            `Delete this tournament will delete all stages and matches connected to it. Type "${tournamentInfo.name}" to confirm.`,
            (input: string) => {
                if (input.trim() === tournamentInfo.name) {
                    fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${tournamentInfo.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    })
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
            {(tournamentInfo && username) &&
                <>
                    <Text style={styles.keyText}>Name:
                        <Text style={styles.valueText}> {tournamentInfo.name}</Text>
                    </Text>
                    <Text style={styles.keyText}>User:
                        <Text style={styles.valueText}> {username}</Text>
                    </Text>
                    <Text style={styles.keyText}>Start date:
                        <Text style={styles.valueText}> {tournamentInfo.start_date ? `${new Date(tournamentInfo.start_date).toLocaleString()} (UTC${getTimezone(new Date(tournamentInfo.start_date))})` : 'N/A'}</Text>
                    </Text>
                    <Text style={styles.keyText}>End date:
                        <Text style={styles.valueText}> {tournamentInfo.end_date ? `${new Date(tournamentInfo.end_date).toLocaleString()} (UTC${getTimezone(new Date(tournamentInfo.end_date))})` : 'N/A'}</Text>
                    </Text>
                    <Text style={styles.keyText}>Places:
                        <Text style={styles.valueText}> {tournamentInfo.places.length > 0 ? tournamentInfo.places.join('; ') : 'N/A'}</Text>
                    </Text>
                    <Text style={styles.keyText}>Description:
                        <Text style={styles.valueText}> {tournamentInfo.description ? tournamentInfo.description : 'N/A'}</Text>
                    </Text>
                    {token &&
                        <>
                            <CustomButton buttonText="Edit" onPress={() => navigation.navigate("EditTournament", {
                                navigation, token, tournamentList, setTournamentList, tournamentInfo, setTournamentInfo,
                                setDisplayedTournamentList, publicTournamentList, setDisplayedPublicTournamentList,
                                setSearchTournamentList, setSearchPublicTournamentList
                            })} />
                            <CustomButton buttonText="Delete" onPress={deleteTournament} buttonColor={error} />
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                        </>
                    }
                </>
            }
        </View>
    )
}

export default TournamentInfo