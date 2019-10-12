<template>
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
            Account: £{{cash}}
          </v-card-text>
          <v-card-text style="text-align:center;">
            Debt: £{{debt}}
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn
              color="primary"
              text
              @click="dialog = false"
            >
              New Game
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <v-layout wrap>
        <v-flex>
        <h1 class="display-2 font-weight-bold mb-3">
          Day {{days}}/30
        </h1>
      </v-flex>
    </v-layout>

    <v-layout wrap>
     <!-- Dashboard -->
     <v-flex xs12 md4 mb-3>
       <v-card style="text-align:center;">
         <v-flex pt-5>
           <h4>Cash</h4>
           £{{cash}}
         </v-flex>
         <v-flex>
           <h4>Debt</h4>
           £{{debt}}
         </v-flex>
         <v-flex>
           <h4>Inventory</h4>
           {{inventoryProducts.length}}/{{inventoryAmount}}
         </v-flex>
         <v-flex mt-3 pb-5>
           <v-btn color="info" @click="nextDay">{{turnBtn}}</v-btn>
         </v-flex>
       </v-card>
     </v-flex>

     <!-- Products -->
     <v-flex xs12 md7 offset-md1>
       <v-layout row>
         <v-flex xs12 mx-3 mb-3 v-for="(product,i) in products" :key="i">
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
    dialog: false,
    turnBtn: "Next Day",
    days:1,
    inventoryAmount: 100,
    debt: 2000,
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
      }
    ],
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
    events:[
      {

      }
    ]
  }),
  methods:{
    getPrices(){
      const self = this;
      let eventInformation = self.randomiseEvent();

      self.products.forEach(element => {
        let min = element.minprice;
        let max = element.maxprice;

        if(eventInformation != null && eventInformation.id == element.id){
            min = eventInformation.min
            max = eventInformation.max
            console.log(eventInformation)
        }

        element.price = Math.floor(Math.random() * (max - min) + min);
      });

      //New bulletin bottom out or outrageous

    },
    randomiseEvent(){
      const self = this;

      let eventChance = 2;
      let rand = Math.floor(Math.random() * Math.floor(3))

      if(rand == eventChance){
        let randProdId = Math.floor(Math.random() * ((self.products.length) - 0) + 0)

        if(Math.floor(Math.random() * 2) == 1){
          return {
            id: randProdId, 
            min: self.products[randProdId].outrageousmin,
            max: self.products[randProdId].outrageousmax
          }
        }else{
          return {
            id: randProdId,
            min: self.products[randProdId].bottomoutmin,
            max: self.products[randProdId].bottomoutmax
          }
        }
      }
    },
    nextDay(){
      const self = this;
      if(self.days < 30){
        //Choose new location - Use vuetify dialog

        self.days++;
        self.days == 30 ? self.turnBtn = "End" : self.turnBtn = "Next Day"
        self.getPrices();

      }else{
        self.dialog = true;
        console.log(`Game over, you finished the game with £${self.cash} ` )
      }

    }

  },
  created(){
    const self = this;
    self.getPrices();

  }
};
</script>

<style scoped>
@media (max-width: 100px) {
  /* CSS that should be displayed if width is equal to or less than 800px goes here */
  .marginright{
    margin-right: 15%;
  }
}

</style>
