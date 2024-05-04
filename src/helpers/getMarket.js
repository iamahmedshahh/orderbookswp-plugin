import axios from 'axios'
const UP  = "testing"
//const mm2url = "http://" + process.env.MM2_IPV4_ADDR + ":" + process.env.MM2_RPC_PORT

const mm2url = "http://95.217.10.80:16077/getmarket/"

export function getMarket(base, rel, userpass = UP) {
    console.log("market data: " + base + " / " + rel)
    const requestData = {
      jsonrpc: "2.0",
      method: "orderbook",
      base: base,
      rel: rel,
      userpass: userpass,
      id: Date.now(),
      timeout: 3000
    };
    return axios.post(mm2url, requestData)
      .then(res => {
        console.log(res.data)
        return res.data
      })
      .catch(err => console.error(err))
  }