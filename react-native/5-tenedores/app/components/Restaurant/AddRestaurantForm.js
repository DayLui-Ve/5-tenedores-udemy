import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { CORPORATIVE_COLOR } from '../../utils/color';
import { map, size } from "lodash";
import uuid from 'random-uuid-v4';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { showToast } from '../../utils/toast';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Modal from '../Modal';

import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

export default function AddRestaurantForm({ setIsLoading, navigation }) {

    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addRestaurant = () => {
        // console.log('locationRestaurant', locationRestaurant)
        // console.log('restaurantName:', restaurantName)
        // console.log('restaurantAddress:', restaurantAddress)
        // console.log('restaurantDescription:', restaurantDescription)
        // console.log('images', imagesSelected)
        // console.log(locationRestaurant)
        if (!restaurantName || !restaurantAddress || !restaurantDescription) {
            showToast('Todos los campos son requeridos');
        } else if( size(imagesSelected) == 0 ){
            showToast('El restaurante debe tener al menos una foto');
        } else if( !locationRestaurant ){
            showToast('Tienes que localizar el restaurante en el mapa');
        } else {
            setIsLoading(true);
            uploadImageStorage().then(urlImages => {

                db.collection('restaurants')
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: urlImages,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createdAt: new Date(),
                        createdBy: firebase.auth().currentUser.uid
                    })
                    .then(() => {
                        setIsLoading(false);
                        navigation.navigate('restaurants');
                    })
                    .catch(() => {
                        showToast('Error al subir el restaurante, intente más tarde');
                        setIsLoading(false);
                    })

            })
        }
    }

    const uploadImageStorage = async () => {
        
        const imageBlob = [];

        await Promise.all(
            map(imagesSelected, async image => {
                const response = await fetch(image);
                const blob = await response.blob();
    
                const ref = firebase.storage().ref('restaurants').child(uuid());
    
                await ref.put(blob).then(async result => {
                    await firebase
                            .storage()
                            .ref(`restaurants/${result.metadata.name}`)
                            .getDownloadURL()
                            .then(photo => {
                                imageBlob.push(photo);
                            })
                });
            })
        );

        return imageBlob;

    }

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imagesSelected[0]} />
            <FormAdd 
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage 
                setImagesSelected={setImagesSelected}
                imagesSelected={imagesSelected}
            />
            <Button 
                title="Crear Restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationRestaurant={setLocationRestaurant}
            />
        </ScrollView>
    )
}

function ImageRestaurant({ imageRestaurant }){

    return (
        <View style={styles.viewPhoto}>
            <Image 
                source={
                    imageRestaurant
                    ? { uri: imageRestaurant }
                    : require('../../../assets/img/no-image.png')
                }
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )

}

function FormAdd({setRestaurantName,setRestaurantAddress,setRestaurantDescription, setIsVisibleMap, locationRestaurant}) {
    return (
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Dirección"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: 'material-community',
                    name: 'google-maps',
                    color: locationRestaurant ? CORPORATIVE_COLOR : '#c2c2c2',
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input 
                placeholder="Descripción del restaurante"
                multiline
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map({ isVisibleMap, setIsVisibleMap, setLocationRestaurant }) {

    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            const resultPermission = await Permissions.askAsync(
                Permissions.LOCATION
            )

            const statusPermission = resultPermission.permissions.location.status;

            if (statusPermission !== 'granted') {
                showToast(
                    "Tienes que aceptar los permisos de localización para cear un restaurante", 
                    3000
                );
            } else {

                const loc = await Location.getCurrentPositionAsync({});
                setLocation({ 
                    "latitude": loc.coords.latitude, 
                    "longitude": loc.coords.longitude, 
                    "latitudeDelta": 0.001, 
                    "longitudeDelta": 0.001, 
                })

            }

        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(location);
        showToast('Localización guardada correctamente');
        setIsVisibleMap(false);
    }
    return (
        <Modal isvisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            {
                location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={setLocation}
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            // draggable={true}
                        />
                    </MapView>
                )
            }
            <View style={styles.viewMapBtn}>
                <Button 
                    title="Guardar"
                    containerStyle={styles.viewMapBtnContainerSave}
                    buttonStyle={styles.viewMapBtnSave}
                    onPress={confirmLocation}
                />
                <Button 
                    title="Cancelar" 
                    containerStyle={styles.viewMapBtnContainerCancel}
                    buttonStyle={styles.viewMapBtnCancel}
                    onPress={() => setIsVisibleMap(false)}
                />
            </View>
        </Modal>
    )

}

function UploadImage({ setImagesSelected, imagesSelected }){

    const imageSelect = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);


        if (resultPermission.granted === false) {
            showToast('Es necesario aceptar los permisos de la galería', 3000);
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [ 4, 3 ],
            })

            if (result.cancelled) {
                showToast('Has cerrado la galería sin seleccionar ninguna imagen', 2000);
            }else{
                // console.log('Imagen OK', result.uri);
                setImagesSelected([...imagesSelected, result.uri]);
            }

        }

    }

    const removeImage = (key) => {

        const removeImageState = () => {
            const images = imagesSelected.filter((value, index) => index != key);
            setImagesSelected(images);
        }

        Alert.alert(
            'Eliminar Imagen',
            '¿Estás seguro de que quieres eliminar está imagen?',
            [
                {
                    text: "Cancelar",
                    style: "cancel", 
                },
                {
                    text: "Eliminar",
                    onPress: removeImageState,

                }
            ],
            { cancelable: false }
        );
        
    }

    return (
        <View style={styles.viewImages}>
            {
                size(imagesSelected) < 5 && (
                    <Icon
                        type="material-community"
                        name="camera"
                        color="#7a7a7a"
                        containerStyle={styles.containerIcon}
                        onPress={imageSelect}
                    />
                )
            }
            {
                map(imagesSelected, (imageRestaurant, key) => (
                    <Avatar 
                        key={key} 
                        style={styles.miniatureStyle}
                        source={{ uri: imageRestaurant }}
                        onPress={() => removeImage(key)}
                    />
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: "100%",
        margin: 0,
        padding: 0,
    },
    btnAddRestaurant: {
        backgroundColor: CORPORATIVE_COLOR,
        margin: 20
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },  
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: '100%',
        height: heightScreen*0.7,
    },
    viewMapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: '#a60d0d'
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: CORPORATIVE_COLOR
    }
})
