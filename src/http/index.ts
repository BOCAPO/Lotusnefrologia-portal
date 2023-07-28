import { toast } from 'react-toastify';

import { Strings } from 'assets/Strings';
import axios, { AxiosResponse } from 'axios';
import { Prefs } from 'repository/Prefs';
import { store } from 'store';

const clientJson = axios.create();
const clientFormData = axios.create();

type RequestData = Record<string, unknown>;
type ResponseData = Record<string, unknown>;

// function returnToast(type, message) {

// }

// Configurações para o Content-Type application/json
clientJson.interceptors.request.use(async (config) => {
  config.headers['Content-Type'] = 'application/json';
  const token = await Prefs.getToken();
  if (token != null) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

// Configurações para o Content-Type multipart/form-data
clientFormData.interceptors.request.use(async (config) => {
  config.headers['Content-Type'] = 'multipart/form-data';
  const token = await Prefs.getToken();
  if (token != null) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
});

clientJson.interceptors.response.use(
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
clientFormData.interceptors.response.use(
  async (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    let body = error.response;

    if (error.response == undefined) {
      toast.error(Strings.falhaRequest);
      return Promise.reject(error);
    } else if (body.status != undefined) {
      const status = body.status;
      if (status >= 500) {
        toast.error(Strings.falhaRequest);

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
    return Promise.reject(new Error('Login e/ou senha inválidos'));
  }
);

const { baseURL } = store.getState();
clientJson.defaults.baseURL = baseURL;
clientFormData.defaults.baseURL = baseURL;

export function postJson(
  url: string,
  data: RequestData
): Promise<AxiosResponse<ResponseData>> {
  return clientJson.post(url, data);
}

export function putJson(
  url: string,
  data: RequestData
): Promise<AxiosResponse<ResponseData>> {
  return clientJson.put(url, data);
}

export function deleteJson(
  url: string,
  data?: RequestData
): Promise<AxiosResponse<ResponseData>> {
  return clientJson.delete(url, { data });
}

export function getJson(
  url: string,
  params?: RequestData
): Promise<AxiosResponse<ResponseData>> {
  return clientJson.get(url, { params });
}

export function postFormData(
  url: string,
  formData: FormData
): Promise<AxiosResponse<ResponseData>> {
  return clientFormData.post(url, formData);
}
