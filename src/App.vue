<template>
  <div class="container flex flex-row" :data-theme="currentTheme">
    <!-- First Column: Coin Selection and Theme Switcher -->
    <div class="flex-1 space-y-5">
      <h3>Market Order Book</h3>

      <!-- Theme Switcher -->
      <div class="flex items-center">
        <label>Switch Theme:</label>
        <select v-model="currentTheme" @change="changeTheme" class="select select-bordered ml-2">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="aqua">Verus</option>
          <option value="cyberpunk">Pirate</option>
        </select>
      </div>

      <!-- Coin Selection Section -->
      <div class="space-y-4">
        <div>
          <label>Base Coin:</label>
          <select v-model="selectedBase" @change="fetchMarketData" class="select select-bordered">
            <option v-for="coin in availableCoins" :key="coin" :value="coin">{{ coin }}</option>
          </select>
        </div>

        <div>
          <label>Rel Coin:</label>
          <select v-model="selectedRel" @change="fetchMarketData" class="select select-bordered">
            <option v-for="coin in availableCoins" :key="coin" :value="coin">{{ coin }}</option>
          </select>
        </div>

        <button @click="fetchMarketData" class="btn">Refresh Market Data</button>
      </div>
    </div>

    <!-- Second Column: Asks -->
    <div class="flex-1">
       <h4>Order Book: {{ marketLabel }}</h4>
      <h4>Asks</h4>
      <table class="table w-full">
        <thead>
          <tr>
            <th>Price</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ask in marketData?.asks" :key="ask.uuid" class="hover">
            <td>{{ roundedPrice(ask.price) }}</td>
            <td>{{ roundedPrice(ask.maxvolume) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Third Column: Bids -->
    <div class="flex-1">
      <h4>Bids</h4>
      <table class="table w-full">
        <thead>
          <tr>
            <th>Price</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bid in marketData?.bids" :key="bid.uuid" class="hover">
            <td>{{ roundedPrice(bid.price) }}</td>
            <td>{{ roundedPrice(bid.maxvolume) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

// State for current theme
const currentTheme = ref("dark");

// State for available coins and market data
const availableCoins = ref([]);
const selectedBase = ref(null);
const selectedRel = ref(null);
const marketData = ref(null);

// Function to fetch available coins
const fetchCoins = async () => {
  try {
    const response = await axios.get("http://95.217.10.80:16077/coinsenabled");
    if (response.status === 200 && Array.isArray(response.data.result)) {
      availableCoins.value = response.data.result.map((coin) => coin.ticker);
    } else {
      console.error("Error fetching coins");
    }
  } catch (error) {
    console.error("Error fetching coins:", error);
  }
};

// Function to fetch market data
const fetchMarketData = async () => {
  if (selectedBase.value && selectedRel.value) {
    try {
      const response = await axios.post(
        `http://95.217.10.80:16077/getMarket/`,
        null,
        {
          params: {
            base: selectedBase.value,
            rel: selectedRel.value,
          },
        }
      );
      marketData.value = response.data;
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  }
};
const marketLabel = computed(() => {
  const base = selectedBase.value ? selectedBase.value.toUpperCase() : "N/A";
  const rel = selectedRel.value ? selectedRel.value.toUpperCase() : "N/A";
  return `${base} / ${rel}`;
});
// Function to round off to 5 decimal places
const roundedPrice = (price) => {
  const num = parseFloat(price);
  return isNaN(num) ? "N/A" : num.toFixed(5);
};

// Watch for changes to selectedBase and selectedRel
watch([selectedBase, selectedRel], fetchMarketData);

// Fetch data on component mount
onMounted(() => {
  fetchCoins();
  fetchMarketData();
});

// Change theme when dropdown changes
const changeTheme = () => {
  document.body.setAttribute("data-theme", currentTheme.value);
};
</script>
