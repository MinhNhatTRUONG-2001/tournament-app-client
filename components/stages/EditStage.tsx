import { StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary, secondary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import { Text, TextInput } from "react-native-paper";
import { useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";

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
        }
    });

    const { token } = route.params;
    const { stageList } = route.params;
    const { setStageList } = route.params;
    const { stageInfo } = route.params;
    const { setStageInfo } = route.params;
    const [startDate, setStartDate] = useState(new Date(stageInfo.start_date));
    const [endDate, setEndDate] = useState(new Date(stageInfo.end_date));
    const [errorMessage, setErrorMessage] = useState<string>('')

    const initialValues = {
        'name': stageInfo.name,
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
            .test('is-before-end-date', 'Start date must be before or equal to end date', function(value) {
                const { end_date } = this.parent
                const isBeforeEndDate = moment(value).isSameOrBefore(end_date)
                if (!isBeforeEndDate) {
                    setErrorMessage('Start date must be before or equal to end date')
                }
                else {
                    setErrorMessage('')
                }
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

    const updateStage = (values: any) => {
        //console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${stageInfo.id}/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
        .then(response => response.json())
        .then(data => {
            setStageList(stageList.map((s: any) => s.id === stageInfo.id ? data : s))
            setStageInfo(data)
            navigation.goBack()
        })
    }

    return (
        <Formik initialValues={initialValues} onSubmit={updateStage} validationSchema={validationSchema}>
            {
                ({ handleSubmit, values, handleChange }) =>
                    <View style={styles.container}>
                        <CustomTextInput name="name" label="Name" />
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
                        <Text style={styles.text}>Places</Text>
                        <FieldArray name="places">
                            {({ push, remove }) => (
                                <>
                                    {values.places.map((item: string, index: number) => (
                                        <View style={styles.container2} key={index}>
                                            <TextInput
                                                onChangeText={handleChange(`places.${index}`)}
                                                value={item}
                                                placeholder="Place"
                                            />
                                            <CustomButton buttonText="Remove" onPress={() => remove(index)} buttonColor={error} />
                                        </View>
                                    ))}
                                    <CustomButton buttonText="Add Places" onPress={() => push('')} buttonColor={secondary} />
                                </>
                            )}
                        </FieldArray>
                        <CustomButton buttonText="Update" onPress={handleSubmit} />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
            }
        </Formik>
    )
}

export default EditStage