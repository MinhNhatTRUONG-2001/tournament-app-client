import { Platform, ScrollView, StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary, secondary, tertiary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import { Checkbox, Text } from "react-native-paper";
import { useState } from "react";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";
import CustomTextInput from "../custom/CustomTextInput";

const EditTournament = ({ route, navigation }: any) => {
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
        text: {
            marginHorizontal: 5
        },
        errorText: {
            alignSelf: 'center',
            paddingBottom: 5,
            color: error
        },
        datePicker: {
            alignItems: 'center'
        },
        multilineTextInput: {
            minHeight: 150,
            textAlignVertical: 'top',
            marginHorizontal: 5,
            marginBottom: 10
        }
    });

    const { token } = route.params
    const { tournamentList } = route.params
    const { setTournamentList } = route.params
    const { tournamentInfo } = route.params
    const { setTournamentInfo } = route.params
    const { setDisplayedTournamentList } = route.params
    const { publicTournamentList } = route.params
    const { setDisplayedPublicTournamentList } = route.params
    const { setSearchTournamentList } = route.params
    const { setSearchPublicTournamentList } = route.params
    const [privateTournament, setPrivateTournament] = useState<boolean>(tournamentInfo.is_private)
    const [startDate, setStartDate] = useState(new Date(tournamentInfo.start_date))
    const [endDate, setEndDate] = useState(new Date(tournamentInfo.end_date))
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const initialValues = {
        'name': tournamentInfo.name,
        'start_date': startDate.toISOString(),
        'end_date': endDate.toISOString(),
        'places': tournamentInfo.places,
        'description': tournamentInfo.description,
        'is_private': tournamentInfo.is_private
    }

    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .max(100, "The maximum characters is 100")
            .required("Name is required"),
        start_date: yup
            .date()
            .test('is-before-end-date', 'Start date must be before or equal to end date', function (value) {
                const { end_date } = this.parent
                const isBeforeEndDate = moment(value).isSameOrBefore(end_date)
                return isBeforeEndDate
            }),
        end_date: yup
            .date(),
        places: yup
            .array()
            .of(yup.string()),
        description: yup
            .string()
    })

    const changeStartDate = (event: DateTimePickerEvent, date: Date | undefined, values: any) => {
        if (event.type === "set" && date !== undefined) {
            values["start_date"] = date?.toISOString()
            setStartDate(date)
        }
    }

    const changeEndDate = (event: DateTimePickerEvent, date: Date | undefined, values: any) => {
        if (event.type === "set" && date !== undefined) {
            values["end_date"] = date?.toISOString()
            setEndDate(date)
        }
    }

    const showStartDatePicker = (values: any) => {
        DateTimePickerAndroid.open({
            value: startDate,
            onChange: (event, date) => changeStartDate(event, date, values),
            mode: 'date',
            is24Hour: true,
        })
    }

    const showEndDatePicker = (values: any) => {
        DateTimePickerAndroid.open({
            value: endDate,
            onChange: (event, date) => changeEndDate(event, date, values),
            mode: 'date',
            is24Hour: true,
        })
    }

    const updateTournament = (values: any) => {
        //console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${tournamentInfo.id}`, {
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
                setTournamentList(tournamentList.map((t: any) => t.id === tournamentInfo.id ? data : t))
                setTournamentInfo(data)
                setDisplayedTournamentList(tournamentList.map((t: any) => t.id === tournamentInfo.id ? data : t))
                if (!data["is_private"]) {
                    setDisplayedPublicTournamentList(publicTournamentList.map((t: any) => t.id === tournamentInfo.id ? data : t))
                }
                else {
                    setDisplayedPublicTournamentList(publicTournamentList.filter((t: any) => t.id !== tournamentInfo.id))
                }
                setSearchTournamentList('')
                setSearchPublicTournamentList('')
                navigation.goBack()
            })
            .catch((error: any) => {
                setServerErrorMessage(error.message)
            })
    }

    return (
        <Formik initialValues={initialValues} onSubmit={updateTournament} validationSchema={validationSchema}>
            {
                ({ handleSubmit, values, handleChange, errors }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <FormikCustomTextInput name="name" label="Name" />
                            <Text style={styles.text}>Start date</Text>
                            <View style={styles.datePicker}>
                                {Platform.OS === 'ios' &&
                                    <RNDateTimePicker
                                        value={startDate}
                                        onChange={(event, date) => changeStartDate(event, date, values)}
                                    />
                                }
                                {Platform.OS === 'android' &&
                                    <CustomButton buttonText={startDate.toDateString()} onPress={() => showStartDatePicker(values)} buttonColor={secondary} />
                                }
                            </View>
                            <Text style={styles.text}>End date</Text>
                            <View style={styles.datePicker}>
                                {Platform.OS === 'ios' &&
                                    <RNDateTimePicker
                                        value={endDate}
                                        onChange={(event, date) => changeEndDate(event, date, values)}
                                    />
                                }
                                {Platform.OS === 'android' &&
                                    <CustomButton buttonText={endDate.toDateString()} onPress={() => showEndDatePicker(values)} buttonColor={secondary} />
                                }
                            </View>
                            {(errors && errors.start_date) && <Text style={styles.errorText}>{errors.start_date}</Text>}
                            <Text style={styles.text}>Places</Text>
                            <FieldArray name="places">
                                {({ push, remove }) => (
                                    <>
                                        {values.places.map((item: string, index: number) => (
                                            <View style={styles.container2} key={index}>
                                                <CustomTextInput
                                                    onChangeText={handleChange(`places.${index}`)}
                                                    value={item}
                                                    label={`Place ${index + 1}`}
                                                    width="70%"
                                                />
                                                <CustomButton buttonText="Remove" onPress={() => remove(index)} buttonColor={error} />
                                            </View>
                                        ))}
                                        <CustomButton buttonText="Add Places" onPress={() => push('')} buttonColor={secondary} />
                                    </>
                                )}
                            </FieldArray>
                            <FormikCustomTextInput
                                style={styles.multilineTextInput}
                                name="description"
                                label="Description"
                                multiline={true}
                            />
                            <Checkbox.Item
                                label="Set as private tournament"
                                labelStyle={{ textAlign: 'left' }}
                                status={privateTournament ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    values["is_private"] = !privateTournament
                                    setPrivateTournament(!privateTournament)
                                }}
                                color={tertiary}
                                position="leading"
                                mode="android"
                            />
                            <CustomButton buttonText="Update" onPress={handleSubmit} />
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default EditTournament