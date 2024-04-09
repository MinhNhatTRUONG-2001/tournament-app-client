import { ScrollView, StyleSheet, View } from "react-native";
import { primary, secondary } from "../../theme/colors";
import { useEffect, useState } from "react";
import { DataTable, SegmentedButtons } from "react-native-paper";

const MatchListRR = ({ navigation, token, stageId, includeThirdPlaceMatch  }: any) => {
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
        }
    });

    const [matchList, setMatchList] = useState<any[]>()
    const [groupNumberButtonProperties, setGroupNumberButtonProperties] = useState<any[]>([])
    const [selectedGroupNumber, setSelectedGroupNumber] = useState('1')

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/all/${stageId}/${token}`)
            .then(response => response.json())
            .then(data => {
                setMatchList(data)
                var groupNumberArray: any[] = []
                groupNumberArray = Array.from(new Set(data.map((match: any) => match.group_number))).sort()
                var groupNumberButtonPropertiesObject: any[] = []
                groupNumberArray.map((n) => groupNumberButtonPropertiesObject.push({ value: n.toString(), label: 'Group ' + n }))
                setGroupNumberButtonProperties(groupNumberButtonPropertiesObject)
            })
            .catch(console.error)
        }
        else {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/all/${stageId}`)
                .then(response => response.json())
                .then(data => {
                    setMatchList(data)
                    var groupNumberArray: any[] = []
                    groupNumberArray = Array.from(new Set(data.map((match: any) => match.group_number))).sort()
                    var groupNumberButtonPropertiesObject: any[] = []
                    groupNumberArray.map((n) => groupNumberButtonPropertiesObject.push({ value: n.toString(), label: 'Group ' + n }))
                    setGroupNumberButtonProperties(groupNumberButtonPropertiesObject)
                })
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            {(matchList && groupNumberButtonProperties) &&
                <>
                    <ScrollView horizontal>
                        <SegmentedButtons
                            theme={{ colors: { secondaryContainer: secondary }, roundness: 0 }}
                            style={styles.segmentedButtons}
                            value={selectedGroupNumber}
                            onValueChange={setSelectedGroupNumber}
                            buttons={groupNumberButtonProperties}
                        />
                    </ScrollView>
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
                                .map((match, index) => {
                                    var team1Name = match.team_1, team2Name = match.team_2
                                    if (match.winner && match.winner === match.team_1) {
                                        team1Name += ' *'
                                    }
                                    else if (match.winner && match.winner === match.team_2) {
                                        team2Name += ' *'
                                    }

                                    return <DataTable.Row key={index} onPress={() => navigation.navigate("MatchDetailsRR", { navigation, token, matchId: match.id, matchList, setMatchList })}>
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