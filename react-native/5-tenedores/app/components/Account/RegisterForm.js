import React, { useState } from 'react'
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from '../Loading';
import { CORPORATIVE_COLOR } from '../../utils/color';
import { validateEmail } from '../../utils/validations';
import { size, isEmpty } from "lodash";
// import Toast from 'react-native-simple-toast'
import * as firebase from 'firebase';
import { useNavigation } from "@react-navigation/native";
import { showToast } from '../../utils/toast';

export default function RegisterForm(props) {

  // console.log(props);
  // const { toastRef } = props
  // console.log(toastRef);

  const [showPassword, setShowPassword] = useState(false)

  const [showRepeatPassword, setShowRepeatPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState(defaultFormValue())

  const navigation = useNavigation();

  const onSubmit = () => {
    // console.log(formData)

    // console.log(validateEmail(formData.email))
// csdcmsdomci

    if (
      isEmpty(formData.email) &&
      isEmpty(formData.password) &&
      isEmpty(formData.repeatPassword)
    ) {
      // console.log('Todos los campos son requeridos')
      // toastRef.current.show("Todos los campos son requeridos");
      showToast("Todos los campos son requeridos");
      // ToastRoot.show("Todos los campos son requeridos");
      // Toast.show("Todos los campos son requeridos", {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM,
      //   shadow: true,
      //   animation: true,
      //   hideOnPress: true,
      //   delay: 0,
      // });
    }else if (!validateEmail(formData.email)) {
      showToast('El email es inválido')
    }else if (formData.password !== formData.repeatPassword) {
      showToast('Las contraseñas deben ser iguales')
    }else if ( (size(formData.password) < 6) ) {
      showToast('Las contraseñas deben ser mínimo 6 caracteres')
    }else{
      setLoading(true)
      // TODO: Lo fácil que es registrar un usuario con firebase
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(response => {
          setLoading(false);
          navigation.navigate("account");
        })
        .catch(() => {
          setLoading(false);
          showToast('El email ya está en uso')
        })
    }

  }

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text
    })
  }

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.inputForm}
        onChange={e => onChange(e, 'email')}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        password
        secureTextEntry={!showPassword}
        onChange={e => onChange(e, 'password')}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline": "eye-outline"}
            onPress={() => setShowPassword(!showPassword)}
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Repetir contraseña"
        containerStyle={styles.inputForm}
        password
        secureTextEntry={!showRepeatPassword}
        onChange={e => onChange(e, 'repeatPassword')}
        rightIcon={
          <Icon
            type="material-community"
            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
            iconStyle={styles.iconRight}
          />
        }
      />
      <Button
        title={"Unirse"}
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Registrando cuenta"/>
    </View>
  );

}

const defaultFormValue = () => ({
  email:'',
  password:'',
  repeatPassword:'',
}) 

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: CORPORATIVE_COLOR,
  },
  iconRight: {
      color: '#c1c1c1'
  }
});