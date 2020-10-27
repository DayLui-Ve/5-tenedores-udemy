import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input, Button } from "react-native-elements";
import { CORPORATIVE_COLOR } from '../../utils/color';
import { size } from "lodash";
import * as firebase from 'firebase';
import { reauthenticate } from '../../utils/api';
import { showToast } from '../../utils/toast';

export default function ChangePasswordForm({ setShowModal }) {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormData());
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text });
    }

    const onSubmit = async () => {
        let isSetErrors = true;
        let errorsTemp = {};
        setErrors({});
        if (!formData.password || !formData.newPassword || !formData.confirmNewPassword) {
            errorsTemp = {
                password: !formData.password? 'Las contraseñas son requeridas': "",
                newPassword: !formData.newPassword? 'Las contraseñas son requeridas': "",
                confirmNewPassword: !formData.confirmNewPassword? 'Las contraseñas son requeridas': "",
            }
        } else if(formData.confirmNewPassword !== formData.newPassword){
            errorsTemp = {
                newPassword: 'Las contraseñas deben ser iguales',
                confirmNewPassword: 'Las contraseñas deben ser iguales',
            }
        } else if( size(formData.newPassword) < 6 ){
            errorsTemp = {
                newPassword: 'La contraseña debe ser mayor o igual a 6 caracteres',
                confirmNewPassword: 'La contraseña debe ser mayor o igual a 6 caracteres',
            }
        } else {
            setIsLoading(true)
            await reauthenticate(formData.password)
                .then(async () => {
                    await firebase.auth()
                        .currentUser.updatePassword(formData.newPassword)
                        .then(() => {
                            setIsLoading(false)
                            showToast('Contraseña actualizada correctamente');
                            setShowModal(false);
                            isSetErrors = false
                            firebase.auth().signOut();
                        })
                        .catch(() => {
                            setIsLoading(false)
                            errorsTemp = { other: 'Error al actualizar la contraseña' };
                        })
                })
                .catch(() => {
                    setIsLoading(false);
                    errorsTemp = { password: "La contraseña es incorrecta" };
                })
        }

        isSetErrors && setErrors(errorsTemp);
    }

    return (
        <View style={styles.view}>
            <Input 
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={{
                    type: 'material-community',
                    name: showPassword? "eye-off-outline" :"eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={ e => onChange(e, 'password') }
                errorMessage={errors.password}
            />
            <Input 
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={{
                    type: 'material-community',
                    name: showPassword? "eye-off-outline" :"eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={ e => onChange(e, 'newPassword') }
                errorMessage={errors.newPassword}
            />
            <Input 
                placeholder="Confirmar nueva contraseña"
                containerStyle={styles.input}
                password={true}
                secureTextEntry={!showPassword}
                rightIcon={{
                    type: 'material-community',
                    name: showPassword? "eye-off-outline" :"eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange={ e => onChange(e, 'confirmNewPassword') }
                errorMessage={errors.confirmNewPassword}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{errors.other}</Text>
        </View>
    )
}

function defaultFormData(){
    return {
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: CORPORATIVE_COLOR
    }
})
