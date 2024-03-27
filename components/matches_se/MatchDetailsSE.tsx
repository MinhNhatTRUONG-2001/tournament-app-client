import { ScrollView, StyleSheet, View } from "react-native";
import CustomButton from "../custom/CustomButton";
import { primary } from "../../theme/colors";
import { useEffect, useState } from "react";
import MatchInfoSE from "./MatchInfoSE";
import { Divider } from "react-native-paper";

const MatchSeDetails = ({ route, navigation }: any) => {
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
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/matches/se/${matchId}/${token}`)
                .then(response => response.json())
                .then(data => setMatchInfo(data))
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            {matchInfo &&
                <ScrollView> 
                    <MatchInfoSE matchInfo={matchInfo} />
                    <Divider />
                    {matchInfo.round_number === 1 &&
                        <CustomButton buttonText="Edit team name" onPress={() => navigation.navigate("EditTeamNamesSE", { navigation, token, setMatchList, matchInfo, setMatchInfo })} />
                    }
                    <CustomButton buttonText="Edit match information" onPress={() => navigation.navigate("EditMatchInfoSE", { navigation, token, matchList, setMatchList, matchInfo, setMatchInfo })} />
                    <CustomButton buttonText="Edit match scores" onPress={() => navigation.navigate("EditMatchScoresSE", { navigation, token, matchList, setMatchList, matchInfo, setMatchInfo })} />
                </ScrollView>
            }
        </View>
    )
}

export default MatchSeDetails