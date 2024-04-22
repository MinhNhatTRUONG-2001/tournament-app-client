import { ScrollView, StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary, secondary, tertiary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import { Checkbox, Text } from "react-native-paper";
import { useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";
import CustomTextInput from "../custom/CustomTextInput";

const NewTournament = ({ route, navigation }: any) => {
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

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [privateTournament, setPrivateTournament] = useState<boolean>(true)
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')
    const { token } = route.params
    const { tournamentList } = route.params
    const { setTournamentList } = route.params
    const { setDisplayedTournamentList } = route.params
    const { publicTournamentList } = route.params
    const { setDisplayedPublicTournamentList } = route.params
    const { setSearchTournamentList } = route.params
    const { setSearchPublicTournamentList } = route.params

    const initialValues = {
        'name': 'New tournament',
        'start_date': startDate.toISOString(),
        'end_date': endDate.toISOString(),
        'places': [],
        'description': '',
        'is_private': true
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
    };

    const changeEndDate = (event: DateTimePickerEvent, date: Date | undefined, values: any) => {
        if (event.type === "set" && date !== undefined) {
            values["end_date"] = date?.toISOString()
            setEndDate(date)
        }
    };

    const createTournament = (values: any) => {
        console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments`, {
            method: 'POST',
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
            .then((data: any) => {
                setTournamentList([...tournamentList, data])
                setDisplayedTournamentList([...tournamentList, data])
                if (!data["is_private"]) {
                    setDisplayedPublicTournamentList([...publicTournamentList, data])
                }
                setSearchTournamentList('')
                setSearchPublicTournamentList('')
                navigation.navigate('TournamentList')
            })
            .catch((error: any) => {
                setServerErrorMessage(error.message)
            })
    }

    return (
        <Formik initialValues={initialValues} onSubmit={createTournament} validationSchema={validationSchema}>
            {
                ({ handleSubmit, values, handleChange, errors }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <FormikCustomTextInput name="name" label="Name" />
                            <Text style={styles.text}>Start date</Text>
                            <View style={styles.datePicker}>
                                <RNDateTimePicker
                                    value={startDate}
                                    onChange={(event, date) => changeStartDate(event, date, values)}
                                />
                            </View>
                            <Text style={styles.text}>End date</Text>
                            <View style={styles.datePicker}>
                                <RNDateTimePicker
                                    value={endDate}
                                    onChange={(event, date) => changeEndDate(event, date, values)}
                                />
                            </View>
                            {(errors && errors.start_date) && <Text style={styles.errorText}>{errors.start_date}</Text>}
                            <Text style={styles.text}>Places</Text>
                            <FieldArray name="places">
                                {({ push, remove }) => (
                                    <>
                                        {values.places.map((item, index) => (
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
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                            <CustomButton buttonText="Create tournament" onPress={handleSubmit} />
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default NewTournament