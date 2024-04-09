import { ScrollView, StyleSheet, View } from "react-native";
import CustomButton from "../custom/CustomButton";
import { primary } from "../../theme/colors";
import { useEffect, useState } from "react";
import MatchInfoRR from "./MatchInfoRR";
import { Divider } from "react-native-paper";

const MatchDetailsRR = ({ route, navigation }: any) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: primary,
            justifyContent: 'flex-start',
        },
        item: {
            padding: 5,
            margin: 5
        }
    });

    const { token } = route.params
    const { matchId } = route.params
    const { matchList } = route.params
    const { setMatchList } = route.params
    const [matchInfo, setMatchInfo] = useState<any>()
    
    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/${matchId}/${token}`)
                .then(response => response.json())
                .then(data => setMatchInfo(data))
                .catch(console.error)
        }
        else {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/rr/${matchId}`)
                .then(response => response.json())
                .then(data => setMatchInfo(data))
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            {matchInfo &&
                <ScrollView> 
                    <MatchInfoRR matchInfo={matchInfo} />
                    <Divider />
                    {token &&
                        <>
                            <CustomButton buttonText="Edit team name" onPress={() => navigation.navigate("EditTeamNamesRR", { navigation, token, setMatchList, matchInfo, setMatchInfo })} />
                            <CustomButton buttonText="Edit match information" onPress={() => navigation.navigate("EditMatchInfoRR", { navigation, token, matchList, setMatchList, matchInfo, setMatchInfo })} />
                            <CustomButton buttonText="Edit match scores" onPress={() => navigation.navigate("EditMatchScoresRR", { navigation, token, matchList, setMatchList, matchInfo, setMatchInfo })} />
                        </>
                    }
                </ScrollView>
            }
        </View>
    )
}

export default MatchDetailsRR