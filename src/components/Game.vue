<template>
    <!-- Whats Left:
      extra inventory
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
            Cash: £{{Number(cash).toLocaleString()}}
          </v-card-text>
          <v-card-text style="text-align:center;">
            Bank: £{{Number(bank).toLocaleString()}}
          </v-card-text>
          <v-card-text style="text-align:center;">
            Debt: £{{Number(debt).toLocaleString()}}
          </v-card-text>
          <v-card-text style="text-align:center;">
            Final Amount: £{{Number((cash+bank)-debt).toLocaleString()}}
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
    <div v-if="!policeDialog" class="text-center">
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

    <!-- Bank dialog box  -->
    <div class="text-center">
      <v-dialog
        v-model="bankDialog"
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Bank £{{Number(bank).toLocaleString()}}
          </v-card-title>

          <v-card-text style="text-align:center;">
            <v-layout v-if="!withdrawSelected && !depositSelected">
              <v-flex mt-3 xs6>
                <v-btn color="warning" @click="withdrawSelected = true">
                  Withdraw
                </v-btn>
              </v-flex>
              <v-flex mt-3 xs6>
                <v-btn color="success" @click="depositSelected = true">
                  Deposit
                </v-btn>
              </v-flex>
            </v-layout>

            <v-row v-if="depositSelected">
              <v-col class="pr-4">
                <v-slider
                  v-model="depositAmount"
                  class="align-center"
                  :max="cash"
                  :min="0"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="depositAmount"
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
            <v-row v-if="withdrawSelected">
              <v-col class="pr-4">
                <v-slider
                  v-model="withdrawAmount"
                  class="align-center"
                  :max="bank"
                  :min="0"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="withdrawAmount"
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

            <v-row v-if="depositSelected || withdrawSelected">
              <v-col>
                <v-btn color="success" @click="confirmBankTransaction()"><v-icon dark>mdi-check-circle-outline</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="primary"
              text
              @click="bankDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    
    <!-- Police event dialog box  -->
    <div class="text-center">
      <v-dialog
        v-model="policeDialog"
        persistent
        width="500"
      >
        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
            Police
          </v-card-title>

          <v-card-text style="text-align:center;">
            {{policeDialogMessage}}
          </v-card-text>
          <v-card-text v-if="bigPercentageCut > 0" style="text-align:center; color: red;">
            -{{bigPercentageCut}}%
          </v-card-text>
          <v-card-text v-if="smallPercentageCut > 0" style="text-align:center; color: red;">
            -{{smallPercentageCut}}%
          </v-card-text>

          <v-layout>
              <v-flex xs4 offset-xs3 mt-3 pb-5>
                <v-btn v-if="policeDisableClose" text color="warning" @click="actionPoliceEvent(1)">Co op</v-btn>
              </v-flex>
              <v-flex xs4 mt-3 pb-5>
                <v-btn v-if="policeDisableClose" text color="warning" @click="actionPoliceEvent(2)">Run</v-btn>
              </v-flex>
          </v-layout>
          <v-divider></v-divider>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              :disabled="policeDisableClose"
              color="primary"
              text
              @click="closePoliceEvent()"
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
              <v-flex xs4 mt-3 pb-5>
                <v-btn text color="success" @click="bankDialog = true">Bank</v-btn>
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
    bankDialog:false,
    withdrawSelected: false,
    depositSelected: false,
    withdrawAmount: 0,
    depositAmount: 0,
    locationDialog: false,
    eventDialog: false,
    debtDialog: false,
    policeDialog: false,
    policeDisableClose: true,
    policeDialogMessage: "Police approach you as they have suspicion of your activites and want to bring you in for questioning. Do you want to co operate or run?",
    bigPercentageCut: 0,
    smallPercentageCut: 0,
    turnBtn: "Next Day",
    days:1,
    inventoryAmount: 100,
    payDebtAmount:0,
    debt: 5500,
    cash: 2000,
    bank: 0,
    products:[
      {
        id: 0,
        name:"Cocaine",
        price:0,
        minprice: 17000,
        maxprice: 29000,
        outrageousmin: 60000,
        outrageousmax: 120000,
        outrageous:false,
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
        outrageousmin: 35000,
        outrageousmax: 50000,
        outrageous:false,
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
        maxprice: 300,
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
        outrageousmin: 2500,
        outrageousmax: 7000,
        outrageous:false,
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
      },
      {
        id:6,
        name:"Meth",
        price:0,
        minprice: 400,
        maxprice: 900,
        outrageousmin: 5000,
        outrageousmax: 8000,
        outrageous:false,
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
        bottom:false,
        bottomEvent:{
          type:0,
          message:"Local pharmacy raided, cheap ludes available !",
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
        bottom:false,
        bottomEvent:{
          type:0,
          message:"Cactus Jack's in town! Cheap peyote.",
        },
      },
      {
        id:10,
        name:"Ecstasy",
        price:0,
        minprice: 100,
        maxprice: 350,
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
    //reload the game. need to refactor to initalise the data, so no need for refreshing
    newGame(){
      window.location.reload()
    },
    //if the current location is selected disable it so user can't click it
    isLocationDisabled(location){
      const self = this;

      if(location.id == self.currentLocation.id){
        return true
      }else{
        return false
      }
      
    },

    //get product prices. check for police events. display events
    getPrices(){
      const self = this;
      //Randomise possible events
      let eventInformation = self.randomiseEvent();
      //Empty array so that it doesn't push new events on old ones
      self.currentEvents = [];

      // loop through each product to give them a price
      self.products.forEach(product => {
        let min = product.minprice;
        let max = product.maxprice;

        //Default the special prices so it doesn't carry on from previous turn
        product.outrageous = false
        product.bottom = false

        // if there are special events in the list the loop through and give those prices
        if(eventInformation != null){
          //loop through just in case there's multiple events
          eventInformation.forEach(event => {
            if (event.id == product.id) {
              min = event.min
              max = event.max
              if(event.bottom){
                product.bottom = event.bottom
                self.currentEvents.push(product.bottomEvent)
              }else{
                product.outrageous = event.outrageous
                self.currentEvents.push(product.outrageousEvent)
              }
            }
          })
        }
        // Get a random price within it's range
        product.price = Math.floor(Math.random() * (max - min) + min);
      });


      //check for police event
      self.randomisePoliceEvent()

      // Notify of event 
      if(self.currentEvents.length !== 0){
        self.eventDialog = true;
      }
    },

    //randomise events and its products it affects
    randomiseEvent(){
      //TODO: Implement more than 1 random event
      const self = this;
      let eventChance = Math.random();
      let eventsList = []
      let usedEvents = []

      if(self.days > 10 && eventChance < 0.12){
        // 2 events chance
        //12%
        for (let index = 0; index < 2; index++) {
          let randProdId = Math.floor(Math.random() * ((self.products.length) - 0) + 0)

          if (!usedEvents.includes(randProdId) && (self.products[randProdId].bottomEvent || self.products[randProdId].outrageousEvent)) {
            usedEvents.push(randProdId)
            eventsList.push(self.randomiseEventProducts(randProdId))
          }else{
            index--
          }
        }
        return eventsList
      }else if(eventChance < 0.45){
        //1 event
        //33%
        console.log("EVENT")
        for (let index = 0; index < 1; index++) {
          let randProdId = Math.floor(Math.random() * ((self.products.length) - 0) + 0)

          //Checks if product has any type of event
          if (self.products[randProdId].bottomEvent || self.products[randProdId].outrageousEvent){
            eventsList.push(self.randomiseEventProducts(randProdId))
          }else{
            //Go again to get a new random number
            index--
          }
        }
        return eventsList
          
      }else{
        return null
      }
    },
    //if bottom or outrageous
    randomiseEventProducts(randProdId){
      const self = this;

      // if it only has outrageous price or can go straight in, or if it does have both types price, give it chance to be outrageous 
      if((!self.products[randProdId].bottomEvent && self.products[randProdId].outrageousEvent) || (Math.random() < 0.5 && self.products[randProdId].outrageousEvent)){
        return{
          id: randProdId, 
          min: self.products[randProdId].outrageousmin,
          max: self.products[randProdId].outrageousmax,
          outrageous: true,
          bottom: false,
        }
      }else{
        return{
          id: randProdId,
          min: self.products[randProdId].bottomoutmin,
          max: self.products[randProdId].bottomoutmax,
          outrageous: false,
          bottom: true,
        }
      }
    },


    //Police events
    randomisePoliceEvent(){
      const self = this;
      let chance = Math.random()

      if(self.days > 1 && self.days< 9 && chance < 0.03){
          self.policeDialog = true;
      }else if(self.days > 9 && self.days < 31 && chance <0.17){
          self.policeDialog = true;
      }
    },
    actionPoliceEvent(event){
      const self = this;
      switch (event) {
        case 1:
          let bigPercentage = Math.random() * (0.70 - 0.60) + 0.60;
          let smallPercentage = Math.random() * (0.15 - 0.05) + 0.05;

          //choose to co op. 1/8 chance of owing a big cut e.g. 60-70. else owe 5-15%
          if(Math.random() < 0.12){
            self.bigPercentageCut = (bigPercentage*100).toFixed(0)

            self.policeDialogMessage = `You went in to co-operate with 
            them and they have you dead to rights. One dirty cop is looking to make 
            bank so finesses you for a ${self.bigPercentageCut}% cut of your cash`

            // cash - percentage
            self.cash = self.cash - (self.cash * bigPercentage.toFixed(2))
          }else{
            self.smallPercentageCut = (smallPercentage*100).toFixed(0)

            self.policeDialogMessage = `Cops find a little something on you that 
            could put you away for a few years. One dirty cop takes a little 
            ${self.smallPercentageCut}% cut for destroying the evidence`
            
            // cash - percentage
            self.cash = Math.floor(self.cash - (self.cash * smallPercentage.toFixed(2)))
          }
          self.policeDisableClose = false;
          break;
        case 2:
          //hance of getting caught else lose all product and half cash
          if(Math.random() < 0.25){
            self.policeDialogMessage = "You tried to run, but got caught. Police confiscated all your product and half your cash"
            self.inventoryProducts = []
            self.cash = Math.floor(self.cash/2);
          }else{
            self.policeDialogMessage = "You got away safely."
          }
          self.policeDisableClose = false
          break;
      }
    },
    closePoliceEvent(){
      const self = this;
      self.policeDialog = false
      self.bigPercentageCut = 0
      self.smallPercentageCut = 0
      self.policeDisableClose = true
      self.policeDialogMessage = "Police approach you as they have suspicion of your activites and want to bring you in for questioning. Do you want to co operate or run?"
    },

    //emit events
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

    //move location or end game
    nextDay(){
      const self = this;
      if(self.days < 30){
        self.locationDialog = true;
      }else{
        self.dialog = true;
      }
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
    },

    confirmBankTransaction(){
      const self = this;
      if (self.withdrawSelected && self.withdrawAmount > 0) {
        self.cash += self.withdrawAmount
        self.bank -= self.withdrawAmount
      }else if(self.depositSelected && self.depositAmount > 0){
        self.cash -= self.depositAmount
        self.bank += self.depositAmount
      }

      self.withdrawAmount = 0
      self.depositAmount = 0
      self.withdrawSelected = false
      self.depositSelected = false
      self.bankDialog = false

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
