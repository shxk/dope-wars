import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    expandDisable: false

  },
  mutations: {
    setDisable(state){
      state.expandDisable = true;
    },
    unsetDisable(state){
      state.expandDisable = false;
    }

  },
  getter:{
    getDisableState: state => { 
      return state.expandDisable;
    }
  },
  actions: {

  }
})
