import { ScrollView, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { primary } from "../../../theme/colors";

const ContactUs = () => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        }
    });
    
    return <View style={styles.container}>
        <ScrollView>
            <Text>Contact Us</Text>
        </ScrollView>
    </View>
}

export default ContactUs