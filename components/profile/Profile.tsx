import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { error, primary } from "../../theme/colors";
import SignIn from "./SignIn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import CustomButton from "../custom/CustomButton";
import { Text } from "react-native-paper";
import ProfileMenu from "./ProfileMenu";

const Profile = ({ navigation, token, setToken }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10
        }
    });

    const [userInfo, setUserInfo] = useState<any | undefined>(undefined)

    const getUserInformation = async () => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/get_user_information", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            const data = await response.json()

            if (data.isSuccess) {
                setUserInfo(data)
            } else {
                Alert.alert(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getToken = async () => {
        const result = await AsyncStorage.getItem("token")
        if (result !== null) {
            setToken(result)
        }
    };

    const handleSigningOut = async () => {
        await AsyncStorage.removeItem("token")
        setToken('')
        setUserInfo(undefined)
    };

    const handleDeletingAccount = () => {
        Alert.prompt(
            'Warning',
            'This action is irreversible and will delete all tournaments you created. If you want to do it, type your password to confirm',
            (input: string) => {
                fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/delete_user_account", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        'password': input
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.isSuccess) {
                        handleSigningOut()
                        Alert.alert('Success', data.message)
                    } else {
                        Alert.alert('Error', data.message)
                    }
                })
                .catch(console.error)
            },
            'secure-text'
        )
    }

    useEffect(() => {
        getToken()
        if (token) {
            getUserInformation()
        }
    }, [token])

    return (
        <View style={styles.container}>
            {token && userInfo
                ? <ScrollView>
                    <Text variant="titleMedium" style={styles.text}>You are signed in as: </Text>
                    <Text variant="titleLarge" style={styles.text}>{userInfo.username}</Text>
                    <ProfileMenu navigation={navigation} userInfo={userInfo} setUserInfo={setUserInfo} />
                    <CustomButton buttonText="Sign out" onPress={handleSigningOut} />
                    <CustomButton buttonText="Delete account" onPress={handleDeletingAccount} buttonColor={error} />
                </ScrollView>
                : <ScrollView>
                    <SignIn navigation={navigation} setToken={setToken} />
                </ScrollView>}
        </View>
    )
}

export default Profile