import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import RestaurantsStack from '../navigations/RestaurantsStack'
import FavoritesStack from '../navigations/FavoritesStack'
import TopRestaurantsStack from '../navigations/TopRestaurantsStack'
import SearchStack from '../navigations/SearchStack'
import AccountStack from '../navigations/AccountStack'
import { CORPORATIVE_COLOR } from '../utils/color';

const Tab = createBottomTabNavigator()

export default function Navigation() {

    return (
      <NavigationContainer>
        <Tab.Navigator 
            initialRouteName="restaurants"
            tabBarOptions={{
              inactiveTintColor: '#646464',
              activeTintColor: CORPORATIVE_COLOR
            }}
            screenOptions={({route}) => ({
              tabBarIcon: ({ color }) => screenOptions(route, color)
            })}
          >
          <Tab.Screen
            name="restaurants"
            component={RestaurantsStack}
            options={{
              title: "Restaurantes",
            }}
          />
          <Tab.Screen
            name="favorites"
            component={FavoritesStack}
            options={{
              title: "Favoritos",
            }}
          />
          <Tab.Screen
            name="top-restaurants"
            component={TopRestaurantsStack}
            options={{
              title: "Top 5",
            }}
          />
          <Tab.Screen
            name="search"
            component={SearchStack}
            options={{
              title: "Buscar",
            }}
          />
          <Tab.Screen
            name="accounts"
            component={AccountStack}
            options={{
              title: "Cuenta",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );

}


function screenOptions( route, color ){

  let iconName;

  switch (route.name) {
    case "restaurants":
      iconName = 'compass-outline'
      break;
    case "favorites":
      iconName = 'heart-outline'
      break;
    case "top-restaurants":
      iconName = 'star-outline'
      break;
    case "search":
      iconName = 'magnify'
      break;
    case "accounts":
      iconName = 'home-outline'
      break;

    default:
      break;
  }

  return (
    <Icon name={iconName} type={'material-community'} size={22} color={color} />
  )

}