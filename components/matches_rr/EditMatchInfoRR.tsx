import { ScrollView, StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { Formik } from "formik";
import * as yup from 'yup';
import { Text } from "react-native-paper";
import { useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

const EditMatchInfoRR = ({ route, navigation }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        container2: {
            backgroundColor: primary,
            flexDirection: 'row',
        },
        datetimeContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
        },
        text: {
            marginHorizontal: 5
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        },
        multilineTextInput: {
            minHeight: 100,
            textAlignVertical: 'top',
            marginHorizontal: 5,
            marginBottom: 10
        }
    });

    const { token } = route.params
    const { matchList } = route.params
    const { setMatchList } = route.params
    const { matchInfo } = route.params
    const { setMatchInfo } = route.params
    const [startDatetime, setStartDatetime] = useState(matchInfo.start_datetime ? new Date(matchInfo.start_datetime) : (new Date(Date.now())))
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const initialValues = {
        'start_datetime': startDatetime.toISOString(),
        'place': matchInfo.place,
        'note': matchInfo.note,
    }

    const validationSchema = yup.object().shape({
        start_datetime: yup
            .date(),
    })

    const changeStartDatetime = (event: DateTimePickerEvent, date: Date | undefined, values: any) => {
        if (event.type === "set" && date !== undefined) {
            values["start_datetime"] = date?.toISOString()
            setStartDatetime(date)
        }
    }

    const updateMatchInfo = (values: any) => {
        //console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/${matchInfo.id}/match_info`, {
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
                setMatchList(matchList.map((m: any) => m.id === matchInfo.id ? data : m))
                setMatchInfo(data)
                navigation.goBack()
            })
            .catch((error: any) => {
                setServerErrorMessage(error.message)
            })
    }

    return (
        <Formik initialValues={initialValues} onSubmit={updateMatchInfo} validationSchema={validationSchema}>
            {
                ({ handleSubmit, values }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <Text style={styles.text}>Start datetime</Text>
                            <View style={styles.datetimeContainer}>
                                <View>
                                    <RNDateTimePicker
                                        value={startDatetime}
                                        mode="date"
                                        onChange={(event, date) => changeStartDatetime(event, date, values)}
                                    />
                                </View>
                                <View>
                                    <RNDateTimePicker
                                        value={startDatetime}
                                        mode="time"
                                        onChange={(event, date) => changeStartDatetime(event, date, values)}
                                    />
                                </View>
                            </View>
                            <FormikCustomTextInput name="place" label="Place" />
                            <FormikCustomTextInput
                                style={styles.multilineTextInput}
                                name="note"
                                label="Note"
                                multiline={true}
                            />
                            <CustomButton buttonText="Update" onPress={handleSubmit} />
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default EditMatchInfoRR