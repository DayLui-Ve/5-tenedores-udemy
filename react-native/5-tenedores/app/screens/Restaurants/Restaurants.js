import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from "react-native";
import { Icon,  } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app';
import "firebase/firestore";
import ListRestaurants from '../../components/Restaurant/ListRestaurants';

const db = firebase.firestore(firebaseApp);

export default function Restaurants({ navigation }) {

    const [user, setUser] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [totalRestaurants, setTotalRestaurants] = useState(0);
    const [startRestaurants, setStartRestaurants] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const limitRestaurant = 8;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            setUser(userInfo);
        })
    }, []);

    useEffect(() => {
        db.collection("restaurants").get()
            .then(snap => {
                setTotalRestaurants( snap.size )
            })

        const resultRestaurants = [];

        db.collection("restaurants")
            .orderBy("createdAt", 'desc')
            .limit(limitRestaurant)
            .get()
            .then(snap => {
                setStartRestaurants(snap.docs[snap.docs.length -1]);

                snap.forEach(doc => {
                    resultRestaurants.push({
                        ...doc.data(),
                        id: doc.id
                    });
                })

                setRestaurants(resultRestaurants);

            })
    }, [])

    const handleLoadMore = () => {
        const resultRestaurants = [];
        restaurants.length < totalRestaurants && setIsLoading(true);

        db.collection("restaurants")
            .orderBy("createdAt", 'desc')
            .startAfter(startRestaurants.data().createdAt)
            .limit(limitRestaurant)
            .get()
            .then(response => {
                if (response.docs.length > 0) {
                    setStartRestaurants(response.docs[response.docs.length - 1])
                } else {
                    setIsLoading(false);
                }

                response.forEach(doc => {
                    resultRestaurants.push({
                        ...doc.data(),
                        id: doc.id
                    });
                });

                setRestaurants([...restaurants, ...resultRestaurants])

            })

    }

    return (
        <View style={styles.viewBody}>
            <ListRestaurants 
                restaurants={restaurants}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />

            { user && (<Icon
                reverse
                type="material-community"
                name="plus"
                color="#00a680"
                containerStyle={styles.btnContainer}
                onPress={() => navigation.navigate('add-restaurant')}
            />)}

        </View>
    );

}

const styles = StyleSheet.create({
    viewBody: {
        flex:1,
        backgroundColor: '#fff',
    },
    btnContainer:{
        position: 'absolute',
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 0.5
    },
})