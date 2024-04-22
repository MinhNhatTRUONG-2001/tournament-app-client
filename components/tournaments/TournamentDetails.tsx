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
    const { setDisplayedTournamentList } = route.params
    const { publicTournamentList } = route.params
    const { setDisplayedPublicTournamentList } = route.params
    const { setSearchTournamentList } = route.params
    const { setSearchPublicTournamentList } = route.params
    const [tournamentInfo, setTournamentInfo] = useState<any>()
    const [username, setUsername] = useState<string>('')

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${tournamentId}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => {
                    setTournamentInfo(data)
                    fetch(`${process.env.EXPO_PUBLIC_AUTH_SERVER_URL}/username/${data.user_id}`)
                        .then(response => response.json())
                        .then((data) => {
                            if (data.isSuccess) {
                                setUsername(data.username)
                            }
                        })
                        .catch(console.error)
                })
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
                .then(data => {
                    setTournamentInfo(data)
                    fetch(`${process.env.EXPO_PUBLIC_AUTH_SERVER_URL}/username/${data.user_id}`)
                        .then(response => response.json())
                        .then((data) => {
                            if (data.isSuccess) {
                                setUsername(data.username)
                            }
                        })
                        .catch(console.error)
                })
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
                    username={username}
                    tournamentList={tournamentList}
                    setTournamentList={setTournamentList}
                    tournamentInfo={tournamentInfo}
                    setTournamentInfo={setTournamentInfo}
                    setDisplayedTournamentList={setDisplayedTournamentList}
                    publicTournamentList={publicTournamentList}
                    setDisplayedPublicTournamentList={setDisplayedPublicTournamentList}
                    setSearchTournamentList={setSearchTournamentList}
                    setSearchPublicTournamentList={setSearchPublicTournamentList} />
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