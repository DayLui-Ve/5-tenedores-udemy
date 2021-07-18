// TODO: Para mostrar un toast sencillo en React Native
import ToastRoot from "react-native-root-toast";

const showToast = (message, delay = 0) => {
    ToastRoot.show(message, {
        duration: ToastRoot.durations.SHORT,
        position: ToastRoot.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay,
        opacity: 0.7,
    });
};


export {
    showToast,
}