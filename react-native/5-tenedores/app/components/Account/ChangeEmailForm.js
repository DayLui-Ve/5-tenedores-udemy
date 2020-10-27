import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from "react-native-elements";
import { reauthenticate } from '../../utils/api';
import { CORPORATIVE_COLOR } from '../../utils/color';
import { validateEmail } from '../../utils/validations';
import * as firebase from 'firebase';
import { showToast } from '../../utils/toast';

export default function ChangeEmailForm({ email, setShowModal, setReloadUserInfo }) {

    const [formData, setFormData] = useState(defaultFormData())
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = () => {
        setErrors({})
        if (!formData.email || formData.email == email) {
            setErrors({email: 'El email no ha cambiado'});
        } else if (!validateEmail(formData.email)){
            setErrors({email: 'El email no es válido'});
        } else if (!formData.password) {
            setErrors({password: 'La contraseña es requerida'});
        } else {
            setIsLoading(true);
            reauthenticate(formData.password)
                .then(() => {
                    firebase.auth()
                        .currentUser.updateEmail(formData.email)
                        .then(() => {
                            setIsLoading(false);
                            setReloadUserInfo(true);
                            showToast('Email actualizado correctamente');
                            setShowModal(false);
                        })
                        .catch(() => {
                            setErrors({ email: 'Error al actualizar el email' });
                            setIsLoading(false)
                        })
                })
                .catch(() => {
                    setIsLoading(false);
                    setErrors({ password: "La contraseña es incorrecta" })
                })
        }
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder="Correo electrónico"
                containerStyle={ styles.input }
                defaultValue={ email || "" }
                onChange={ e => onChange(e, 'email') }
                rightIcon={{
                    type: 'material-community',
                    name: 'at',
                    color: "#c2c2c2",
                }}
                errorMessage={errors.email}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                onChange={ e => onChange(e, 'password') }
                rightIcon={{
                    type: "material-community",
                    name: showPassword? "eye-off-outline" :"eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                errorMessage={errors.password}
            />
            <Button 
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    );
}

function defaultFormData(){
    return {
        email: "",
        password: ""
    };
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: CORPORATIVE_COLOR
    }
})
