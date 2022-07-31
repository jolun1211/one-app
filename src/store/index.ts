import { configure } from "mobx";
import CommonStore from "./commonStore";



configure({ enforceActions: "observed" });
export class SelfManagerStore {
  commonStore: CommonStore;

  constructor() {
    this.commonStore = new CommonStore();
  }
}

export default { selfManagerStore: new SelfManagerStore() };

configure({ enforceActions: "observed" });
