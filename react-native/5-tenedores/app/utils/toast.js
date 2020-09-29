// TODO: Para mostrar un toast sencillo en React Native
import ToastRoot from "react-native-root-toast";

const showToast = (message) => {
    ToastRoot.show(message, {
        duration: ToastRoot.durations.SHORT,
        position: ToastRoot.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        opacity: 0.7,
    });
};


export {
    showToast,
}