import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const SignIn = () => {
    return (
        <View style={styles.container}>
            <TextInput placeholder="Username/Email" />
            <TextInput placeholder="Password" />
            <Pressable onPress={() => Alert.alert("Clicked!")}>
                <Text>Sign in</Text>
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

export default SignIn