import { Alert, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import { error, primary } from "../../theme/colors";
import CustomButton from "../custom/CustomButton";
import { Text } from "react-native-paper";
import { Formik } from "formik";
import * as yup from 'yup';
import { useState } from "react";

const ForgotPassword = () => {
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
        'email': ''
    }

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email("Email address is invalid")
            .max(50, "The maximum characters is 50")
            .required("Email is required"),
    })

    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSendingEmail = async (values: any, { resetForm }: any) => {
        setDisabledSubmitButton(true)
        fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/forgot_password", {
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
                Alert.alert(data.message)
                resetForm()
            }
            else {
                setErrorMessage(data.message)
            }
        })
        .catch(console.error)
        setDisabledSubmitButton(false)
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleSendingEmail} validationSchema={validationSchema}>
            {
                ({ handleSubmit, resetForm }) =>
                    <View style={styles.container}>
                        <Text variant="titleMedium" style={styles.text}>
                            Enter your registered email address to send a request for the password reset
                        </Text>
                        <CustomTextInput name="email" label="Email" inputMode="email" />
                        <CustomButton buttonText="Reset password" onPress={handleSubmit} disabled={disabledSubmitButton} />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
            }
        </Formik>
    )
}

export default ForgotPassword