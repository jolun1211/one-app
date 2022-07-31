import { SelfManagerStore } from "../../store";


export interface IStoreContainer {
    selfManagerStore: SelfManagerStore;
}

export interface ISelfStoreContainer {
  store: IStoreContainer;
}