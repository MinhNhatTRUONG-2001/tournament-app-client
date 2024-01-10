import { StyleSheet, Text, View } from "react-native";
import { primary } from "../../theme/colors";

const TournamentList = () => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <Text>Tournament List</Text>
        </View>
    )
}

export default TournamentList