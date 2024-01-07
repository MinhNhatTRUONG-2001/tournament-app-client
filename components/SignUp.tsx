import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const SignUp = () => {
    return (
        <View style={styles.container}>
            <TextInput placeholder="Username" />
            <TextInput placeholder="Email" />
            <TextInput placeholder="Password" />
            <TextInput placeholder="Confirm Password" />
            <Pressable onPress={() => Alert.alert("Clicked!")}>
                <Text>Sign up</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SignUp