
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Splash from './Splash';



const index = () => {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Splash />
        </View>
    )
}

export default index