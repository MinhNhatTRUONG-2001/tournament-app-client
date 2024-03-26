import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { primary, secondary } from "../../theme/colors";
import { useEffect, useState } from "react";
import { DataTable, SegmentedButtons, Text } from "react-native-paper";
import CustomButton from "../custom/CustomButton";

const MatchesSe = ({ navigation, token, stageId, includeThirdPlaceMatch }: any) => {
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

    const [matches, setMatches] = useState<any[]>()
    const [groupNumberButtonProperties, setGroupNumberButtonProperties] = useState<any[]>([])
    const [roundNumberButtonProperties, setRoundNumberButtonProperties] = useState<any[]>([])
    const [selectedGroupNumber, setSelectedGroupNumber] = useState('1')
    const [selectedRoundNumber, setSelectedRoundNumber] = useState('1')

    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/se/all/${stageId}/${token}`)
                .then(response => response.json())
                .then(data => {
                    setMatches(data)
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
            {(matches && groupNumberButtonProperties && roundNumberButtonProperties) &&
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
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>ID</DataTable.Title>
                            <DataTable.Title>Match Number</DataTable.Title>
                            <DataTable.Title>Team 1 Name</DataTable.Title>
                            <DataTable.Title>Team 1 Total Score</DataTable.Title>
                            <DataTable.Title>Team 2 Total Score</DataTable.Title>
                            <DataTable.Title>Team 2 Name</DataTable.Title>
                            <DataTable.Title> </DataTable.Title>
                        </DataTable.Header>
                        {matches.filter(match => match.group_number.toString() === selectedGroupNumber && match.round_number.toString() === selectedRoundNumber)
                            .map((match, index) => {
                                var team1Name = match.team_1_name, team2Name = match.team_2_name
                                if (match.winner === match.team_1_name) {
                                    team1Name += ' *'
                                }
                                else if (match.winner === match.team_2_name) {
                                    team2Name += ' *'
                                }
                                var team1TotalScore = 0, team2TotalScore = 0
                                if (match.team_1_scores) match.team_1_scores.forEach((n: number) => team1TotalScore += n);
                                if (match.team_2_scores) match.team_2_scores.forEach((n: number) => team2TotalScore += n);
                                return <DataTable.Row key={index}>
                                    <DataTable.Cell>{match.id}</DataTable.Cell>
                                    <DataTable.Cell>{match.match_number}</DataTable.Cell>
                                    <DataTable.Cell>{team1Name}</DataTable.Cell>
                                    <DataTable.Cell>{match.team1TotalScore}</DataTable.Cell>
                                    <DataTable.Cell>{match.team2TotalScore}</DataTable.Cell>
                                    <DataTable.Cell>{team2Name}</DataTable.Cell>
                                    <DataTable.Cell>{<CustomButton buttonText='Details' onPress={() => Alert.alert('View details')} />}</DataTable.Cell>
                                </DataTable.Row>
                        }
                        )}
                    </DataTable>
                </>
            }
        </View>
    )
}

export default MatchesSe