import { ScrollView, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary, secondary, tertiary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import { Checkbox, Divider, Menu, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";

const NewStage = ({ route, navigation }: any) => {
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
            minHeight: 100,
            textAlignVertical: 'top'
        }
    });

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [stageFormats, setStageFormats] = useState<any[]>()
    const [selectedStageFormatId, setSelectedStageFormatId] = useState<number>()
    const [showFormatsMenu, setShowFormatsMenu] = useState<boolean>(false)
    const [thirdPlaceMatch, setThirdPlaceMatch] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const { token } = route.params
    const { tournamentId } = route.params
    const { stageList } = route.params
    const { setStageList } = route.params

    const initialValues = {
        'name': 'New stage',
        'tournament_id': tournamentId,
        'format_id': 1,
        'start_date': startDate.toISOString(),
        'end_date': endDate.toISOString(),
        'places': [''],
        'description': '',
        'number_of_teams_per_group': 4,
        'number_of_groups': 1,
        'stage_order': stageList.Length + 1,
        'number_of_legs_per_round': [1],
        'best_of_per_round': [0],
        'include_third_place_match': false,
        'third_place_match_number_of_legs': null,
        'third_place_match_best_of': null
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

    const createStage = (values: any) => {
        //console.log(values)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(() => {
                fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/all/${tournamentId}/${token}`)
                    .then(response => response.json())
                    .then(data2 => {
                        setStageList(data2)
                        navigation.goBack()
                    })
                    .catch(console.error)
            })
            .catch(console.error)
    }

    useEffect(() => {
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stage_format`)
            .then(response => response.json())
            .then((data: any) => {
                setStageFormats(data)
            })
            .catch(console.error)
    }, [])

    return (
        <Formik initialValues={initialValues} onSubmit={createStage} validationSchema={validationSchema}>
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
                                    {values.places.map((item, index) => (
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
                        <CustomTextInput
                            style={styles.multilineTextInput}
                            name="description"
                            label="Description"
                            multiline={true}
                        />
                        <Divider />
                        <Menu
                            visible={showFormatsMenu}
                            onDismiss={() => setShowFormatsMenu(false)}
                            anchor={<CustomTextInput name="format_id" label="Stage format" editable={false} onPressIn={() => setShowFormatsMenu(true)} />}
                        >
                            <ScrollView>
                                {stageFormats?.map(s => <Menu.Item
                                    onPress={() => {
                                        values["format_id"] = s.id
                                        setSelectedStageFormatId(s.id)
                                        setShowFormatsMenu(false)
                                    }}
                                    title={s.name}
                                />)}
                            </ScrollView>
                        </Menu>
                        <CustomTextInput name="number_of_teams_per_group" label="Name" inputMode="numeric" />
                        <CustomTextInput name="number_of_groups" label="Name" inputMode="numeric" />
                        <CustomTextInput name="stage_order" label="Name" inputMode="numeric" />
                        {selectedStageFormatId == 1 &&
                            <>
                                <FieldArray name="number_of_legs_per_round">
                                    {() => (
                                        <>
                                            {() => {
                                                var textInputs: any[] = []
                                                for (var i = 0; i < values.number_of_teams_per_group; i++) {
                                                    textInputs.push(
                                                        <TextInput
                                                            onChangeText={handleChange(`number_of_legs_per_round.${i}`)}
                                                            placeholder="Number of legs / round"
                                                            inputMode="numeric"
                                                        />
                                                    )
                                                }
                                                return textInputs
                                            }
                                            }
                                        </>
                                    )}
                                </FieldArray>
                                <FieldArray name="best_of_per_round">
                                    {() => (
                                        <>
                                            {() => {
                                                var textInputs: any[] = []
                                                for (var i = 0; i < values.number_of_teams_per_group; i++) {
                                                    textInputs.push(
                                                        <TextInput
                                                            onChangeText={handleChange(`best_of_per_round.${i}`)}
                                                            placeholder="Best of / round"
                                                            inputMode="numeric"
                                                        />
                                                    )
                                                }
                                                return textInputs
                                            }
                                            }
                                        </>
                                    )}
                                </FieldArray>
                                <Checkbox.Item
                                    label="Include third place match"
                                    labelStyle={{ textAlign: 'left' }}
                                    status={thirdPlaceMatch ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        values["include_third_place_match"] = !thirdPlaceMatch
                                        setThirdPlaceMatch(!thirdPlaceMatch)
                                        if (thirdPlaceMatch === false) {
                                            values["third_place_match_number_of_legs"] = null
                                            values["third_place_match_best_of"] = null
                                        }
                                    }}
                                    color={tertiary}
                                    position="leading"
                                    mode="android"
                                />
                                {thirdPlaceMatch && (
                                    <>
                                        <CustomTextInput name="third_place_match_number_of_legs" label="Name" inputMode="numeric" />
                                        <CustomTextInput name="third_place_match_best_of" label="Name" inputMode="numeric" />
                                    </>
                                )}
                            </>
                        }
                        <CustomButton buttonText="Create stage" onPress={handleSubmit} />
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
            }
        </Formik>
    )
}

export default NewStage