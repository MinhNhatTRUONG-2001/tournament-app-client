import { StyleSheet, View } from "react-native";
import { primary } from "../../theme/colors";
import { Divider } from "react-native-paper";
import { useEffect, useState } from "react";
import TournamentInfo from "./TournamentInfo";
import StageList from "./StageList";

const TournamentDetails = ({ route, navigation }: any) => {
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

    const { token } = route.params;
    const { id } = route.params;
    const { tournamentList } = route.params;
    const { setTournamentList } = route.params;
    const [tournamentInfo, setTournamentInfo] = useState<any>()
    useEffect(() => {
        if (token) {
            fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/tournaments/${id}/${token}`)
                .then(response => response.json())
                .then(data => setTournamentInfo(data))
                .catch(console.error)
        }
    }, [])

    return (
        <View style={styles.container}>
            <TournamentInfo
                navigation={navigation}
                token={token}
                tournamentList={tournamentList}
                setTournamentList={setTournamentList}
                tournamentInfo={tournamentInfo}
                setTournamentInfo={setTournamentInfo}/>
            <Divider />
            <StageList navigation={navigation} token={token} />
        </View>
    )
}

export default TournamentDetails