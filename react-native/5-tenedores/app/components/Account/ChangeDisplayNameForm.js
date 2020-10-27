import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from "react-native-elements";
import { CORPORATIVE_COLOR } from '../../utils/color';
import * as firebase from 'firebase';

export default function ChangeDisplayNameForm({
    displayName,
    setShowModal,
    setReloadUserInfo,
}) {
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        setError(null);
        if (!newDisplayName) {
            setError("El nombre no puede estar vacío.");
        } else if (displayName === newDisplayName) {
            setError("El nombre no puede ser igual al actual.");
        } else {
            setIsLoading(true);
            const update = {
                displayName: newDisplayName,
            };
            firebase
                .auth()
                .currentUser.updateProfile(update)
                .then(() => {
                    console.log("OK...");
                    setReloadUserInfo(true);
                    setShowModal(false);
                    setIsLoading(false);
                })
                .catch(() => {
                    setError("Error al actualizar el nombre");
                    setIsLoading(false);
                })
        }
    };

    return (
        <View style={styles.view}>
            <Input
                placeholder="Nombre y Apellido"
                containerStyle={styles.input}
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2",
                }}
                defaultValue={displayName || ""}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button
                title="Cambiar Nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
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
    },
});
