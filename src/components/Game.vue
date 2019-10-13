<template>
    <!-- Whats Left:
      events & Implement more than 1 random event
      police
      collapse tab when going next day
      -->
  <v-container>
    <!-- End Game dialog box  -->
    <div class="text-center">
      <v-dialog
        v-model="dialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Game Over
          </v-card-title>

          <v-card-text style="text-align:center;">
            You finished the game with:
          </v-card-text>
          <v-card-text style="text-align:center;">
            Account: £{{Number(cash).toLocaleString()}}
          </v-card-text>
          <v-card-text style="text-align:center;">
            Debt: £{{Number(debt).toLocaleString()}}
          </v-card-text>
          <v-card-text style="text-align:center;">
            Final Amount: £{{Number(cash-debt).toLocaleString()}}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="primary"
              text
              @click="newGame()"
            >
              New Game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Move Location dialog box  -->
    <div class="text-center">
      <v-dialog
        v-model="locationDialog"
        persistent 
        width="500"
      >
        <v-card
          class="mx-auto"
          tile
        >
          <v-list rounded>
            <v-subheader>MOVE LOCATION</v-subheader>
            <v-list-item-group v-model="currentLocation.id" color="primary">
              <v-list-item
                v-for="(location, i) in locations"
                :key="i" @click="changeLocation(location)" :disabled="isLocationDisabled(location)"
              >
                <v-list-item-icon>
                  <v-icon v-text="location.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="location.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-dialog>
    </div>

    <!-- Events dialog box  -->
    <div class="text-center">
      <v-dialog
        v-model="eventDialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            News bulletin
          </v-card-title>

          <v-card-text style="text-align:center;">
            <v-list v-for="(event, i) in currentEvents" :key="i">
              <li :class="{bottom: event.type == 0, outrageous: event.type == 1}">{{event.message}}</li>
            </v-list>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="primary"
              text
              @click="eventDialog = false"
            >
              Okay
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!-- Pay debt dialog box  -->
    <div class="text-center">
      <v-dialog
        v-model="debtDialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Pay Debt
          </v-card-title>

          <v-card-text style="text-align:center;">
            <v-row>
              <v-col class="pr-4">
                <v-slider
                  v-model="payDebtAmount"
                  class="align-center"
                  :max="maxPayDebtAmountComputed"
                  :min="0"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="payDebtAmount"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 60px"
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn color="success" @click="payDebt()">Pay</v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="primary"
              text
              @click="debtDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-layout wrap>
     <!-- Dashboard -->
     <v-flex xs12 md4 offset-md4 mb-3>
       <v-card style="text-align:center;">
           <v-layout pt-2>
             <v-flex xs6>
              <h1 class="font-weight-bold mb-3">
                 Day {{days}}/30
              </h1>
             </v-flex>
             <v-flex xs6>
              <h1>{{currentLocation.name}}</h1>
             </v-flex>
           </v-layout>

           <v-layout>
             <v-flex xs4>
               <h5>Debt</h5>
               £{{Number(debt).toLocaleString()}}
             </v-flex>
             <v-flex xs4>
               <h2>Cash</h2>
                £{{Number(cash).toLocaleString()}}
             </v-flex>
             <v-flex xs4>
               <h5>Inventory</h5>
                {{inventoryProducts.length}}/{{inventoryAmount}}
             </v-flex>
           </v-layout>

            <v-layout>
              <v-flex xs4 mt-3 pb-5>
                <v-btn text color="warning" @click="debtDialog = true">Pay debt</v-btn>
              </v-flex>
              <v-flex xs4 mt-3 pb-5>
                <v-btn color="info" @click="nextDay">{{turnBtn}}</v-btn>
              </v-flex>
          </v-layout>
       </v-card>
     </v-flex>

     <!-- Products -->
     <v-flex xs12 md4 offset-md4>
       <v-layout row>
         <product @updateCashBuy="updateCashBuy" @updateCashSell="updateCashSell" :products = products :inventoryamount="inventoryAmount" :cash="cash" :inventoryproducts="inventoryProducts"></product>
         <!-- <v-flex xs12 mx-3 mb-3 v-for="(product,i) in products" :key="i">
          <product @updateCash="updateCash" :disabled="isExpandDisable" :product="product" :inventoryamount="inventoryAmount" :cash="cash" :inventoryproducts="inventoryProducts">
          </product>
         </v-flex> -->
       </v-layout>
     </v-flex>

    </v-layout>

  </v-container>
</template>

