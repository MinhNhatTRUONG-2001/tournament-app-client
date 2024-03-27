import { StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import { Text } from "react-native-paper";
import { deviceTimezone } from "../../data/deviceTimezone";

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
    });
    
    var displayedMatchInfo = { ...matchInfo }
    delete displayedMatchInfo["id"]
    delete displayedMatchInfo["stage_id"]

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
                <Text style={styles.valueText}> {matchInfo.start_datetime ? `${new Date(matchInfo.start_datetime).toLocaleString()} (UTC${deviceTimezone})` : 'N/A'}</Text>
            </Text>
            <Text style={styles.keyText}>Place:
                <Text style={styles.valueText}> {matchInfo.place ? matchInfo.place : 'N/A'}</Text>
            </Text>
            <Text style={styles.keyText}>Note:
                <Text style={styles.valueText}> {matchInfo.note ? matchInfo.note : 'N/A'}</Text>
            </Text>
        </View>
    )
}

export default MatchInfoSE