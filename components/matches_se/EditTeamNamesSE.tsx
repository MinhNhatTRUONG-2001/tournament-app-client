import { ScrollView, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { Formik } from "formik";
import * as yup from 'yup';
import { Text } from "react-native-paper";
import { useState } from "react";

const EditTeamNamesSE = ({ route, navigation }: any) => {
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
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const initialValues = {
        'team_1': matchInfo.team_1,
        'team_2': matchInfo.team_2,
    }

    const validationSchema = yup.object().shape({
        team_1: yup
            .string()
            .max(100, "The maximum characters is 100"),
        team_2: yup
            .string()
            .max(100, "The maximum characters is 100")
    })

    const updateTeamNames = (values: any) => {
        //console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/se/${matchInfo.id}/team_name/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
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
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/se/all/${data.stage_id}/${token}`)
                    .then(async response => {
                        if (response.ok) {
                            return response.json()
                        }
                        else throw new Error(await response.text())
                    })
                    .then(data2 => {
                        setMatchList(data2)
                        navigation.goBack()
                    })
                    .catch(console.error)
            })
            .catch((error: any) => {
                setServerErrorMessage(error.message)
            })
    }

    return (
        <Formik initialValues={initialValues} onSubmit={updateTeamNames} validationSchema={validationSchema}>
            {
                ({ handleSubmit }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <CustomTextInput name="team_1" label="Team 1" />
                            <CustomTextInput name="team_2" label="Team 2" />
                            <CustomButton buttonText="Update" onPress={handleSubmit} />
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default EditTeamNamesSE