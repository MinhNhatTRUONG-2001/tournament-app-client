import { StyleSheet, View } from "react-native";
import { primary, tertiary } from "../../theme/colors";
import { List, Text } from "react-native-paper";
import CustomButton from "../custom/CustomButton";
import { useEffect, useState } from "react";

const TournamentList = ({ navigation, token }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        container2: {
            flex: 1,
            backgroundColor: primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        item: {
            borderWidth: 1.5,
            borderStyle: "solid",
            borderColor: tertiary,
            borderRadius: 5,
            padding: 5,
            margin: 5
        }
    });

    const [tournamentList, setTournamentList] = useState<any[]>()

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/all/${token}`)
                .then(response => response.json())
                .then(data => setTournamentList(data))
                .catch(console.error)
        }
    }, [token])

    return (
        <View style={styles.container}>
            {token ? (
                tournamentList ? (
                    <>
                        <List.Section>
                            {tournamentList.map((t: any) => (
                                <List.Item
                                    key={t.id}
                                    title={t.name}
                                    right={() => <List.Icon icon="chevron-right" />}
                                    onPress={() => navigation.navigate("TournamentDetails", { navigation, token, id: t.id, tournamentList, setTournamentList })}
                                    style={styles.item}
                                />
                            ))}
                        </List.Section>
                        <CustomButton
                            buttonText="New tournament"
                            icon="plus"
                            onPress={() => navigation.navigate("NewTournament", { navigation, token, tournamentList, setTournamentList })}
                        />
                    </>
                ) : (
                    <View style={styles.container2}>
                        <Text>Loading...</Text>
                    </View>
                )
            ) : (
                <View style={styles.container2}>
                    <Text>Please sign in to see your tournament list.</Text>
                </View>
            )}
        </View>
    )
}

export default TournamentList