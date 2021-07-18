import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/Restaurant/AddRestaurantForm';

export default function AddRestaurant({ navigation }) {

    const [isLoading, setIsLoading] = useState(false);

    return (
        <View>
            <AddRestaurantForm 
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Loading isVisible={isLoading} text="Creando restaurante" />
        </View>
    )
}

const styles = StyleSheet.create({})