<script>
import Product from "./Product";
import store from "../store"
export default {
  components: {
    Product
  },
  data: () => ({
    dialog: false,
    locationDialog: false,
    eventDialog: false,
    debtDialog: false,
    turnBtn: "Next Day",
    days:1,
    inventoryAmount: 100,
    payDebtAmount:0,
    debt: 5500,
    cash: 2000,
    products:[
      {
        id: 0,
        name:"Cocaine",
        price:0,
        minprice: 17000,
        maxprice: 29000,
        bottomoutmin: 6000,
        bottomoutmax: 13000,
        outrageousmin: 60000,
        outrageousmax: 120000,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"There's been a suspicious amount of cocaine pumped into the city... prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"Cops have made a massive drug bust, cocaine prices have skyrocketed!",
        }
      },
      {
        id:1,
        name:"Heroin", 
        price:0,
        minprice: 7000,
        maxprice: 15000,
        bottomoutmin: 3000,
        bottomoutmax: 5000,
        outrageousmin: 35000,
        outrageousmax: 50000,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Market is flooded with cheap heroin!",
        },
        outrageousEvent:{
          type:1,
          message:"Addicts can't get enough. Heroin prices are up!",
        }
      },
      {
        id:2,
        name:"Speed", 
        price:0,
        minprice: 150,
        maxprice: 250,
        bottomoutmin: 60,
        bottomoutmax: 100,
        outrageousmin: 400,
        outrageousmax: 700,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Speed prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"Speed prices are up!",
        }
      },
      {
        id:3,
        name:"Weed",
        price:0,
        minprice: 400,
        maxprice: 750,
        bottomoutmin: 80,
        bottomoutmax: 250,
        outrageousmin: 1100,
        outrageousmax: 1900,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"New supplier been in the city undercutting the weed prices!",
        },
        outrageousEvent:{
          type:1,
          message:"Huge amounts of weed seized! Prices have risen",
        }
      },
      {
        id:4,
        name:"Opium",
        price:0,
        minprice: 600,
        maxprice: 1200,
        bottomoutmin: 300,
        bottomoutmax: 450,
        outrageousmin: 2500,
        outrageousmax: 7000,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Opium prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"Opium addiction! Prices are up",
        }
      },
      {
        id:5,
        name:"PCP",
        price:0,
        minprice: 1200,
        maxprice: 2500,
        bottomoutmin: 850,
        bottomoutmax: 1000,
        outrageousmin: 4000,
        outrageousmax: 6000,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"PCP prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"PCP prices are up!",
        }
      },
      {
        id:6,
        name:"Meth",
        price:0,
        minprice: 400,
        maxprice: 900,
        bottomoutmin: 200,
        bottomoutmax: 250,
        outrageousmin: 5000,
        outrageousmax: 8000,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Meth prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"A strange blue coloured meth has got people hooked. People are paying outrageous amounts",
        }
      },
      {
        id:7,
        name:"Ludes",
        price:0,
        minprice: 10,
        maxprice: 60,
        bottomoutmin: 3,
        bottomoutmax: 6,
        outrageousmin: 110,
        outrageousmax: 190,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Local pharmacy raided, cheap ludes available !",
        },
        outrageousEvent:{
          type:1,
          message:"People can't sleep it seems, Ludes have risen in price!",
        }
      },
      {
        id:8,
        name:"Hash",
        price:0,
        minprice: 500,
        maxprice: 1250,
        bottomoutmin: 150,
        bottomoutmax: 200,
        outrageousmin: 1500,
        outrageousmax: 1800,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Hash prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"Hash prices are up!",
        }
      },
      {
        id:9,
        name:"Peyote",
        price:0,
        minprice: 250,
        maxprice: 700,
        bottomoutmin: 100,
        bottomoutmax: 150,
        outrageousmin: 900,
        outrageousmax: 1200,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Cactus Jack's in town! Cheap peyote.",
        },
        outrageousEvent:{
          type:1,
          message:"Peyote prices are up!",
        }
      },
      {
        id:10,
        name:"Ecstasy",
        price:0,
        minprice: 100,
        maxprice: 200,
        bottomoutmin: 15,
        bottomoutmax: 50,
        outrageousmin: 250,
        outrageousmax: 350,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"X gon give it to ya. Ecstasy prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"X ain't gon give it to ya. Ecstasy prices are up!",
        }
      },
      {
        id:11,
        name:"Acid",
        price:0,
        minprice: 1500,
        maxprice: 3800,
        bottomoutmin: 700,
        bottomoutmax: 1000,
        outrageousmin: 5000,
        outrageousmax: 8000,
        bottom:false,
        outrageous:false,
        bottomEvent:{
          type:0,
          message:"Cheap acid! prices have bottomed out!",
        },
        outrageousEvent:{
          type:1,
          message:"Acid prices are up!",
        }
      }
    ],
    inventoryProducts:[
      //Push object of products into here that includes name, id, and price bought at
    ],
    locations:[
      {id: 0, name:"London", icon: 'mdi-clock'},
      {id: 1, name:"Manchester", icon: 'mdi-clock'},
      {id: 2, name:"Birmingham", icon: 'mdi-clock'},
      {id: 3, name:"Leeds", icon: 'mdi-clock'},
      {id: 4, name:"Bristol" , icon: 'mdi-clock'},
    ],
    currentLocation: {},
    currentEvents:[
    ]
  }),
  computed:{
    maxPayDebtAmountComputed(){
      const self = this;
      if(self.cash < self.debt){
        return self.cash
      }else{
        return self.debt
      }
    }
  },
  methods:{
    newGame(){
      window.location.reload()
    },
    isLocationDisabled(location){
      const self = this;

      if(location.id == self.currentLocation.id){
        return true
      }else{
        return false
      }
      
    },
    getPrices(){
      const self = this;
      //Randomise event
      let eventInformation = self.randomiseEvent();
      //Empty array so that it doesn't push new events on old ones
      self.currentEvents = [];

      self.products.forEach(element => {
        let min = element.minprice;
        let max = element.maxprice;
        //Default the special prices so it doesn't carry on from previous turn
        element.outrageous = false
        element.bottom = false

        //Give it special price if there was an event for that product
        if(eventInformation != null && eventInformation.id == element.id){
            min = eventInformation.min
            max = eventInformation.max

            if(eventInformation.bottom){
              element.bottom = eventInformation.bottom
              self.currentEvents.push(element.bottomEvent)
            }else{
              element.outrageous = eventInformation.outrageous
              self.currentEvents.push(element.outrageousEvent)
            }
        }

        // Notify of event 
        if(self.currentEvents.length !== 0){
          self.eventDialog = true;
        }

        // Get a random price within it's range
        element.price = Math.floor(Math.random() * (max - min) + min);
      });
    },
    randomiseEvent(){
      //TODO: Implement more than 1 random event
      const self = this;

      //1 in 3 chance of an event
      let eventChance = 2;
      let rand = Math.floor(Math.random() * Math.floor(3))

      if(rand == eventChance){
        //Randomly select a product to apply event to
        let randProdId = Math.floor(Math.random() * ((self.products.length) - 0) + 0)

        //Randomly select if its bottom out or price rise. 50.50 chance
        if(Math.floor(Math.random() * 2) == 1){
          return {
            id: randProdId, 
            min: self.products[randProdId].outrageousmin,
            max: self.products[randProdId].outrageousmax,
            outrageous: true,
            bottom: false,
          }
        }else{
          return {
            id: randProdId,
            min: self.products[randProdId].bottomoutmin,
            max: self.products[randProdId].bottomoutmax,
            outrageous: false,
            bottom: true,
          }
        }
      }
    },
    nextDay(){
      const self = this;
      if(self.days < 30){
        self.locationDialog = true;
      }else{
        self.dialog = true;
      }
    },
    updateCashBuy(payload){
      // update amount of cash after buying product 
      const self = this;
      self.cash = self.cash - payload;
    },
    updateCashSell(payload){
      // update amount of cash after selling product
      const self = this;
      self.cash += payload;
    },
    changeLocation(location){
      const self = this;
      self.currentLocation = location

      self.days++;
      self.days == 30 ? self.turnBtn = "End" : self.turnBtn = "Next Day"

      if(self.debt >0){
        self.debtIncrease();
      }
      self.getPrices();

      self.locationDialog = false;
    },
    debtIncrease(){
      const self = this;
      self.debt = Math.floor(self.debt * 1.1)
    },
    payDebt(){
      const self = this;
      self.debt = self.debt - self.payDebtAmount
      self.cash = self.cash - self.payDebtAmount
      self.debtDialog = false;
    }
  },
  created(){
    const self = this;
    self.getPrices();
    self.currentLocation = self.locations[0];
  }
};
</script>

<style scoped>
.bottom{
  color:green
}
.outrageous{
  color:red
}
</style>
