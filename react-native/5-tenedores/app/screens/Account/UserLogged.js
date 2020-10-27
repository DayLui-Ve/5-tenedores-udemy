import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
import { CORPORATIVE_COLOR } from '../../utils/color';
import Loading from "../../components/Loading";
import InfoUser from '../../components/Account/InfoUser';
import AccountOptions from '../../components/Account/AccountOptions';


export default function UserLogged() {

    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const [reloadUserInfo, setReloadUserInfo] = useState(false)

    // TODO: Función cuando se cambie de estado, por ahora solo cuando se monte el componente
    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
        setReloadUserInfo(false);
    }, [reloadUserInfo]);

    return (
        <View style={styles.viewUserInfo}>
            {userInfo && (
                <InfoUser
                    setLoading={setLoading}
                    setLoadingText={setLoadingText}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                />
            )}
            <AccountOptions
                userInfo={userInfo}
                setReloadUserInfo={setReloadUserInfo}
            />

            <Button
                title="Cerrar sesión"
                onPress={() => firebase.auth().signOut()}
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
            />
            <Loading isVisible={loading} text={loadingText} />
        </View>
    );

}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingVertical: 10,
    },
    btnCloseSessionText: {
        color: CORPORATIVE_COLOR,
    },
});