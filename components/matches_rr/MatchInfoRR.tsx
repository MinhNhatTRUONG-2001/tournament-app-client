import { ScrollView, StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import { DataTable, Text } from "react-native-paper";
import { getTimezone } from "../../data/getTimezone";

const MatchInfoRR = ({ matchInfo }: any) => {
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

    return (
        <View style={styles.container}>
            <Text style={styles.keyText}>Group: 
                <Text style={styles.valueText}> {matchInfo.group_number}</Text>
            </Text>
            <Text style={styles.keyText}>Leg:
                <Text style={styles.valueText}> {matchInfo.leg_number}</Text>
            </Text>
            <Text style={styles.keyText}>Match:
                <Text style={styles.valueText}> {matchInfo.match_number}</Text>
            </Text>
            <Text style={styles.keyText}>Best of:
                <Text style={styles.valueText}> {matchInfo.team_1_subscores.length !== 0 ? matchInfo.matchInfo.team_1_subscores.length : 'None'}</Text>
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
            <Text style={styles.keyText}>Score:
                <Text style={styles.valueText}> {matchInfo.team_1}   {matchInfo.team_1_score} - {matchInfo.team_2_score}   {matchInfo.team_2}</Text>
            </Text>
            {(matchInfo.team_1_subscores && matchInfo.team_2_subscores) &&
                <ScrollView horizontal>
                    <DataTable>
                        <DataTable.Row>
                            <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>Set</DataTable.Title>
                            {[...Array(matchInfo.team_1_subscores.length)].map((_, index) => <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{index + 1}</DataTable.Cell>)}
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>{matchInfo.team_1}</DataTable.Title>
                            {matchInfo.team_1_subscores.map((value: any) => <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{value}</DataTable.Cell>)}
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Title style={{ width: 100, justifyContent: 'center' }}>{matchInfo.team_2}</DataTable.Title>
                            {matchInfo.team_2_subscores.map((value: any) => <DataTable.Cell style={{ width: 100, justifyContent: 'center' }}>{value}</DataTable.Cell>)}
                        </DataTable.Row>
                    </DataTable>
                </ScrollView>
            }
        </View>
    )
}

export default MatchInfoRR