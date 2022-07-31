import axios, { AxiosPromise } from "axios";
import * as Qs from "qs";

export const Api = {
  axios: axios.create({
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
  }),
  withForm: {
    transformRequest: (data: Object) => Qs.stringify(data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
};

export const Q = <T>(axiosPromise: AxiosPromise): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    axiosPromise
      .then(response => {
        const result = response.data;
        if (response.status === 500) {
          throw result;
        } else {
          resolve(result);
        }
      })
      .catch(error => {
        console.warn(`Q function error: `, error);
        reject(new Error(`${error}`));
      });
  });
};

export default Api.axios;
