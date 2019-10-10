<template>
    <v-card>
        <v-card-title>{{product.name}}</v-card-title>
        <v-card-text>£{{product.price}}</v-card-text>
        <v-layout>
            <v-flex xs6>
                <v-btn>Buy</v-btn>
                <v-btn>Sell</v-btn>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    props:{
        product: Object

    },
    data:()=>({

    })

}
</script>

<style>

</style>