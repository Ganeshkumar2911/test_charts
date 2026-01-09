<template>
    <div class="dashboard">
      <v-navigation-drawer width="180">
        <div>
          <v-img
            class="my-0"
            src="@/assets/logo.png"
            alt=""
            height="134"
          />
        </div>
        <div class="drawerContent">
          <v-list>
            <v-list-item
            v-for="item in NAV_LIST"
            :key="item.symbol"
            class="mx-2 rounded"
            :to="item.symbol"
            active-class="color"
            >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
      <div class="main">
        <div class="topBar">
          <h3 class="mx-4">{{route.params.id}}</h3>
        </div>
        <div class="content">
          <router-view class="routerView"></router-view>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { useRoute } from 'vue-router';
  
    const route = useRoute();
    // const CRYPTO_LIST = [
    //     { symbol: 'BTCUSDT', name: 'Bitcoin' },
    //     { symbol: 'ETHUSDT', name: 'Ethereum' },
    //     { symbol: 'BNBUSDT', name: 'Binance Coin' },
    //     { symbol: 'SOLUSDT', name: 'Solana' },
    //     { symbol: 'XRPUSDT', name: 'Ripple' },
    //     { symbol: 'ADAUSDT', name: 'Cardano' },
    //     { symbol: 'DOGEUSDT', name: 'Dogecoin' },
    //     { symbol: 'AVAXUSDT', name: 'Avalanche' },
    //     { symbol: 'DOTUSDT', name: 'Polkadot' },
    //     { symbol: 'MATICUSDT', name: 'Polygon' }
    // ];
    const NAV_LIST = [
      { symbol: 'dashboard', name: 'Dashboard' },
      { symbol: 'brokers', name: 'Brokers' },
      { symbol: 'strategies', name: 'Strategies' },

    ];
  </script>
  
  <style scoped>
  .drawerContent {
    height: 70%;
    width: 100%;
  }
 
  .topBar {
    height: 10vh;
    display: flex;
    align-items: center;
    background-color: #f5f5f7;
    justify-content: space-between;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }
  .color {
    background-color: #2f80ed;
    color: white;
    font-weight: 900;
  }
  </style>
  