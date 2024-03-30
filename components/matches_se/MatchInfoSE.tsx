import { ScrollView, StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import { DataTable, Text } from "react-native-paper";
import { getTimezone } from "../../data/getTimezone";

const MatchInfoSE = ({ matchInfo }: any) => {
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
        legText: {
            marginHorizontal: 10,
            marginVertical: 5,
            fontSize: 14,
            fontWeight: 'bold',
            fontStyle: 'italic'
        }
    });

    var team1TotalScore = 0, team2TotalScore = 0
    if (matchInfo.team_1_scores) matchInfo.team_1_scores.forEach((n: number) => team1TotalScore += n)
    if (matchInfo.team_2_scores) matchInfo.team_2_scores.forEach((n: number) => team2TotalScore += n)
    var probe = 0, totalSets: any[] = [], team1Subscores: any[] = [], team2Subscores: any[] = []
    if (matchInfo.team_1_subscores && matchInfo.team_2_subscores && matchInfo.team_1_scores && matchInfo.team_2_scores) {
        for (var i = 0; i < matchInfo.number_of_legs; i++) {
            var totalSet = matchInfo.team_1_scores[i] + matchInfo.team_2_scores[i]
            console.log(totalSet)
            var team1Subscore = [], team2Subscore = [], endOfLegPos = probe + totalSet
            for (var j = probe; j < endOfLegPos; j++) {
                team1Subscore.push(matchInfo.team_1_subscores[j])
                team2Subscore.push(matchInfo.team_2_subscores[j])
                probe++
            }
            totalSets.push(totalSet)
            team1Subscores.push(team1Subscore)
            team2Subscores.push(team2Subscore)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.keyText}>Group: 
                <Text style={styles.valueText}> {matchInfo.group_number}</Text>
            </Text>
            <Text style={styles.keyText}>Round:
                <Text style={styles.valueText}> {matchInfo.round_number}</Text>
            </Text>
            <Text style={styles.keyText}>Match:
                <Text style={styles.valueText}> {matchInfo.match_number}</Text>
            </Text>
            <Text style={styles.keyText}>Legs:
                <Text style={styles.valueText}> {matchInfo.number_of_legs}</Text>
            </Text>
            <Text style={styles.keyText}>Best of:
                <Text style={styles.valueText}> {matchInfo.best_of !== 0 ? matchInfo.best_of : 'None'}</Text>
            </Text>
            <Text style={styles.keyText}>Start datetime:
                <Text style={styles.valueText}> {matchInfo.start_datetime ? `${new Date(matchInfo.start_datetime).toLocaleString()} (UTC${getTimezone(new Date(matchInfo.start_datetime))})` : 'N/A'}</Text>
            </Text>
            <Text style={styles.keyText}>Place:
                <Text style={styles.valueText}> {matchInfo.place ? matchInfo.place : 'N/A'}</Text>
            </Text>
            <Text style={styles.keyText}>Note:
                <Text style={styles.valueText}> {matchInfo.note ? matchInfo.note : 'N/A'}</Text>
            </Text>
            <Text style={styles.keyText}>Total score:
                <Text style={styles.valueText}> {matchInfo.team_1}   {team1TotalScore} - {team2TotalScore}   {matchInfo.team_2}</Text>
            </Text>
            {
                [...Array(matchInfo.number_of_legs)].map((_, index) =>
                    <>
                        {(matchInfo.team_1_scores && matchInfo.team_2_scores) &&
                            <Text key={index} style={styles.legText}>{"\u2022"} Leg {index + 1}:
                                <Text style={styles.valueText}> {matchInfo.team_1}   {matchInfo.team_1_scores[index]} - {matchInfo.team_2_scores[index]}   {matchInfo.team_2}</Text>
                            </Text>
                        }
                        {(matchInfo.team_1_subscores && matchInfo.team_2_subscores) &&
                            <ScrollView horizontal>
                                <DataTable>
                                    <DataTable.Row>
                                        <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Set</DataTable.Title>
                                        {[...Array(totalSets[index])].map((_, index) => <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{index + 1}</DataTable.Cell>)}
                                    </DataTable.Row>
                                    <DataTable.Row>
                                        <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Team 1</DataTable.Title>
                                        {team1Subscores[index].map((value: any) => <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{value}</DataTable.Cell>)}
                                    </DataTable.Row>
                                    <DataTable.Row>
                                        <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Team 2</DataTable.Title>
                                        {team2Subscores[index].map((value: any) => <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{value}</DataTable.Cell>)}
                                    </DataTable.Row>
                                </DataTable>
                            </ScrollView>
                        } 
                    </>
                )
            }
        </View>
    )
}

export default MatchInfoSE