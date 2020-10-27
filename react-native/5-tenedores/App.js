import React from 'react';
import { YellowBox } from "react-native";
import { firebaseApp } from './app/utils/firebase';
import Navigation from './app/navigations/Navigation';
import { RootSiblingParent } from "react-native-root-siblings";
// import * as firebase from 'firebase';

YellowBox.ignoreWarnings([
  "Setting a timer",
])

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