<template>
 <v-expansion-panels focusable>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <template v-slot:default="{ open }">
          <v-row no-gutters>
            <v-col cols="12"><h3>{{product.name}}</h3></v-col>
            <v-col cols="12"><h3> - </h3></v-col>
            
            <v-col cols="12"> <h4>£{{product.price}}</h4></v-col>
          </v-row>
        </template>
      </v-expansion-panel-header>

      <v-expansion-panel-content>
        <v-layout style="text-align:center;">
            <v-flex xs6 mt-4>
                <v-btn color="success" @click="overlay = !overlay">Buy</v-btn>
            </v-flex>
            <v-flex xs6 mt-4>
                <v-btn color="error">Sell</v-btn>
            </v-flex>
        </v-layout>
        <v-overlay
          :absolute="absolute"
          :opacity="opacity"
          :value="overlay"
        >
        </v-overlay>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>













    <!-- <v-card height="300" style="text-align: center;">
        <v-card-title>{{product.name}}</v-card-title>
        <v-card-text><h3>£{{product.price}}</h3></v-card-text>
        <v-layout>
            <v-flex xs12>
                <v-btn color="success" @click="overlay = !overlay">Buy</v-btn>
                <v-btn color="error">Sell</v-btn>
            </v-flex>
        </v-layout>
        <v-overlay
          :absolute="absolute"
          :opacity="opacity"
          :value="overlay"
        >
          <v-btn
            color="orange lighten-2"
            @click="overlay = false"
          >
            Hide Overlay
          </v-btn>
        </v-overlay>
    </v-card> -->


</template>

<script>
export default {
    props:{
        product: Object
    },
    data:()=>({
        absolute: true,
        opacity: 1,
        overlay: false,
        quantity: 1,

    })

}
</script>

<style>

</style>