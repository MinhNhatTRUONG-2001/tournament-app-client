import { Platform, ScrollView, StyleSheet, View } from "react-native";
import FormikCustomTextInput from "../custom/FormikCustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary, secondary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import { Text } from "react-native-paper";
import { useState } from "react";
import RNDateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";
import CustomTextInput from "../custom/CustomTextInput";

const EditStage = ({ route, navigation }: any) => {
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
    const { stageList } = route.params
    const { setStageList } = route.params
    const { stageInfo } = route.params
    const { setStageInfo } = route.params
    const [startDate, setStartDate] = useState(new Date(stageInfo.start_date))
    const [endDate, setEndDate] = useState(new Date(stageInfo.end_date))
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    const initialValues = {
        'name': stageInfo.name,
        'tournament_id': stageInfo.tournament_id,
        'start_date': startDate.toISOString(),
        'end_date': endDate.toISOString(),
        'places': stageInfo.places,
        'description': stageInfo.description
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

    const updateStage = (values: any) => {
        //console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${stageInfo.id}`, {
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
                setStageList(stageList.map((s: any) => s.id === stageInfo.id ? data : s))
                setStageInfo(data)
                navigation.goBack()
            })
            .catch((error: any) => {
                setServerErrorMessage(error.message)
            })
    }

    return (
        <Formik initialValues={initialValues} onSubmit={updateStage} validationSchema={validationSchema}>
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
                                        {values.places?.map((item: string, index: number) => (
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
                            <CustomButton buttonText="Update" onPress={handleSubmit} />
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default EditStage