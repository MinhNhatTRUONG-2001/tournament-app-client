import { Alert, ScrollView, StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { Formik } from "formik";
import * as yup from 'yup';
import { Divider, Text } from "react-native-paper";
import { useState } from "react";

const EditTeamNamesRR = ({ route }: any) => {
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

    const { token } = route.params
    const { setMatchList } = route.params
    const { matchInfo } = route.params
    const { setMatchInfo } = route.params
    const { setTableResults } = route.params
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const initialValues1 = {
        'old_team_name': matchInfo.team_1,
        'new_team_name': matchInfo.team_1,
    }
    const initialValues2 = {
        'old_team_name': matchInfo.team_2,
        'new_team_name': matchInfo.team_2,
    }

    const validationSchema = yup.object().shape({
        old_team_name: yup
            .string()
            .max(100, "The maximum characters is 100"),
        new_team_name: yup
            .string()
            .max(100, "The maximum characters is 100")
    })

    const updateTeamNames = (values: any) => {
        //console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/${matchInfo.id}/team_name`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(values),
        })
            .then(async response => {
                if (response.ok) {
                    return response.json()
                }
                else throw new Error(await response.text())
            })
            .then(data => {
                setMatchInfo(data)
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/all/${data.stage_id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(async response => {
                        if (response.ok) {
                            return response.json()
                        }
                        else throw new Error(await response.text())
                    })
                    .then(data2 => {
                        setMatchList(data2)
                        Alert.alert("Update successfully")
                    })
                    .catch(console.error)
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/table_results/${data.stage_id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                    .then(async response => {
                        if (response.ok) {
                            return response.json()
                        }
                        else throw new Error(await response.text())
                    })
                    .then(data => {
                        setTableResults(data)
                    })
                    .catch(console.error)
            })
            .catch((error: any) => {
                setServerErrorMessage(error.message)
            })
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Formik initialValues={initialValues1} onSubmit={updateTeamNames} validationSchema={validationSchema}>
                    {
                        ({ handleSubmit }) =>
                            <>
                                <FormikCustomTextInput name="new_team_name" label="Team 1" />
                                <CustomButton buttonText="Update" onPress={handleSubmit} />
                                <Text style={styles.errorText}>{serverErrorMessage}</Text>
                            </>
                    }
                </Formik>
                <Divider />
                <Formik initialValues={initialValues2} onSubmit={updateTeamNames} validationSchema={validationSchema}>
                    {
                        ({ handleSubmit }) =>
                            <>
                                <FormikCustomTextInput name="new_team_name" label="Team 2" />
                                <CustomButton buttonText="Update" onPress={handleSubmit} />
                                <Text style={styles.errorText}>{serverErrorMessage}</Text>
                            </>
                    }
                </Formik>
            </ScrollView>
        </View>
    )
}

export default EditTeamNamesRR