import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Overlay } from "react-native-elements";

export default function Modal(props) {

    const { isvisible, setIsVisible, children } = props

    return (
        <Overlay
            windowBackgroundColor="rgba(0,0,0,0.5)"
            overlayBackgroundColor="transparent"
            overlayStyle={styles.overlay}
            isVisible={isvisible}
            onBackdropPress={() => setIsVisible(false)}
        >
            <View>
                {children}
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    overlay: {
        height: "auto",
        width: "90%",
        backgroundColor: "#fff"
    }
})
