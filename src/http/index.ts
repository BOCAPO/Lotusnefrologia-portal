import { TipoToast } from '~/components/Toast';

import axios from 'axios';
import md5 from 'md5';
import moment from 'moment';
import { Flavor } from '~/assets/Flavor';
import { Prefs } from '~/repository/Prefs';
import { store } from '~/store';
import { exibirToast } from '~/utils';

const client = axios.create();

client.interceptors.request.use(async (config) => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  config.headers['X-Key'] = md5(`new${moment().utc().format('YY-MM-DD-HH')}`);
  const token = await Prefs.getToken();
  if (token != null) {
    config.headers['Authorization'] = token;
  }
  return config;
});

client.interceptors.response.use(
  async (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    let body = error.response;
    const silent = error.config.silent as boolean;

    if (error.response == undefined) {
      exibirToast(Flavor.textos.falhaRequest, TipoToast.Erro);
      return Promise.reject(error);
    } else if (body.status != undefined) {
      const status = body.status;
      if (status >= 500) {
        if (!silent) {
          exibirToast(Flavor.textos.falhaRequest, TipoToast.Erro);
        }

        return Promise.reject(error);
      }
    }

    body = body.data;
    const ok = body.ok as boolean;

    if (!ok) {
      if (body.Msg_Erro != null) {
        exibirToast(body.Msg_Erro, TipoToast.Erro);
      } else if (body.mensagem != null) {
        exibirToast(body.mensagem, TipoToast.Erro);
      }
    }
    return Promise.reject(new Error(body.Msg_Erro));
  }
);

const { baseURL } = store.getState();
client.defaults.baseURL = baseURL;

export const http = client;
