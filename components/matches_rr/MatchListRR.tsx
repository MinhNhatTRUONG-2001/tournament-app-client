import { ScrollView, StyleSheet, View } from "react-native";
import { primary, secondary } from "../../theme/colors";
import { useEffect, useState } from "react";
import { DataTable, Divider, SegmentedButtons, Text } from "react-native-paper";

const MatchListRR = ({ navigation, token, stageId, stageInfo }: any) => {
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
        segmentedButtons: {
            margin: 5,
            borderRadius: 0
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10
        }
    });

    const [matchList, setMatchList] = useState<any[]>()
    const [tableResults, setTableResults] = useState<any[]>()
    const [groupNumberButtonProperties, setGroupNumberButtonProperties] = useState<any[]>([])
    const [selectedGroupNumber, setSelectedGroupNumber] = useState('1')

    const handleChangingGroupNumber = (value: string) => {
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/table_results/${stageId}/${value}`, {
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
                setTableResults(data)
            })
            .catch(console.error)
        setSelectedGroupNumber(value)
    }

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/all/${stageId}`, {
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
                    setMatchList(data)
                    var groupNumberArray: any[] = []
                    groupNumberArray = Array.from(new Set(data.map((match: any) => match.group_number))).sort()
                    var groupNumberButtonPropertiesObject: any[] = []
                    groupNumberArray.map((n) => groupNumberButtonPropertiesObject.push({ value: n.toString(), label: 'Group ' + n }))
                    setGroupNumberButtonProperties(groupNumberButtonPropertiesObject)
                })
                .catch(console.error)
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/table_results/${stageId}/1`, {
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
                    setTableResults(data)
                })
                .catch(console.error)
        }
        else {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/all/${stageId}`)
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => {
                    setMatchList(data)
                    var groupNumberArray: any[] = []
                    groupNumberArray = Array.from(new Set(data.map((match: any) => match.group_number))).sort()
                    var groupNumberButtonPropertiesObject: any[] = []
                    groupNumberArray.map((n) => groupNumberButtonPropertiesObject.push({ value: n.toString(), label: 'Group ' + n }))
                    setGroupNumberButtonProperties(groupNumberButtonPropertiesObject)
                })
                .catch(console.error)
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/table_results/${stageId}/1`)
                .then(async response => {
                    if (response.ok) {
                        return response.json()
                    }
                    else throw new Error(await response.text())
                })
                .then(data => {
                    setTableResults(data)
                })
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            {(matchList && tableResults && groupNumberButtonProperties) &&
                <>
                    <ScrollView horizontal>
                        <SegmentedButtons
                            theme={{ colors: { secondaryContainer: secondary }, roundness: 0 }}
                            style={styles.segmentedButtons}
                            value={selectedGroupNumber}
                            onValueChange={(value) => handleChangingGroupNumber(value)}
                            buttons={groupNumberButtonProperties}
                        />
                    </ScrollView>
                    <Text variant="titleMedium" style={styles.text}>Table results</Text>
                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={{ width: 70, justifyContent: 'center' }}>Rank</DataTable.Title>
                                <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>Team</DataTable.Title>
                                <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Points</DataTable.Title>
                                <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>Difference</DataTable.Title>
                                <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>Earned score</DataTable.Title>
                                {stageInfo.other_criteria_names && stageInfo.other_criteria_names.map((name: string) => <DataTable.Title style={{ width: 150, justifyContent: 'center' }}>{name}</DataTable.Title>)}
                            </DataTable.Header>
                            {tableResults.map((result: any, index: number) =>
                                    <DataTable.Row key={index}>
                                        <DataTable.Cell style={{ width: 70, justifyContent: 'center' }}>{index + 1}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{result.name}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{result.points}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{result.difference > 0 ? "+" + result.difference : result.difference}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{result.accumulated_score}</DataTable.Cell>
                                        {result.other_criteria_values && result.other_criteria_values.map((value: number) => <DataTable.Cell style={{ width: 150, justifyContent: 'center' }}>{value}</DataTable.Cell>)}
                                    </DataTable.Row>
                                )
                            }
                        </DataTable>
                    </ScrollView>
                    <Divider />
                    <Text variant="titleMedium" style={styles.text}>Match List</Text>
                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={{ width: 70, justifyContent: 'center' }}>Leg</DataTable.Title>
                                <DataTable.Title style={{ width: 70, justifyContent: 'center' }}>Match</DataTable.Title>
                                <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>Team 1 Name</DataTable.Title>
                                <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Team 1 Score</DataTable.Title>
                                <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Team 2 Score</DataTable.Title>
                                <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>Team 2 Name</DataTable.Title>
                            </DataTable.Header>
                            {matchList.filter(match => match.group_number.toString() === selectedGroupNumber)
                                .sort((a: any, b: any) => a.leg_number - b.leg_number)
                                .sort((a: any, b: any) => a.match_number - b.match_number)
                                .map((match, index) => {
                                    var team1Name = match.team_1, team2Name = match.team_2
                                    if (match.winner && match.winner === match.team_1) {
                                        team1Name += ' *'
                                    }
                                    else if (match.winner && match.winner === match.team_2) {
                                        team2Name += ' *'
                                    }

                                    return <DataTable.Row key={index} onPress={() => navigation.navigate("MatchDetailsRR", { navigation, token, stageInfo, matchId: match.id, matchList, setMatchList, setTableResults })}>
                                        <DataTable.Cell style={{ width: 70, justifyContent: 'center' }}>{match.leg_number}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 70, justifyContent: 'center' }}>{match.match_number}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{team1Name}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{match.team_1_score}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{match.team_2_score}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{team2Name}</DataTable.Cell>
                                    </DataTable.Row>
                                })
                            }
                        </DataTable>
                    </ScrollView>
                </>
            }
        </View>
    )
}

export default MatchListRR