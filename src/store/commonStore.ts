
import { action, computed, observable, runInAction } from "mobx";

import $http, { Q } from "@http";


export default class CommonStore {
  @observable myName: string = "";

  @action.bound
  async setCommonFiled(key: keyof CommonStore, value) {
    (this[key] as any) = value;
  }

  constructor() {

  }

  @action.bound
  test = async () => {
    const data = await this.api().getName();
    runInAction(() => {
      console.log("data",data)
      let res =data?.data[0]
      if(data){
        this.myName = res.name;
      }
      
      console.log("this.myName", this.myName)
    })
    return data;
  };



  private api() {
    return {
      getCheckInOutReasons(): Promise<any> {
        return Q($http.post(`/RecurringWo/GetPassComplianceReason`));
      },
      getName(): Promise<any> {
        return Q($http.get(`/api/test`));
      },
    };
  }
}
