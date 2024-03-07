import { Alert, StyleSheet, View } from "react-native";
import { primary, tertiary } from "../../theme/colors";
import { List } from "react-native-paper";

const StageList = ({ navigation, token }: any) => {
    const styles = StyleSheet.create({
        container: {
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

    return (
        <View style={styles.container}>
            <List.Section>
                <List.Item
                    title="Stage 1"
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => Alert.alert("Stage clicked")}
                    style={styles.item}
                />
                <List.Item
                    title="Stage 2"
                    right={() => <List.Icon icon="chevron-right" />}
                    onPress={() => Alert.alert("Stage clicked")}
                    style={styles.item}
                />
            </List.Section>
        </View>
    )
}

export default StageList