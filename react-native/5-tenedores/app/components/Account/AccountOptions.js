import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from "react-native-elements";
import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function AccountOptions(props) {

    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)
    const { userInfo, setReloadUserInfo } = props;
    // console.log("ChangeDisplayNameForm", userInfo);

    const selectComponent = (key) => {
        switch (key) {
            case 'displayName':
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true)
                break;
            case 'email':
                setRenderComponent(
                    <ChangeEmailForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true)
                break;
            case 'password':
                setRenderComponent(<ChangePasswordForm 
                    setShowModal={setShowModal}
                />)
                setShowModal(true)
                break;
        
            default:
                setRenderComponent(null)
                setShowModal(false);
                break;
        }
    };

    const menuOptions = generateOptions(selectComponent);

    return (
        <View>
            {menuOptions.map((item, index) => (
                <ListItem
                    key={index}
                    leftIcon={{
                        type: item.iconType,
                        name: item.iconNameLeft,
                        color: item.iconColorLeft,
                    }}
                    rightIcon={{
                        type: item.iconType,
                        name: item.iconNameRight,
                        color: item.iconColorRight,
                    }}
                    title={item.title}
                    containerStyle={styles.menuItem}
                    onPress={item.onPress}
                />
            ))}
            {renderComponent && (
                <Modal isvisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            )}
        </View>
    );
}

function generateOptions(selectComponent) {
    return [
        {
            title: "Cambiar nombre y apellido",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("displayName"),
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("email"),
        },
        {
            title: "Cambiar Contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("password"),
        },
    ];
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    }
});
