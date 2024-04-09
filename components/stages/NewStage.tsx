import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary, secondary, tertiary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import * as yup from 'yup';
import { Checkbox, Divider, Menu, Text, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import moment from "moment";
import { stageFormatsEnum } from "../../data/stageFormatsEnum";

const NewStage = ({ route, navigation }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        container2: {
            flex: 1,
            backgroundColor: primary,
            flexDirection: 'row',
        },
        text: {
            marginTop: 5,
            marginHorizontal: 5
        },
        subHeaderText: {
            alignSelf: 'center',
            paddingTop: 10
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
    const [stageFormats, setStageFormats] = useState<any[]>()
    const [selectedStageFormatId, setSelectedStageFormatId] = useState<number>(1)
    const [showFormatsMenu, setShowFormatsMenu] = useState<boolean>(false)
    const [thirdPlaceMatch, setThirdPlaceMatch] = useState<boolean>(false)
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')
    const { token } = route.params
    const { tournamentId } = route.params
    const { stageList } = route.params
    const { setStageList } = route.params

    const initialValues = {
        'name': 'New stage',
        'tournament_id': tournamentId,
        'format_id': "Single Elimination",
        'start_date': startDate.toISOString(),
        'end_date': endDate.toISOString(),
        'places': [],
        'description': '',
        'number_of_teams_per_group': 4,
        'number_of_groups': 1,
        'stage_order': stageList.length + 1,
        'number_of_legs_per_round': [],
        'best_of_per_round': [],
        'include_third_place_match': false,
        'third_place_match_number_of_legs': 1,
        'third_place_match_best_of': 0,
        'win_point': 0,
        'draw_point': 0,
        'lose_point': 0
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
            .string(),
        number_of_teams_per_group: yup
            .number()
            .required("This field is required")
            .min(2, "Must be at least 2")
            .max(128, "Must be at most 128"),
        number_of_groups: yup
            .number()
            .required("This field is required")
            .min(1, "Must be at least 1")
            .max(32, "Must be at most 32"),
        stage_order: yup
            .number()
            .required("This field is required")
            .min(1, "Must be at least 1")
            .max(stageList.length + 1, `Must be at most ${stageList.length + 1}`),
        number_of_legs_per_round: yup
            .array()
            .of(yup
                .number()
                .required('Not all field(s) in "Number of legs / round" are filled')
                .min(1, 'All field(s) in "Number of legs / round" must be at least 1')
                .max(3, 'All field(s) in "Number of legs / round" must be at most 3'))
            .test('is-equal-to-number-of-rounds', 'All "Number of legs / round" fields must be filled out', function (value) {
                const { number_of_teams_per_group } = this.parent
                var numberOfRounds = Math.ceil(Math.log2(number_of_teams_per_group))
                return value && value.length === numberOfRounds
            }),
        best_of_per_round: yup
            .array()
            .of(yup
                .number()
                .required('Not all field(s) in "Best of / round" are filled')
                .min(0, 'All field(s) in "Best of / round" must be at least 0'))
            .test('is-equal-to-number-of-rounds', 'All "Best of / round" fields must be filled out', function (value) {
                const { number_of_teams_per_group } = this.parent
                var numberOfRounds = Math.ceil(Math.log2(number_of_teams_per_group))
                return value && value.length === numberOfRounds
            }),
        include_third_place_match: yup
            .bool()
            .required("This field is required"),
        third_place_match_number_of_legs: yup
            .number()
            .test('is-empty', 'This field is required and must be in range 1-3', function (value) {
                const { include_third_place_match } = this.parent
                return (!include_third_place_match) || (include_third_place_match && value && value >= 1 && value <= 3)
            }),
        third_place_match_best_of: yup
            .number()
            .test('is-empty', 'This field is required and must be at least 0', function (value) {
                const { include_third_place_match } = this.parent
                return (!include_third_place_match) || (include_third_place_match && (value === 0 || (value && value >= 1)))
            }),
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
        Alert.alert("Confirm stage creation", "The stage configurations can not be changed after creation. Do you want to continue?", [
            {
                text: "OK",
                onPress: () => {
                    var requestBody = { ...values }
                    requestBody["format_id"] = selectedStageFormatId
                    requestBody["number_of_teams_per_group"] = parseInt(requestBody["number_of_teams_per_group"])
                    requestBody["number_of_groups"] = parseInt(requestBody["number_of_groups"])
                    requestBody["stage_order"] = parseInt(requestBody["stage_order"])
                    for (var i = 0; i < requestBody["number_of_legs_per_round"].length; i++) {
                        requestBody["number_of_legs_per_round"][i] = parseInt(requestBody["number_of_legs_per_round"][i])
                    }
                    for (var i = 0; i < requestBody["best_of_per_round"].length; i++) {
                        requestBody["best_of_per_round"][i] = parseInt(requestBody["best_of_per_round"][i])
                    }
                    requestBody["third_place_match_number_of_legs"] = parseInt(requestBody["third_place_match_number_of_legs"])
                    requestBody["third_place_match_best_of"] = parseInt(requestBody["third_place_match_best_of"])
                    requestBody["win_point"] = parseInt(requestBody["win_point"]) || 0
                    requestBody["draw_point"] = parseInt(requestBody["draw_point"]) || 0
                    requestBody["lose_point"] = parseInt(requestBody["lose_point"]) || 0
                    console.log(requestBody)
                    fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/${token}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    })
                        .then(() => {
                            values["format_id"] = stageFormats?.find(sf => sf.id === selectedStageFormatId).name
                            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/stages/all/${tournamentId}/${token}`)
                                .then(response => response.json())
                                .then(data2 => {
                                    setStageList(data2)
                                    navigation.goBack()
                                })
                                .catch(console.error)
                        })
                        .catch((error: any) => {
                            setServerErrorMessage(error.message)
                        })
            }},
            { text: "Cancel", style: 'cancel' }
        ])  
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
        <>
            {stageFormats &&
                <Formik initialValues={initialValues} onSubmit={createStage} validationSchema={validationSchema}>
                    {
                        ({ handleSubmit, values, handleChange, errors }) =>
                            <View style={styles.container}>
                                <ScrollView>
                                    <Text variant="titleMedium" style={styles.subHeaderText}>Stage information</Text>
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
                                    {(errors && errors.start_date) && <Text style={styles.errorText}>{errors.start_date}</Text>}
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
                                    <Text variant="titleMedium" style={styles.subHeaderText}>Stage configuration</Text>
                                    <Menu
                                        visible={showFormatsMenu}
                                        onDismiss={() => setShowFormatsMenu(false)}
                                        anchor={
                                            <CustomTextInput
                                                name="format_id"
                                                label="Stage format"
                                                editable={false}
                                                onPressIn={() => setShowFormatsMenu(true)}
                                            />
                                        }
                                    >
                                        <ScrollView>
                                            {stageFormats?.map(s => <Menu.Item
                                                onPress={() => {
                                                    values["format_id"] = s.name
                                                    if (s.id !== selectedStageFormatId) {
                                                        values["number_of_legs_per_round"] = []
                                                        values["best_of_per_round"] = []
                                                    }
                                                    setSelectedStageFormatId(s.id)
                                                    setShowFormatsMenu(false)
                                                }}
                                                title={s.name}
                                            />)}
                                        </ScrollView>
                                    </Menu>
                                    <CustomTextInput
                                        name="number_of_teams_per_group"
                                        label="Number of teams / group"
                                        inputMode="numeric"
                                        value={values.number_of_teams_per_group.toString()}
                                    />
                                    <CustomTextInput
                                        name="number_of_groups"
                                        label="Number of groups"
                                        inputMode="numeric"
                                        value={values.number_of_groups.toString()}
                                    />
                                    <CustomTextInput
                                        name="stage_order"
                                        label="Stage order"
                                        inputMode="numeric"
                                        value={values.stage_order.toString()}
                                    />
                                    {selectedStageFormatId == stageFormatsEnum.SINGLE_ELIMINATION &&
                                        <>
                                            <Text style={styles.text}>Number of legs / round (max. 3)</Text>
                                            <FieldArray name="number_of_legs_per_round">
                                                {() => {
                                                    if (values.number_of_teams_per_group) {
                                                        var numberOfRounds = Math.ceil(Math.log2(values.number_of_teams_per_group))
                                                        return <View style={styles.container2}>
                                                            <ScrollView horizontal>
                                                                {[...Array(numberOfRounds)].map((_, index) => (
                                                                    <TextInput
                                                                        key={index}
                                                                        style={styles.text}
                                                                        inputMode="numeric"
                                                                        onChangeText={handleChange(`number_of_legs_per_round.${index}`)}
                                                                        placeholder={`Round ${index + 1}`}
                                                                    />
                                                                ))}
                                                            </ScrollView>
                                                        </View>
                                                    }
                                                }}
                                            </FieldArray>
                                            {(errors && errors.number_of_legs_per_round) && <Text style={styles.errorText}>{errors.number_of_legs_per_round}</Text>}
                                            <Text style={styles.text}>Best of / round</Text>
                                            <FieldArray name="best_of_per_round">
                                                {() => {
                                                    if (values.number_of_teams_per_group) {
                                                        var numberOfRounds = Math.ceil(Math.log2(values.number_of_teams_per_group))
                                                        return <View style={styles.container2}>
                                                            <ScrollView horizontal>
                                                                {[...Array(numberOfRounds)].map((_, index) => (
                                                                    <TextInput
                                                                        key={index}
                                                                        style={styles.text}
                                                                        inputMode="numeric"
                                                                        onChangeText={handleChange(`best_of_per_round.${index}`)}
                                                                        placeholder={`Round ${index + 1}`}
                                                                    />
                                                                ))}
                                                            </ScrollView>
                                                        </View>
                                                    }
                                                }}
                                            </FieldArray>
                                            {(errors && errors.best_of_per_round) && <Text style={styles.errorText}>{errors.best_of_per_round}</Text>}
                                            <Checkbox.Item
                                                label="Include third place match"
                                                labelStyle={{ textAlign: 'left' }}
                                                status={thirdPlaceMatch ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    values["include_third_place_match"] = !thirdPlaceMatch
                                                    setThirdPlaceMatch(!thirdPlaceMatch)
                                                    if (thirdPlaceMatch === false) {
                                                        values["third_place_match_number_of_legs"] = 1
                                                        values["third_place_match_best_of"] = 0
                                                    }
                                                }}
                                                color={tertiary}
                                                position="leading"
                                                mode="android"
                                            />
                                            {thirdPlaceMatch && (
                                                <>
                                                    <CustomTextInput
                                                        name="third_place_match_number_of_legs"
                                                        label="Third place match number of legs (max. 3)"
                                                        inputMode="numeric"
                                                        value={values.third_place_match_number_of_legs.toString()}
                                                    />
                                                    <CustomTextInput
                                                        name="third_place_match_best_of"
                                                        label="Third place match best of"
                                                        inputMode="numeric"
                                                        value={values.third_place_match_best_of.toString()}
                                                    />
                                                </>
                                            )}
                                        </>
                                    }
                                    {selectedStageFormatId === stageFormatsEnum.ROUND_ROBIN &&
                                        <>
                                            <Text style={styles.text}>Number of legs (max. 3)</Text>
                                            <FieldArray name="number_of_legs_per_round">
                                                {() =>
                                                    <TextInput
                                                        key={0}
                                                        style={styles.text}
                                                        inputMode="numeric"
                                                        onChangeText={handleChange(`number_of_legs_per_round.${0}`)}
                                                    />              
                                                }
                                            </FieldArray>
                                            {(errors && errors.number_of_legs_per_round) && <Text style={styles.errorText}>{errors.number_of_legs_per_round}</Text>}
                                            <Text style={styles.text}>Best of</Text>
                                            <FieldArray name="best_of_per_round">
                                                {() => 
                                                    <TextInput
                                                        key={0}
                                                        style={styles.text}
                                                        inputMode="numeric"
                                                        onChangeText={handleChange(`best_of_per_round.${0}`)}
                                                    />
                                                }
                                            </FieldArray>
                                            {(errors && errors.best_of_per_round) && <Text style={styles.errorText}>{errors.best_of_per_round}</Text>}
                                            <CustomTextInput
                                                name="win_point"
                                                label="Win Point"
                                                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                value={values.win_point.toString()}
                                            />
                                            <CustomTextInput
                                                name="draw_point"
                                                label="Draw Point"
                                                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                value={values.draw_point.toString()}
                                            />
                                            <CustomTextInput
                                                name="lose_point"
                                                label="Lose Point"
                                                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                value={values.lose_point.toString()}
                                            />
                                        </>
                                    }
                                    <CustomButton buttonText="Create stage" onPress={handleSubmit} />
                                    <Text style={styles.errorText}>{serverErrorMessage}</Text>
                                </ScrollView>
                            </View>
                    }
                </Formik>
            }
        </>
    )
}

export default NewStage