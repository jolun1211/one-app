import * as Qs from 'qs';

const axios = require('axios');

const { AxiosPromise, AxiosRequestConfig } = axios;
declare let window: any;

// const isDevelopment = process.env.NODE_ENV === "development";
const isDevelopment = true;

export const baseURL = isDevelopment ? 'http://localhost:3000/' : '';

export const Api = {
  jumpURL: isDevelopment ? 'http://localhost:3000' : '',
  axios: axios.create({
    baseURL,
    withCredentials: isDevelopment,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  }),
  withForm: {
    transformRequest: (data: Object) => Qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-requested-with': 'XMLHttpRequest',
    },
  },
};

Api.axios.interceptors.response.use(
  (response: { data: string | string[]; request: { responseURL: string | string[]; }; }) => {
    if (
      !isDevelopment
            && response.data
            && ((response.request.responseURL
                && response.request.responseURL.indexOf('Account/Login') !== -1)
                || (response.data.indexOf('<title>Object moved</title>') !== -1
                    && response.data.indexOf('/Account/Login') !== -1))
    ) {
      location.href = `/Account/Login?ReturnUrl=${encodeURIComponent(
        location.pathname + location.search,
      )}`;
    }

    return response;
  },
  (error: any) => Promise.reject(error),
);

export const post = <T>(
  url: string,
  data?: any,
  config?: any,
): Promise<T> => Q(Api.axios.post(url, data, config));

export const get = <T>(url: string, data?: any): Promise<T> => Q(Api.axios.get(url, { data }));

export const Q = <T>(axiosPromise: any): Promise<T> => new Promise<T>((resolve, reject) => {
  axiosPromise
    .then((response: any) => {
      if (response.status == 200) {
        resolve(response.data);
        return;
      }
      if (response.data.code === 500 || response.data.code === '500') {
        throw response.data.error;
      }
    })
    .catch((error: { response: { data: any; }; }) => {
      reject(error.response && error.response.data);
    });
});

export const getRaw = <T>(
  url: string,
  config?: any,
): Promise<T> => Q(Api.axios.get(url, config));
window.axios = Api.axios;
export default Api.axios;
