<template>
<v-container style="overflow:auto; height:350px;">
    <v-flex mx-3>
    <v-expansion-panels>
        <v-expansion-panel v-for="(product,i) in products" :key="i" style="margin-bottom:2%;">
            <v-expansion-panel-header @click="closeExpandableTabs()">
                <template v-slot:default="{ open }">
                <v-row no-gutters>
                    <v-col cols="12"><h3>{{product.name}}</h3></v-col>
                    <v-col cols="12"><h3> - </h3></v-col>
                    <v-col cols="12"> <h4>£{{Number(product.price).toLocaleString()}}</h4></v-col>
                    <v-col cols="3"> <h4>Inventory : {{ currentProdInv(product) }} </h4></v-col>
                    <v-col cols="6"> <h4>Avg : £{{ Number(avgPurchasePrice(product)).toLocaleString() }} </h4></v-col>
                </v-row>
                </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-layout style="text-align:center;">
                    <v-flex xs6 mt-4>
                        <v-btn color="success" @click="buyOverlay = !buyOverlay, $store.commit('setDisable')">Buy</v-btn>
                    </v-flex>
                    <v-flex xs6 mt-4>
                        <v-btn color="error" @click="sellOverlay = !sellOverlay, $store.commit('setDisable')">Sell</v-btn>
                    </v-flex>
                </v-layout>

                <!-- Buy Overlay screen -->
                <v-overlay
                :absolute="absolute"
                :opacity="opacity"
                :value="buyOverlay"
                >
                    <v-layout>
                        <v-flex xs4 mb-2>
                            {{product.name}}  £ {{product.price}}
                        </v-flex>
                        <v-flex xs2 offset-xs6 mb-2>
                            <v-btn text @click="buyOverlay = !buyOverlay, quantity = 0, $store.commit('unsetDisable')">X</v-btn>
                        </v-flex>
                    </v-layout>
                    
                    <v-layout mb-2>
                        <v-flex xs4>
                            <v-btn color="secondary" @click="decreaseBuyQuantity()">-</v-btn> 
                        </v-flex>
                        <v-flex xs5 style="text-align:center;">
                            <span>{{quantity}}</span> 
                        </v-flex>
                        <v-flex xs2>
                            <v-btn color="primary" @click="increaseBuyQuantity(product)">+</v-btn>
                        </v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex xs7>
                            <v-btn color="success" @click="halfBuyQuantity(product)">Half</v-btn>
                        </v-flex>
                        <v-flex xs6>
                            <v-btn color="success" @click="buyProduct(product)">Buy</v-btn>
                        </v-flex>
                        <v-flex xs3>
                            <v-btn color="success" @click="maxBuyQuantity(product)">Max</v-btn>
                        </v-flex>
                    </v-layout>
                </v-overlay>

                <!-- sell overlayscreen--> 
                <v-overlay
                :absolute="absolute"
                :opacity="opacity"
                :value="sellOverlay"
                >
                    <v-layout>
                        <v-flex xs4 mb-2>
                            {{product.name}}  £ {{Number(product.price).toLocaleString()}}
                        </v-flex>
                        <v-flex xs2 offset-xs6 mb-2>
                            <v-btn text @click="sellOverlay = !sellOverlay, sellQuantity = 0, $store.commit('unsetDisable')">X</v-btn>
                        </v-flex>
                    </v-layout>
                    
                    <v-layout mb-2>
                        <v-flex xs4>
                            <v-btn color="secondary" @click="decreaseSellQuantity()">-</v-btn> 
                        </v-flex>
                        <v-flex xs5 style="text-align:center;">
                            <span>{{sellQuantity}}</span> 
                        </v-flex>
                        <v-flex xs2>
                            <v-btn color="primary" @click="increaseSellQuantity(product)">+</v-btn>
                        </v-flex>
                    </v-layout>
                    <v-layout>
                        <v-flex xs7>
                            <v-btn color="success" @click="halfSellQuantity(product)">Half</v-btn>
                        </v-flex>
                        <v-flex xs6>
                            <v-btn color="success" @click="sellProduct(product)">Sell</v-btn>
                        </v-flex>
                        <v-flex xs3>
                            <v-btn color="success" @click="maxSellQuantity(product)">Max</v-btn>
                        </v-flex>
                    </v-layout>
                </v-overlay>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</v-flex>

