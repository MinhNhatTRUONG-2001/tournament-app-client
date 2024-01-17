import { StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import { error, primary } from "../../theme/colors";
import CustomButton from "../custom/CustomButton";
import { Divider, Text } from "react-native-paper";
import { Formik } from "formik";
import * as yup from 'yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const SignIn = ({ navigation, setToken }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        text: {
            alignSelf: 'center',
            paddingTop: 10,
            paddingBottom: 5
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        }
    });

    const initialValues = {
        'username_or_email': '',
        'password': ''
    }

    const validationSchema = yup.object().shape({
        username_or_email: yup
            .string()
            .required("Username or Email is required"),
        password: yup
            .string()
            .required("Password is required"),
    })

    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSigningIn = async (values: any) => {
        fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/sign_in", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(response => response.json())
        .then(async data => {
            if (data.isSuccess) {
                setErrorMessage('')
                await AsyncStorage.setItem("token", data.token)
                setToken(data.token)
                navigation.navigate('TournamentList')
            }
            else {
                setErrorMessage(data.message)
            }
        })
        .catch(console.error)
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSigningIn} validationSchema={validationSchema}>
            {
                ({ handleSubmit }) =>
                    <View style={styles.container}>
                        <Text variant="titleMedium" style={styles.text}>
                            You haven't signed in yet. Sign in here:
                        </Text>
                        <CustomTextInput name="username_or_email" label="Username or Email" inputMode="email" />
                        <CustomTextInput name="password" label="Password" secureTextEntry={true} />
                        <CustomButton buttonText="Sign in" onPress={handleSubmit} />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                        <Divider />
                        <Text variant="titleMedium" style={styles.text}>
                            Don't have an account yet? Create here:
                        </Text>
                        <CustomButton buttonText="Create account" onPress={() => navigation.navigate("SignUp")} />
                    </View>
            }
        </Formik>
    )
}

export default SignIn