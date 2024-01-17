import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { primary } from "../../../theme/colors";

const FAQ = () => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        }
    });
    
    return <View style={styles.container}>
        <Text>FAQ</Text>
    </View>
}

export default FAQ