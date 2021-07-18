import React from 'react'
import { 
    StyleSheet, 
    Text, 
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { Image } from "react-native-elements";
import { size } from "lodash";

export default function ListRestaurants({ restaurants, handleLoadMore, isLoading }) {
    return (
        <View>
            { 
                size(restaurants) > 0
                ?(<FlatList 
                    data={restaurants}
                    renderItem={(restaurant) => <Restaurant restaurant={restaurant}/>}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />)
                :(<View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando restaurantes</Text>
                </View>)
            }
        </View>
    )
}

function Restaurant({ restaurant }){

    const { images, name, description, address } = restaurant.item;
    const imageMainRestaurant = images[0];

    console.log(restaurant)

    const goRestaurant = () => {
        console.log('go restaurant')
    }

    return (
        <TouchableOpacity onPress={ () => goRestaurant() }>
            <View style={styles.viewRestaurant}>
                <View style={styles.viewRestaurantImage}>
                    <Image 
                        resizeMode='cover' 
                        PlaceholderContent={<ActivityIndicator color="fff" />}
                        source={
                            imageMainRestaurant
                            ? { uri: imageMainRestaurant }
                            : require('../../../assets/img/no-image.png')
                        }
                        style={styles.imageRestaurant}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text numberOfLines={2} style={styles.restaurantDescription}>{description}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList({ isLoading }){

    if (isLoading) {
        return(
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return (
            <View style={styles.notFoundRestaurants}>
                <Text>No quedan restaurantes por cargar</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center"
    },
    viewRestaurant: {
        flexDirection: 'row',
        margin: 10,
    },
    viewRestaurantImage: {
        marginRight: 15
    },  
    imageRestaurant: {
        height: 80,
        width: 80
    },
    restaurantName: {
        fontWeight: 'bold'
    },
    restaurantAddress: {
        paddingTop: 2,
        color: 'grey'
    },
    restaurantDescription: {
        paddingTop: 2,
        color: 'grey',
        width: 300
    },
    notFoundRestaurants: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'center'
    }
})
