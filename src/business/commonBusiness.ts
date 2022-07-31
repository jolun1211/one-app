import { ISelfStoreContainer } from "src/common/interface";

export const CommonBusiness = (containerStore:ISelfStoreContainer) => {
    const { selfManagerStore } = containerStore.store;
    const { commonStore } = selfManagerStore;

    const propsConnect = {
        selfName: commonStore.myName,
    };

    const dispatchConnect = {
        test: commonStore.test,
    };

    return {
        ...propsConnect,
        ...dispatchConnect,
    };
};
export type ICommonBusinessProps = Partial< ReturnType<typeof CommonBusiness >>;
