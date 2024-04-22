import { ScrollView, StyleSheet, View } from "react-native";
import { primary, tertiary } from "../../theme/colors";
import { Divider, List, Searchbar, Text } from "react-native-paper";
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
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10,
            paddingBottom: 5
        },
        searchbar: {
            marginTop: 5,
            marginHorizontal: 5
        }
    });

    const [tournamentList, setTournamentList] = useState<any[]>()
    const [searchTournamentList, setSearchTournamentList] = useState<string>('')
    const [displayedTournamentList, setDisplayedTournamentList] = useState<any[]>()
    const [publicTournamentList, setPublicTournamentList] = useState<any[]>()
    const [searchPublicTournamentList, setSearchPublicTournamentList] = useState<string>('')
    const [displayedPublicTournamentList, setDisplayedPublicTournamentList] = useState<any[]>()

    const filterDisplayedTournamentList = (query: string) => {
        setSearchTournamentList(query)
        setDisplayedTournamentList(tournamentList?.filter(t => t.name.toLowerCase().includes(query.trim().toLowerCase())))
    }

    const filterDisplayedPublicTournamentList = (query: string) => {
        setSearchPublicTournamentList(query)
        setDisplayedPublicTournamentList(publicTournamentList?.filter(pt => pt.name.toLowerCase().includes(query.trim().toLowerCase())))
    }

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/all`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            })
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => {
                    setTournamentList(data)
                    setDisplayedTournamentList(data)
                })
                .catch(console.error)
        }
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/public`)
            .then(async response => {
                if (response.ok) {
                    return response.json()
                }
                else throw new Error(await response.text())
            })
            .then(data => {
                setPublicTournamentList(data)
                setDisplayedPublicTournamentList(data)
            })
            .catch(console.error)
    }, [token])

    return (
        <View style={styles.container}>
            <ScrollView>
                {token ? (
                    tournamentList ? (
                        <>
                            <Searchbar
                                placeholder="Search"
                                onChangeText={query => filterDisplayedTournamentList(query)}
                                value={searchTournamentList}
                                style={styles.searchbar}
                                theme={{ colors: { primary: tertiary } }}
                            />
                            {displayedTournamentList &&
                                <List.Section>
                                    {displayedTournamentList.map((t: any) => (
                                        <List.Item
                                            key={t.id}
                                            title={t.name}
                                            right={() => <List.Icon icon="chevron-right" />}
                                            onPress={() => navigation.navigate("TournamentDetails", {
                                                navigation, token, tournamentId: t.id, tournamentList, setTournamentList,
                                                setDisplayedTournamentList, publicTournamentList, setDisplayedPublicTournamentList,
                                                setSearchTournamentList, setSearchPublicTournamentList
                                            })}
                                            style={styles.item}
                                        />
                                    ))}
                                </List.Section>
                            }
                            <CustomButton
                                buttonText="New tournament"
                                icon="plus"
                                onPress={() => navigation.navigate("NewTournament", {
                                    navigation, token, tournamentList, setTournamentList,
                                    setDisplayedTournamentList, publicTournamentList, setDisplayedPublicTournamentList,
                                    setSearchTournamentList, setSearchPublicTournamentList
                                })}
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
                <Divider />
                <Text variant="titleMedium" style={styles.text}>
                    All public tournaments
                </Text>
                <Searchbar
                    placeholder="Search"
                    onChangeText={query => filterDisplayedPublicTournamentList(query)}
                    value={searchPublicTournamentList}
                    style={styles.searchbar}
                    theme={{ colors: { primary: tertiary } }}
                />
                {displayedPublicTournamentList &&
                    <List.Section>
                        {displayedPublicTournamentList.map((t: any) => (
                            <List.Item
                                key={t.id}
                                title={t.name}
                                right={() => <List.Icon icon="chevron-right" />}
                                onPress={() => navigation.navigate("TournamentDetails", { navigation, tournamentId: t.id })}
                                style={styles.item}
                            />
                        ))}
                    </List.Section>
                }
            </ScrollView>
        </View>
    )
}

export default TournamentList