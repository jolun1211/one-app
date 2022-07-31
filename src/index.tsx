import * as React from "react";
import ReactDom from "react-dom";
import { Provider } from "mobx-react";
import Entry from "./entry";
import selfManagerStore from "./store";
import { ISelfStoreContainer } from "./common/interface";



const store = selfManagerStore;
console.log("store111111111",store)

ReactDom.render(
  <Provider store={store} >
    <Entry />
  </Provider>,
  document.getElementById("root")
);

