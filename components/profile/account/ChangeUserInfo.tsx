import { Alert, ScrollView, StyleSheet, View } from "react-native"
import { Menu, Text } from "react-native-paper"
import { error, primary } from "../../../theme/colors";
import { Formik } from "formik";
import FormikCustomTextInput from "../../custom/FormikCustomTextInput";
import CustomButton from "../../custom/CustomButton";
import * as yup from 'yup';
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { countries, countryNames } from "../../../data/countries";

const ChangeUserInfo = ({ token }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        text: {
            marginHorizontal: 5,
            paddingTop: 5,
            paddingBottom: 5
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
        'email': userInfo.email,
        'country': userInfo.country,
        'phone': userInfo.phone
    }

    const validationSchema = yup.object().shape({
        username: yup
            .string()
            .max(50, "The maximum characters is 50")
            .required("Username is required"),
        country: yup
            .string(),
        phone: yup
            .string()
            .max(15, "The maximum characters is 15")
            .nullable()
            .matches(/^[1-9]\d{0,14}$/, "Phone number characters must be digits and no leading zero")
    })

    const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [showCountriesMenu, setShowCountriesMenu] = useState<boolean>(false);

    const handleChangingUserInfo = async (values: any) => {
        setDisabledSubmitButton(true)
        const request_body = {
            "username": values["username"],
            "country": values["country"],
            "phone": values["phone"]
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
                    setUserInfoCallback({
                        ...userInfo,
                        username: values["username"],
                        country: values["country"],
                        phone: values["phone"],
                        can_change_username: false
                    })
                    Alert.alert(data.message)
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
                ({ handleSubmit, values }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <FormikCustomTextInput name="id" label="User ID" disabled={true} />
                            <FormikCustomTextInput name="username" label="Username" disabled={!userInfo.can_change_username} />
                            {!userInfo.can_change_username && <Text style={styles.errorText}>
                                Username cannot be changed within 30 days since last change.
                                You can change it again from {userInfo.next_username_change_time}.
                            </Text>}
                            <FormikCustomTextInput name="email" label="Email" disabled={true} />
                            <Menu
                                visible={showCountriesMenu}
                                onDismiss={() => setShowCountriesMenu(false)}
                                anchor={<FormikCustomTextInput name="country" label="Country" editable={false} onPressIn={() => setShowCountriesMenu(true)} />}
                            >
                                <ScrollView>
                                    {countryNames.map(cn => <Menu.Item
                                        onPress={() => {
                                            values["country"] = cn
                                            setShowCountriesMenu(false)
                                        }}
                                        title={cn}
                                    />)}
                                </ScrollView>
                            </Menu>
                            <Text style={styles.text}>Dial code: {countries.find(c => c["name"] === values["country"]) ? countries.find(c => c["name"] === values["country"])["dial_code"] : ''}</Text>
                            <FormikCustomTextInput name="phone" label="Phone (no leading zero)" inputMode="tel" />
                            <CustomButton buttonText="Change" onPress={handleSubmit} disabled={disabledSubmitButton} />
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default ChangeUserInfo