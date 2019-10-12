<template>
    <v-card style="text-align: center;">
        <v-card-title>{{product.name}}</v-card-title>
        <v-card-text>£{{product.price}}</v-card-text>
        <v-layout>
            <v-flex xs12>
                <v-btn color="success">Buy</v-btn>
                <v-btn color="error">Sell</v-btn>
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