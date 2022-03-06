import axios from 'axios'
import {store} from '../redux/store'

axios.defaults.baseURL="http://localhost:3005"

axios.interceptors.request.use(
  function(config){
    store.dispatch({
      type:'change_loading',
      payload:true
    })
    return config
  },
  function(err){return Promise.reject(err)}
)
axios.interceptors.response.use(
  function(response){
    store.dispatch({
      type:'change_loading',
      payload:false
    })
    return response
  },
  function(err){return Promise.reject(err)}
)