</v-container>

    
 <!-- <v-expansion-panels focusable :disabled="disabled">
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
                <v-btn color="success" @click="buyOverlay = !buyOverlay, $store.commit('setDisable')">Buy</v-btn>
            </v-flex>
            <v-flex xs6 mt-4>
                <v-btn color="error" @click="sellOverlay = !sellOverlay, $store.commit('setDisable')">Sell</v-btn>
            </v-flex>
        </v-layout> -->
        <!-- Buy Overlay screen -->
        <!-- <v-overlay
          :absolute="absolute"
          :opacity="opacity"
          :value="buyOverlay"
        >
            <v-layout>
                <v-flex xs4 mb-2>
                    {{product.name}}  £ {{product.price}}
                </v-flex>
                <v-flex xs2 offset-xs6 mb-2>
                    <v-btn text @click="buyOverlay = !buyOverlay, quantity = 0, $store.commit('unsetDisable')">X</v-btn>
                </v-flex>
            </v-layout>
            
            <v-layout mb-2>
                <v-flex xs4>
                    <v-btn color="secondary" @click="decreaseBuyQuantity()">-</v-btn> 
                </v-flex>
                <v-flex xs5 style="text-align:center;">
                    <span>{{quantity}}</span> 
                </v-flex>
                <v-flex xs2>
                    <v-btn color="primary" @click="increaseBuyQuantity()">+</v-btn>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex xs7>
                    <v-btn color="success" @click="halfBuyQuantity()">Half</v-btn>
                </v-flex>
                <v-flex xs6>
                    <v-btn color="success" @click="buyProduct()">Buy</v-btn>
                </v-flex>
                <v-flex xs3>
                    <v-btn color="success" @click="maxBuyQuantity()">Max</v-btn>
                </v-flex>
            </v-layout>
        </v-overlay> -->

        <!-- sell overlayscreen
         -->
         <!-- <v-overlay
          :absolute="absolute"
          :opacity="opacity"
          :value="sellOverlay"
        >
            <v-layout>
                <v-flex xs4 mb-2>
                    {{product.name}}  £ {{product.price}}
                </v-flex>
                <v-flex xs2 offset-xs6 mb-2>
                    <v-btn text @click="sellOverlay = !sellOverlay, sellQuantity = 0, $store.commit('unsetDisable')">X</v-btn>
                </v-flex>
            </v-layout>
            
            <v-layout mb-2>
                <v-flex xs4>
                    <v-btn color="secondary" @click="decreaseSellQuantity()">-</v-btn> 
                </v-flex>
                <v-flex xs5 style="text-align:center;">
                    <span>{{sellQuantity}}</span> 
                </v-flex>
                <v-flex xs2>
                    <v-btn color="primary" @click="increaseSellQuantity()">+</v-btn>
                </v-flex>
            </v-layout>
            <v-layout>
                <v-flex xs7>
                    <v-btn color="success" @click="halfSellQuantity()">Half</v-btn>
                </v-flex>
                <v-flex xs6>
                    <v-btn color="success" @click="sellProduct()">Sell</v-btn>
                </v-flex>
                <v-flex xs3>
                    <v-btn color="success" @click="maxSellQuantity()">Max</v-btn>
                </v-flex>
            </v-layout>
        </v-overlay>



      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels> -->
</template>

