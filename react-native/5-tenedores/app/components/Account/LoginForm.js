import React, { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { CORPORATIVE_COLOR } from '../../utils/color';
import { isEmpty } from 'lodash';
import { validateEmail } from '../../utils/validations';
import { showToast } from '../../utils/toast';
import { useNavigation } from "@react-navigation/native";
import * as firebase from "firebase";
import Loading from '../Loading';

export default function LoginForm(){

    const navigation = useNavigation();

    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState(defaultFormValues());

    const [loading, setLoading] = useState(false)

    const onChange = (e, type) => setFormData({ ...formData, [type]: e.nativeEvent.text, });

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)) {
            showToast('Todos los campos son requeridos')
        } else if ( !validateEmail(formData.email) ){
            showToast('El email no es válido')
        } else {
            setLoading(true);
            const { email, password } = formData
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(response => {
                    setLoading(false);
                    navigation.navigate("account");
                })
                .catch(err => {
                    setLoading(false);
                    showToast('Email o password incorrectos')
                })

        }
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "password")}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Button
                title="Iniciar Sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text="Iniciando Sesión" />
        </View>
    );

}

function defaultFormValues(){
    return { email: "", password: "" };
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: CORPORATIVE_COLOR,
    },
    iconRight: {
        color: "#c1c1c1",
    },
});