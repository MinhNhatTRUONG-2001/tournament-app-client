import { ScrollView, StyleSheet, View } from "react-native";
import { primary, secondary } from "../../theme/colors";
import { useEffect, useState } from "react";
import { DataTable, SegmentedButtons } from "react-native-paper";

const MatchesSe = ({ navigation, token, stageId, includeThirdPlaceMatch  }: any) => {
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
    const [roundNumberButtonProperties, setRoundNumberButtonProperties] = useState<any[]>([])
    const [selectedGroupNumber, setSelectedGroupNumber] = useState('1')
    const [selectedRoundNumber, setSelectedRoundNumber] = useState('1')

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/se/all/${stageId}/${token}`)
                .then(response => response.json())
                .then(data => {
                    setMatchList(data)
                    var groupNumberArray: number[] = [], roundNumberArray: number[] = []
                    groupNumberArray = Array.from(new Set(data.map((match: any) => match.group_number)))
                    roundNumberArray = Array.from(new Set(data.map((match: any) => match.round_number)))
                    var groupNumberButtonPropertiesObject: any[] = [], roundNumberButtonPropertiesObject: any[] = []
                    groupNumberArray.map((n) => groupNumberButtonPropertiesObject.push({ value: n.toString(), label: 'Group ' + n }))
                    roundNumberArray.map((n) => roundNumberButtonPropertiesObject.push({ value: n.toString(), label: 'Round ' + n }))
                    if (includeThirdPlaceMatch) {
                        roundNumberButtonPropertiesObject[roundNumberArray.length - 1].label = "3rd Place"
                    }
                    setGroupNumberButtonProperties(groupNumberButtonPropertiesObject)
                    setRoundNumberButtonProperties(roundNumberButtonPropertiesObject)
                })
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            {(matchList && groupNumberButtonProperties && roundNumberButtonProperties) &&
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
                        <SegmentedButtons
                            theme={{ colors: { secondaryContainer: secondary }, roundness: 0 }}
                            style={styles.segmentedButtons}
                            value={selectedRoundNumber}
                            onValueChange={setSelectedRoundNumber}
                            buttons={roundNumberButtonProperties}
                        />
                    </ScrollView>
                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={{ width: 70, justifyContent: 'center' }}>Match</DataTable.Title>
                                <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>Team 1 Name</DataTable.Title>
                                <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Team 1 Score</DataTable.Title>
                                <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Team 2 Score</DataTable.Title>
                                <DataTable.Title style={{ width: 200, justifyContent: 'center' }}>Team 2 Name</DataTable.Title>
                                <DataTable.Title style={{ width: 170, justifyContent: 'center' }}>Winner's Next Round Match</DataTable.Title>
                            </DataTable.Header>
                            {matchList.filter(match => match.group_number.toString() === selectedGroupNumber && match.round_number.toString() === selectedRoundNumber)
                                .map((match, index) => {
                                    var team1Name = match.team_1, team2Name = match.team_2
                                    if (match.winner && match.winner === match.team_1) {
                                        team1Name += ' *'
                                    }
                                    else if (match.winner && match.winner === match.team_2) {
                                        team2Name += ' *'
                                    }
                                    var team1TotalScore = 0, team2TotalScore = 0
                                    if (match.team_1_scores) match.team_1_scores.forEach((n: number) => team1TotalScore += n)
                                    if (match.team_2_scores) match.team_2_scores.forEach((n: number) => team2TotalScore += n)
                                    var nextRoundMatchNumber = ''
                                    if (includeThirdPlaceMatch) {
                                        if (match.round_number < roundNumberButtonProperties.length - 1) {
                                            nextRoundMatchNumber = Math.floor((match.match_number + 1) / 2).toString()
                                        }
                                    }
                                    else {
                                        if (match.round_number < roundNumberButtonProperties.length) {
                                            nextRoundMatchNumber = Math.floor((match.match_number + 1) / 2).toString()
                                        }
                                    }

                                    return <DataTable.Row key={index} onPress={() => navigation.navigate("MatchDetailsSE", { navigation, token, matchId: match.id, matchList, setMatchList })}>
                                        <DataTable.Cell style={{ width: 70, justifyContent: 'center' }}>{match.match_number}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{team1Name}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{team1TotalScore}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{team2TotalScore}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 200, justifyContent: 'center' }}>{team2Name}</DataTable.Cell>
                                        <DataTable.Cell style={{ width: 170, justifyContent: 'center' }}>{nextRoundMatchNumber}</DataTable.Cell>
                                    </DataTable.Row>
                                }
                                )}
                        </DataTable>
                    </ScrollView>
                </>
            }
        </View>
    )
}

export default MatchesSe