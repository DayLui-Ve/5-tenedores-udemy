import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from "react-native-elements";
import { showToast } from "../../utils/toast";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props){

    const {
        userInfo: { uid, displayName, email, photoURL },
        setLoading,
        setLoadingText,
        setUserInfo,
    } = props;

    const [photo, setPhoto] = useState(null)

    // TODO: UseEffect es como componentDidMount y componentDidUpdate, además de explorar cambios en variables del componente tambien observa los props
    useEffect(() => {
        setPhoto(photoURL);
    }, [photoURL]);

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if (resultPermissionCamera === 'denied') {
            showToast('Es necesario aceptar los permisos de la galería')
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4 ,3]
            })            

            if (result.cancelled) {
                showToast('Has cerrado la selección de imágenes');
            } else {
                setLoadingText('Cargando imagen')
                setLoading(true)
                setUserInfo({ ...props.user, photoURL: null });
                uploadImage(result.uri).then(() => updatePhotoUrl())
                    .catch(() => showToast('Error al actualizar el avatar'))
                    .finally(() => {
                        setLoading(false);
                        setLoadingText('Cargando imagen');
                    })
            }
        }
    }

    // TODO: Subir imagen desde móvilm considerar que uri es la ubicación de nuestro archivo en el celular
    const uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    const updatePhotoUrl = () => {
        firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async (response) => {
                const update = {
                    photoURL: response
                }
                firebase.auth().currentUser.updateProfile(update)
                    .then(async () => {
                        const updateUser = await firebase.auth().currentUser;
                        setUserInfo(updateUser);
                    })
                    .catch(console.log)
            })
            .catch(() => showToast('Error al actualizar el avatar'))
    }

    const avatarParms = {
        rounded:true,
        size:"large",
        showEditButton: true,
        onEditPress:changeAvatar,
        containerStyle:{...styles.userInfoAvatar}
    }
    return (
        <View style={styles.viewUserInfo}>
            {!photo && (
                <Avatar
                    {...avatarParms}
                    source={require("../../../assets/img/avatar-default.jpg")}
                />
            )}
            {photo && <Avatar {...avatarParms} source={{ uri: photo }} />}
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>{email ? email : "Social Login"}</Text>
            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingVertical: 30,
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5
    }
});