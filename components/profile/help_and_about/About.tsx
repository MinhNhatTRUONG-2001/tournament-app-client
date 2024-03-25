import { ScrollView, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { primary } from "../../../theme/colors";

const About = () => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        }
    });
    
    return <View style={styles.container}>
        <ScrollView>
            <Text>About</Text>
        </ScrollView>
    </View>
}

export default About