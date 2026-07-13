import {View, Text, TouchableOpacity, Image} from 'react-native'
import React from 'react'
import {images} from "@/constants";
// import {useCartStore} from "@/store/cart.store";
import {router} from "expo-router";

const CartButton = () => {
    // const { getTotalItems } = useCartStore();
    const totalItems = 3;

    return (
         <TouchableOpacity>
            <Image source={images.bag} className="size-5 bg-black " resizeMode="contain" />

            {totalItems > 0 && (
                <View className="cart-badge">
                    <Text className="small-bold text-white">{totalItems}</Text>
                </View>
            )}
        </TouchableOpacity>
    )
}
export default CartButton