import { ScrollView, StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import { Divider, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import TournamentInfo from "./TournamentInfo";
import StageList from "../stages/StageList";

const TournamentDetails = ({ route, navigation }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            padding: 5,
            margin: 5
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10
        }
    });

    const { token } = route.params
    const { tournamentId } = route.params
    const { tournamentList } = route.params
    const { setTournamentList } = route.params
    const [tournamentInfo, setTournamentInfo] = useState<any>()
    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${tournamentId}/${token}`)
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => setTournamentInfo(data))
                .catch(console.error)
        }
        else {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${tournamentId}`)
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => setTournamentInfo(data))
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text variant="titleMedium" style={styles.text}>Tournament information</Text>
                <TournamentInfo
                    navigation={navigation}
                    token={token}
                    tournamentList={tournamentList}
                    setTournamentList={setTournamentList}
                    tournamentInfo={tournamentInfo}
                    setTournamentInfo={setTournamentInfo} />
                <Divider />
                <Text variant="titleMedium" style={styles.text}>Stage list</Text>
                <StageList
                    navigation={navigation}
                    token={token}
                    tournamentId={tournamentId}
                />
            </ScrollView>
        </View>
    )
}

export default TournamentDetails