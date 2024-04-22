import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { Checkbox, Text } from "react-native-paper"
import { error, primary, tertiary } from "../../../theme/colors";
import { Formik } from "formik";
import FormikCustomTextInput from "../../custom/FormikCustomTextInput";
import CustomButton from "../../custom/CustomButton";
import * as yup from 'yup';
import { useState } from "react";

const ChangePassword = ({ token }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        },
        text: {
            marginHorizontal: 5
        }
    });

    const initialValues = {
        'current_password': '',
        'new_password': '',
        'confirm_new_password': ''
    }

    const validationSchema = yup.object().shape({
        current_password: yup
            .string()
            .required("Current password is required"),
        new_password: yup
            .string()
            .min(8, "Password must have at least 8 characters")
            .max(64, "Password must have at most 64 characters")
            .matches(/[0-9]/, "At least one digit is required")
            .matches(/[a-z]/, "At least one lowercase letter is required")
            .matches(/[A-Z]/, "At least one uppercase letter is required")
            .matches(/\W|_/, "At least one special character is required")
            .required("New password is required"),
        confirm_new_password: yup
            .string()
            .oneOf([yup.ref("new_password")], "Passwords do not match")
    })

    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleChangingPassword = async (values: any, { resetForm }: any) => {
        setDisabledSubmitButton(true)
        const request_body = {
            "current_password": values["current_password"],
            "new_password": values["new_password"]
        }
        fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/change_password", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request_body),
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
        <Formik initialValues={initialValues} onSubmit={handleChangingPassword} validationSchema={validationSchema}>
            {
                ({ handleSubmit, resetForm }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <FormikCustomTextInput name="current_password" label="Current Password" secureTextEntry={!showPassword} />
                            <FormikCustomTextInput name="new_password" label="New Password" secureTextEntry={!showPassword} />
                            <FormikCustomTextInput name="confirm_new_password" label="Confirm New Password" secureTextEntry={!showPassword} />
                            <Checkbox.Item
                                label="Show password"
                                labelStyle={{ textAlign: 'left' }}
                                status={showPassword ? 'checked' : 'unchecked'}
                                onPress={() => { setShowPassword(!showPassword) }}
                                color={tertiary}
                                position="leading"
                                mode="android"
                            />
                            <CustomButton buttonText="Change" onPress={handleSubmit} disabled={disabledSubmitButton} />
                            <Text style={styles.errorText}>{errorMessage}</Text>
                            <Text style={styles.text}>Password requirements:</Text>
                            <Text style={styles.text}>{"\u2022"} 8-64 characters</Text>
                            <Text style={styles.text}>{"\u2022"} At least one digit (0-9)</Text>
                            <Text style={styles.text}>{"\u2022"} At least one lowercase letter (a-z)</Text>
                            <Text style={styles.text}>{"\u2022"} At least one uppercase letter (A-Z)</Text>
                            <Text style={styles.text}>{"\u2022"} At least one special character</Text>
                            <Text style={styles.text}>* Note: Do not add leading and trailing whitespaces. They will be removed after submitting.</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default ChangePassword