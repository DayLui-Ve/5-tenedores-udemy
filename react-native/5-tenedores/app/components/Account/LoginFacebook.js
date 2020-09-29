import React, { useState } from 'react';
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import * as Facebook from "expo-facebook";
import { FacebookApi } from '../../utils/social'; 
import { showToast } from '../../utils/toast';
import Loading from "../Loading";

export default function LoginFacebook(){

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false)

    // TODO: Flujo para autenticación con Facebook y Firebase
    const login = async () => {
        await Facebook.initializeAsync(FacebookApi.application_id);

        const { type, token } = await Facebook.logInWithReadPermissionsAsync({
            permissions: FacebookApi.permissions
        })

        if (type === 'success') {
        
            setLoading(true);
            const credentials = firebase.auth.FacebookAuthProvider.credential(token);
            firebase
                .auth()
                .signInWithCredential(credentials)
                .then(() => navigation.navigate('account'))
                .catch(() => showToast("Credenciales incorrectas"))
                .finally(() => setLoading(false));
        }else if (type === 'cancel'){
            showToast('Has cancelado el inicio de sesión');
        }else{
            showToast('Error desconocido, por favor intente más tarde');
        }
    }

    return (
        <>
            <SocialIcon
                title="Iniciar Sesión con Facebook"
                button
                type="facebook"
                onPress={login}
            />
            <Loading isVisible={loading} text="Iniciando Sesión" />
        </>
    );

}