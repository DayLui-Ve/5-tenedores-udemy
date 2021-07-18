import React from 'react';
import { YellowBox } from "react-native";
import { firebaseApp } from './app/utils/firebase';
import Navigation from './app/navigations/Navigation';
import { RootSiblingParent } from "react-native-root-siblings";
import { decode, encode } from "base-64";
// import * as firebase from 'firebase';


YellowBox.ignoreWarnings([
  "Setting a timer",
]);

if(!global.btoa) global.btoa = encode;
if(!global.atob) global.atob = decode;

export default function App() {

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(user => {
  //     console.log(user)
  //   })
  // }, [])

  return (
    <RootSiblingParent>
      <Navigation />
    </RootSiblingParent>
  );
}