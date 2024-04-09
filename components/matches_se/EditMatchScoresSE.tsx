import { Platform, ScrollView, StyleSheet, View } from "react-native";
import CustomTextInput from "../custom/CustomTextInput";
import CustomButton from "../custom/CustomButton";
import { error, primary } from "../../theme/colors";
import { FieldArray, Formik } from "formik";
import { Menu, Text, TextInput } from "react-native-paper";
import { useState } from "react";

const EditMatchScoresSE = ({ route, navigation }: any) => {
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
            marginHorizontal: 5,
            marginTop: 5
        },
        subText: {
            marginHorizontal: 10,
            marginVertical: 5,
            fontSize: 12,
            fontStyle: 'italic'
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
    const { matchList } = route.params
    const { setMatchList } = route.params
    const { matchInfo } = route.params
    const { setMatchInfo } = route.params
    const [showTeamsMenu, setShowTeamsMenu] = useState<boolean>(false)
    const [serverErrorMessage, setServerErrorMessage] = useState<string>('')

    var team1TotalScore = 0, team2TotalScore = 0
    if (matchInfo.team_1_scores) matchInfo.team_1_scores.forEach((n: number) => team1TotalScore += n)
    if (matchInfo.team_2_scores) matchInfo.team_2_scores.forEach((n: number) => team2TotalScore += n)
    var probe = 0, team1Subscores: any[] = [], team2Subscores: any[] = []
    if (matchInfo.best_of > 0) {
        for (var i = 0; i < matchInfo.number_of_legs; i++) {
            var team1Subscore = [], team2Subscore = [], endOfLegPos = probe + matchInfo.best_of
            for (var j = probe; j < endOfLegPos; j++) {
                team1Subscore.push(matchInfo.team_1_subscores[j])
                team2Subscore.push(matchInfo.team_2_subscores[j])
                probe++
            }
            team1Subscores.push(team1Subscore)
            team2Subscores.push(team2Subscore)
        }
    }

    type initialValuesType = {
        'winner': string | null | undefined,
        'team_1_scores': number[],
        'team_2_scores': number[],
        'team_1_subscores': any[] | null | undefined,
        'team_2_subscores': any[] | null | undefined,
    }

    const initialValues: initialValuesType = {
        'winner': matchInfo.winner,
        'team_1_scores': matchInfo.team_1_scores,
        'team_2_scores': matchInfo.team_2_scores,
        'team_1_subscores': team1Subscores,
        'team_2_subscores': team2Subscores,
    }

    const updateMatchScores = (values: any) => {
        var requestBody = { ...values }
        if (requestBody["winner"] === "") {
            requestBody["winner"] = null
        }
        for (var i = 0; i < requestBody["team_1_scores"].length; i++) {
            if (!requestBody["team_1_scores"][i]) {
                requestBody["team_1_scores"][i] = 0
            }
            else {
                requestBody["team_1_scores"][i] = parseInt(requestBody["team_1_scores"][i]) || 0
            }
        }
        for (var i = 0; i < requestBody["team_2_scores"].length; i++) {
            if (!requestBody["team_2_scores"][i]) {
                requestBody["team_2_scores"][i] = 0;
            } else {
                requestBody["team_2_scores"][i] = parseInt(requestBody["team_2_scores"][i]) || 0
            }
        }
        if (requestBody["team_1_subscores"].length === 0 && requestBody["team_2_subscores"].length === 0) {
            requestBody["team_1_subscores"] = null
            requestBody["team_2_subscores"] = null
        }
        else {
            requestBody["team_1_subscores"] = requestBody["team_1_subscores"].flat()
            requestBody["team_2_subscores"] = requestBody["team_2_subscores"].flat()
            for (var i = 0; i < requestBody["team_1_subscores"].length; i++) {
                if (!requestBody["team_1_subscores"][i]) {
                    requestBody["team_1_subscores"][i] = 0
                }
                else {
                    requestBody["team_1_subscores"][i] = parseInt(requestBody["team_1_subscores"][i]) || 0
                }
            }
            for (var i = 0; i < requestBody["team_2_subscores"].length; i++) {
                if (!requestBody["team_2_subscores"][i]) {
                    requestBody["team_2_subscores"][i] = 0
                }
                else {
                    requestBody["team_2_subscores"][i] = parseInt(requestBody["team_2_subscores"][i]) || 0
                }
            }
        }
        console.log(requestBody)
        fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/se/${matchInfo.id}/match_score/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(async response => {
            if (response.ok) {
                return response.json()
            }
            else throw new Error(await response.text())
        })
        .then(data => {
            setMatchInfo(data)
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/se/all/${matchInfo.stage_id}/${token}`)
                .then(response => response.json())
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
        <Formik initialValues={initialValues} onSubmit={updateMatchScores}>
            {
                ({ handleSubmit, values, handleChange }) =>
                    <View style={styles.container}>
                        <ScrollView>
                            <Menu
                                visible={showTeamsMenu}
                                onDismiss={() => setShowTeamsMenu(false)}
                                anchor={
                                    <CustomTextInput
                                        name="winner"
                                        label="Winner"
                                        editable={false}
                                        onPressIn={() => setShowTeamsMenu(true)}
                                    />
                                }
                            >
                                <ScrollView>
                                    {[matchInfo.team_1, matchInfo.team_2].map(team => <Menu.Item
                                        onPress={() => {
                                            values["winner"] = team
                                            setShowTeamsMenu(false)
                                        }}
                                        title={team}
                                    />)}
                                </ScrollView>
                            </Menu>
                            <Text style={styles.text}>{matchInfo.team_1} Scores</Text>
                            <FieldArray name="team_1_scores">
                                {() => (
                                    <ScrollView horizontal>
                                        {values.team_1_scores.map((item: number, index: number) => (
                                            <View style={styles.container2} key={index}>
                                                <Text style={styles.subText}>Leg {index + 1}</Text>
                                                <TextInput
                                                    key={index}
                                                    style={styles.text}
                                                    keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                    onChangeText={(text) => {
                                                        handleChange(`team_1_scores.${index}`)(text)
                                                        var team1TotalScore = 0, team2TotalScore = 0
                                                        values["team_1_scores"][index] = parseInt(text) || 0
                                                        values["team_1_scores"].forEach((n: any) => team1TotalScore += parseInt(n))
                                                        values["team_2_scores"].forEach((n: any) => team2TotalScore += parseInt(n))
                                                        if (team1TotalScore > team2TotalScore) {
                                                            handleChange(`winner`)(matchInfo.team_1)
                                                        }
                                                        else {
                                                            handleChange(`winner`)(matchInfo.team_2)
                                                        }
                                                    }}
                                                    value={item.toString()}
                                                    placeholder={`Leg ${index + 1}`}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </FieldArray>
                            <Text style={styles.text}>{matchInfo.team_2} Scores</Text>
                            <FieldArray name="team_2_scores">
                                {() => (
                                    <ScrollView horizontal>
                                        {values.team_2_scores.map((item: number, index: number) => (
                                            <View style={styles.container2} key={index}>
                                                <Text style={styles.subText}>Leg {index + 1}</Text>
                                                <TextInput
                                                    key={index}
                                                    style={styles.text}
                                                    keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                    onChangeText={(text) => {
                                                        handleChange(`team_2_scores.${index}`)(text)
                                                        var team1TotalScore = 0, team2TotalScore = 0
                                                        values["team_2_scores"][index] = parseInt(text) || 0
                                                        values["team_1_scores"].forEach((n: any) => team1TotalScore += parseInt(n))
                                                        values["team_2_scores"].forEach((n: any) => team2TotalScore += parseInt(n))
                                                        if (team1TotalScore > team2TotalScore) {
                                                            handleChange(`winner`)(matchInfo.team_1)
                                                        }
                                                        else {
                                                            handleChange(`winner`)(matchInfo.team_2)
                                                        }
                                                    }}
                                                    value={item.toString()}
                                                    placeholder={`Leg ${index + 1}`}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </FieldArray>
                            {matchInfo.best_of > 0 &&
                                <>
                                    <Text style={styles.text}>{matchInfo.team_1} Subscores</Text>
                                    <FieldArray name="team_1_subscores">
                                        {() => (
                                            <>
                                                {values.team_1_subscores?.map((subscoreArray: any[], outerIndex: number) => (
                                                    <ScrollView horizontal key={outerIndex}>
                                                        <Text style={styles.subText}>Leg {outerIndex + 1}</Text>
                                                        {Array.isArray(subscoreArray) && subscoreArray.map((subscore: any, innerIndex: number) => (
                                                            <View style={styles.container2} key={innerIndex}>
                                                                <TextInput
                                                                    key={innerIndex}
                                                                    style={styles.text}
                                                                    keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                                    onChangeText={handleChange(`team_1_subscores.${outerIndex}.${innerIndex}`)}
                                                                    value={subscore.toString()}
                                                                    placeholder={`Leg ${outerIndex + 1}, Subscore ${innerIndex + 1}`}
                                                                />
                                                            </View>
                                                        ))}
                                                    </ScrollView>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>
                                    <Text style={styles.text}>{matchInfo.team_2} Subscores</Text>
                                    <FieldArray name="team_2_subscores">
                                        {() => (
                                            <>
                                                {values.team_2_subscores?.map((subscoreArray: any[], outerIndex: number) => (
                                                    <ScrollView horizontal key={outerIndex}>
                                                        <Text style={styles.subText}>Leg {outerIndex + 1}</Text>
                                                        {Array.isArray(subscoreArray) && subscoreArray.map((subscore: any, innerIndex: number) => (
                                                            <View style={styles.container2} key={innerIndex}>
                                                                <TextInput
                                                                    key={innerIndex}
                                                                    style={styles.text}
                                                                    keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"}
                                                                    onChangeText={handleChange(`team_2_subscores.${outerIndex}.${innerIndex}`)}
                                                                    value={subscore.toString()}
                                                                    placeholder={`Subscore ${innerIndex + 1}`}
                                                                />
                                                            </View>
                                                        ))}
                                                    </ScrollView>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>
                                </>
                            }
                            <CustomButton buttonText="Update" onPress={handleSubmit} />
                            <Text style={styles.errorText}>{serverErrorMessage}</Text>
                        </ScrollView>
                    </View>
            }
        </Formik>
    )
}

export default EditMatchScoresSE