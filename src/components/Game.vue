<template>
  <v-container>
    <v-layout wrap>
        <v-flex>
        <h1 class="display-2 font-weight-bold mb-3">
          Day {{days}}/30
        </h1>
      </v-flex>
    </v-layout>

    <v-layout wrap>
     <!-- Dashboard? -->
     <v-flex xs12>
       <v-layout row>
         <v-flex xs12 mb-4 v-for="(product,i) in products" :key="i">
          <product :product="product">
          </product>
         </v-flex>

       </v-layout>
     </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import Product from "./Product";

export default {
  components: {
    Product
  },
  data: () => ({
    days:1,
    products:[
      {
        id: 1,
        name:"Cocaine",
        price:0, 
        pricerange:"high",

      },
      {
        id:2,
        name:"Heroin", 
        price:0, 
        pricerange:"high", 
      },
      {
        id:3,
        name:"Speed", 
        price:0, 
        pricerange:"high", 
      },
      {
        id:4,
        name:"Weed",
        price:0,  
        pricerange:"high", 
      },
    ],
    bank: 2000,
    inventoryAmount: 100,
    inventoryProducts:[
      //Push object of products into here that includes name, id, and price bought at
    ],
    locations:[
      {name:"London"},
      {name:"Manchester"},
      {name:"Birmingham"},
      {name:"Leeds"},
      {name:"Bristol"},
    ],
    debt: 2000,
    events:[
      {

      }
    ]
  }),



};
</script>

<style scoped>

</style>
