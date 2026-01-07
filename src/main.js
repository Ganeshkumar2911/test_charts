/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import axios from 'axios';

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

const axios_instance = axios.create({
	baseURL: "https://d5nw9mgh-8585.euw.devtunnels.ms/",
	timeout: 50000,
});
const app = createApp(App)
const API_KEY = "d4whw91x682sg4uz";
const ACCESS_TOKEN = "PQXSfZDMB6QJdxsyryHFwaILzlpbzjgh";

app.config.globalProperties.$api = {
  request_GET: (url, params, onSuccess = null, onError = null) => {
  //  const headers = {
  //     'X-Kite-Version': '3',
  //     'Authorization': `token ${API_KEY}:${ACCESS_TOKEN}`
  //   };

    const headers = {
      // token: sessionStorage.getItem("token")
    };

    axios_instance
      .get(url, { params, headers })
      .then((response) => {
        if (response.data.success === false) {
          console.error("Error:", response.data.message);
        }
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch((error) => {
        console.error("get request failed:", error);
        
        if (onError) {
          onError(error);
        }
      });
  },
  request_POST: (url, data = {}, onSuccess = null, onError = null) => {
    const headers = {
      token: sessionStorage.getItem("token")
    };

    axios_instance
      .post(url, data, headers ? { headers } : {})
      .then((response) => {
        if (response.data.success === false) {
          console.error("Error:", response.data.message);
        }
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      })
      .catch((error) => {
        console.error("POST request failed:", error);
        
        if (onError) {
          onError(error);
        }
      });
  },
};



registerPlugins(app)

app.mount('#app')
