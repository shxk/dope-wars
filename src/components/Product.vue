<template>
    <v-container style="overflow:auto; height:350px;">
        <v-flex mx-3>
            <v-expansion-panels focusable>
                <v-expansion-panel v-for="(product,i) in products" :key="i" style="margin-bottom:2%;">
                    <v-expansion-panel-header @click="closeExpandableTabs()">
                        <template v-slot:default="{ open }">
                        <v-row no-gutters>
                            <v-col cols="8"><h3>{{product.name}}</h3></v-col>
                            <v-col cols="4"> <h3 :class="{outrageous: product.outrageous, bottom: product.bottom}">£{{Number(product.price).toLocaleString()}}</h3></v-col>
                            
                            <v-col cols="12" style="padding-top:3%; padding-bottom:3%; padding-right:2%;"> 
                                <template>
                                    <v-divider></v-divider>
                                </template>
                            </v-col>
                            
                            <v-col cols="8"> <h4>Inventory : {{ currentProdInv(product) }} </h4></v-col>
                            <v-col cols="4"> <h4>Avg : £{{ Number(avgPurchasePrice(product)).toLocaleString() }} </h4></v-col>
                        </v-row>
                        </template>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-layout style="text-align:center;">
                            <v-flex xs6 mt-4>
                                <v-btn color="success" :disabled="cash < product.price" @click="buyOverlay = !buyOverlay">Buy</v-btn>
                            </v-flex>
                            <v-flex xs6 mt-4>
                                <v-btn color="error" :disabled="currentProdInv(product) < 1" @click="sellOverlay = !sellOverlay">Sell</v-btn>
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
                                    <v-btn text @click="buyOverlay = !buyOverlay, quantity = 0">X</v-btn>
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
                                    <v-btn text @click="sellOverlay = !sellOverlay, sellQuantity = 0">X</v-btn>
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
        inventoryLeft(){
            return this.inventoryamount - this.inventoryproducts.length
        }
        
    },
    methods:{
        currentProdInv(product){
            // returns amount you have currently of specific product
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
            // returns the average price you've paid for the current inventory of specific product
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
            if(self.quantity < self.inventoryLeft && self.quantity < self.maxAllowedToBuy(product)){
                self.quantity++
            }
        },
        maxBuyQuantity(product){
            const self = this;
            while(self.quantity < self.inventoryLeft && self.quantity < self.maxAllowedToBuy(product)){
                self.quantity++
            }
        },
        halfBuyQuantity(product){
            const self = this;
            while(self.quantity < self.inventoryLeft && self.quantity < self.maxAllowedToBuy(product)){
                self.quantity++
            }
            self.quantity = Math.floor(self.quantity /2)
        },
        maxAllowedToBuy(product){
            const self = this
            return Math.floor(self.cash/product.price)
        },
        buyProduct(product){
            const self = this;
            let purchasePrice = self.quantity * product.price

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
            if(self.sellQuantity < self.maxAllowedToSell(product)){
                self.sellQuantity++
            }
        },
        maxSellQuantity(product){
            const self = this;
            self.sellQuantity = self.maxAllowedToSell(product);
            
        },
        halfSellQuantity(product){
            const self = this;
            self.sellQuantity = Math.floor(self.maxAllowedToSell(product)/2);
        },
        maxAllowedToSell(product){
            const self = this;
            let amountAvaliableToSell = 0;
            self.inventoryproducts.forEach(element=>{
                if(product.id == element.id){
                    amountAvaliableToSell++
                }
            });
            return amountAvaliableToSell
        },
        sellProduct(product){
            const self = this;
            let salePrice = self.sellQuantity * product.price
            let sold = 0;

            for(let i = 0; i < self.inventoryproducts.length; i++){
                if(self.inventoryproducts[i].id == product.id && sold < self.sellQuantity){
                    sold++
                    self.inventoryproducts.splice(i,1)
                    self.$emit('updateCashSell', product.price)    
                    i = -1;
                }
            }
            self.sellQuantity = 0;
            self.sellOverlay = false;
        },
    }
}
</script>

<style>
.outrageous{
    color: red
}
.bottom{
    color: green
}
</style>