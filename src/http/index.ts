import { toast } from 'react-toastify';

import { Strings } from 'assets/Strings';
import axios from 'axios';
import moment from 'moment';
import { Prefs } from 'repository/Prefs';
import { store } from 'store';

const client = axios.create();

client.interceptors.request.use(async (config) => {
  config.headers['Content-Type'] = 'application/json';
  config.headers['X-Key'] = `new${moment().utc().format('YY-MM-DD-HH')}`;
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
      toast.error(Strings.falhaRequest);
      return Promise.reject(error);
    } else if (body.status != undefined) {
      const status = body.status;
      if (status >= 500) {
        if (!silent) {
          toast.error(Strings.falhaRequest);
        }

        return Promise.reject(error);
      }
    }

    body = body.data;
    const ok = body.ok as boolean;

    if (!ok) {
      if (body.Msg_Erro != null) {
        toast.error(body.Msg_Erro);
      } else if (body.mensagem != null) {
        toast.error(body.mensagem);
      }
    }
    return Promise.reject(new Error(body.Msg_Erro));
  }
);

const { baseURL } = store.getState();
client.defaults.baseURL = baseURL;

export const http = client;