<script>
import store from "../store"
export default {
    props:{
        products:Array,
        inventoryamount: Number,
        cash: Number,
        inventoryproducts: Array,
        disabled: Boolean
    },
    data:()=>({
        absolute: true,
        opacity: 1,
        buyOverlay: false,
        sellOverlay: false,
        quantity: 0,
        sellQuantity: 0,
    }),
    computed:{
        
    },
    methods:{
        currentProdInv(product){
            const self = this;
            let count = 0;
            for (let i = 0; i < self.inventoryproducts.length; i++) {
                if(self.inventoryproducts[i].id == product.id){
                    count++
                }
            }
            return count
        },
        avgPurchasePrice(product){
            const self = this;
            let count = 0;
            let avgPP = 0;

            for (let i = 0; i < self.inventoryproducts.length; i++) {
                if(self.inventoryproducts[i].id == product.id){
                    count++
                    avgPP += self.inventoryproducts[i].price
                }
            }
            
            if(count>0)
                // avgPP = Math.floor(avgPP/count);
                avgPP = Math.floor(avgPP/count)
            return avgPP
        },
        closeExpandableTabs(){
            const self = this;
            self.buyOverlay = false;
            self.sellOverlay = false;
            self.quantity = 0
            self.sellQuantity = 0;
        },
        decreaseBuyQuantity(){
            const self = this;
            self.quantity != 0 ? self.quantity-- : ""
        },
        increaseBuyQuantity(product){
            const self = this;
            let inventoryLeft = self.inventoryamount - self.inventoryproducts.length
            let maxInventory = Math.floor(self.cash/product.price);

            if(self.quantity < inventoryLeft && self.quantity < maxInventory){
                self.quantity++
            }
        },
        maxBuyQuantity(product){
            const self = this;

            let inventoryLeft = self.inventoryamount - self.inventoryproducts.length
            let maxInventory = Math.floor(self.cash/product.price);

            while(self.quantity < inventoryLeft && self.quantity < maxInventory){
                self.quantity++
            }



            // self.quantity = Math.floor(self.cash/product.price);
        },
        halfBuyQuantity(product){
            const self = this;

            let inventoryLeft = self.inventoryamount - self.inventoryproducts.length
            let maxInventory = Math.floor(self.cash/product.price);

            while(self.quantity < inventoryLeft && self.quantity < maxInventory){
                self.quantity++
            }
            self.quantity = Math.floor(self.quantity /2)
        },
        buyProduct(product){
            const self = this;
            let purchasePrice = self.quantity * product.price
            console.log(purchasePrice)

            if(purchasePrice <= self.cash && self.quantity > 0){
                for (let i = 0; i < self.quantity; i++) {
                    //push without memory reference so it is a copy not a linked thing
                    self.inventoryproducts.push(JSON.parse(JSON.stringify(product)))
                } 
                self.$emit('updateCashBuy', purchasePrice)    
            }
            self.buyOverlay = false;
        },



        decreaseSellQuantity(){
            const self = this;
            self.sellQuantity > 0 ? self.sellQuantity-- : ""
        },

        increaseSellQuantity(product){
            const self = this;

            let amountAvaliableToSell = 0;

            self.inventoryproducts.forEach(element=>{
                if(product.id == element.id){
                    amountAvaliableToSell++
                }
            });

            if(self.sellQuantity < amountAvaliableToSell){
                self.sellQuantity++
            }
        },
        maxSellQuantity(product){
            const self = this;
            let amountAvaliableToSell = 0;

            self.inventoryproducts.forEach(element=>{
                if(product.id == element.id){
                    amountAvaliableToSell++
                }
            });

            self.sellQuantity = amountAvaliableToSell;
            
        },
        halfSellQuantity(product){
            const self = this;
            let amountAvaliableToSell = 0;

            self.inventoryproducts.forEach(element=>{
                if(product.id == element.id){
                    amountAvaliableToSell++
                }
            });

            self.sellQuantity = amountAvaliableToSell/2;
        },
        sellProduct(product){
            const self = this;

            let salePrice = self.sellQuantity * product.price
            console.log(salePrice)

            let sold = 0;

            for(let i = 0; i < self.inventoryproducts.length; i++){
                if(self.inventoryproducts[i].id == product.id && sold < self.sellQuantity){
                    sold++
                    console.log("SOLDD")
                    self.inventoryproducts.splice(i,1)
                    self.$emit('updateCashSell', product.price)    
                    i = -1;
                }
            }
            self.sellOverlay = false;
        },
    }

}
</script>

<style>

</style>