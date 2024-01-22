import { Alert, StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import { error, primary } from "../../../theme/colors";
import { Formik } from "formik";
import CustomTextInput from "../../custom/CustomTextInput";
import CustomButton from "../../custom/CustomButton";
import * as yup from 'yup';
import { useState } from "react";
import { useRoute } from "@react-navigation/native";

const ChangeUserInfo = ({ navigation, token }: any) => {
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
        }
    });

    const route = useRoute()
    const { userInfo }: any = route.params
    const { setUserInfoCallback }: any = route.params

    const initialValues = {
        'id': String(userInfo.id),
        'username': userInfo.username,
        'email': userInfo.email
    }

    const validationSchema = yup.object().shape({
        username: yup
            .string()
            .max(50, "The maximum characters is 50")
            .required("Username is required")
    })

    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleChangingUserInfo = async (values: any, { resetForm }: any) => {
        setDisabledSubmitButton(true)
        const request_body = {
            "username": values["username"],
        }
        fetch(process.env.EXPO_PUBLIC_AUTH_SERVER_URL + "/change_user_information", {
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
                setUserInfoCallback({...userInfo, username: values["username"], can_change_username: false})
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
        <Formik initialValues={initialValues} onSubmit={handleChangingUserInfo} validationSchema={validationSchema}>
            {
                ({ handleSubmit, resetForm }) =>
                    <View style={styles.container}>
                        <CustomTextInput name="id" label="User ID" disabled={true}/>
                        <CustomTextInput name="username" label="Username" disabled={!userInfo.can_change_username} />
                        {!userInfo.can_change_username && <Text style={styles.errorText}>
                            Username cannot be changed within 30 days since last change.
                            You can change it again from {userInfo.next_username_change_time}.
                        </Text>}
                        <CustomTextInput name="email" label="Email" disabled={true} />
                        <CustomButton buttonText="Change" onPress={handleSubmit} disabled={disabledSubmitButton} />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
            }
        </Formik>
    )
}

export default ChangeUserInfo