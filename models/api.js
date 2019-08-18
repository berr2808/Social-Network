

axios = require('axios')
appConfig = require('../public/js/src/functions/config')

const
  AppConfig = appConfig.AppConfig,
  API = AppConfig.API

const api = (pController) => {
  let Url = API + pController;
  return {
    List: () => {
      return axios.get(Url).then(response => {
        return response;
      }).catch(error => { return error })
    },
    ListBY: (parameters) => {
      return axios.get(Url + "?" + parameters).then(response => {
        return { data: response.data, isError: false };
      }).catch(error => { return { data: [], isError: true, error: error } })
    },
    RowId: (pId) => {
      return axios.get(Url + "/" + pId).then(response => {
        return { data: response.data, isError: false };
      }).catch(error => { return { data: [], isError: true, error: error } })
    },
    RowUsername: (username) => {
      return axios.get(Url + "?username=" + username).then(response => {
        return { data: response.data, isError: false, id: response.data.id };
      }).catch(error => { return { data: [], id: 0, isError: true, error: error } })
    },
    Count: (pConditons) => {
      return axios.get(Url + "?" + pConditons + "&op=count").then(response => {
        return { data: response.data, isError: false, count: response.data };
        // return response;
      }).catch(error => { return { data: [], isError: true, error: error } })
    },
    Insert: (pData) => {
      return axios.post(Url, pData).then(response => {
        return { data: response.data, isError: false, affectedRows: 1, insertId: response.data.id };
      }).catch(error => { return { data: [], isError: true, error: error } })
    },
    Update: (pId, pData) => {
      return axios.put(Url + "?id=" + pId, pData).then(response => {
        return { data: 1, isError: false, changedRows: 1, response: response };;
      }).catch(error => { return { data: 0, isError: true, changedRows: 0, response: error } })
    },
    Delete: (pId) => {
      return axios.delete(Url + "?" + pId).then(response => {
        return { data: 1, isError: false, affectedRows: 1, response: response };
      }).catch(error => { return { data: 0, isError: true, affectedRows: 0, response: error } })
    },
    RowAsync: async (pId) => {
      let _response = await CRUD(pController).Row(pId);
      if (_response.isError == false) {
        return _response.data;
      } else {
        return [];
      }

    },
    ListAsync: async () => {
      let _response = await CRUD(pController).List();
      if (_response.isError == false) {
        return _response;
      } else {
        return _response;
      }

    },
    ListBYAsync: async (parameters) => {
      let _response = await CRUD(pController).ListBY(parameters);
      if (_response.isError == false) {
        return _response;
      } else {
        return _response;
      }
    },
  }



}
module.exports = api


