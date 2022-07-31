export const Environment: IEnvironment = {
  dev: {
      isCdn: false,
      host: 'https://nerko.smsassist.com:8084/affiliate',
      cdnHost: 'https://cdn-onedev.smsassist.com/frontend/affiliate'
    },
    stage: {
      isCdn: true,
      host: 'https://cdn-onestage.smsassist.com/frontend/affiliate'
    },
    live: {
      isCdn: true,
      host: 'https://cdn-one.smsassist.com/frontend/affiliate'
    },
    test: {
      isCdn: true,
      host: 'https://cdn-one.smsassist.com/frontend/affiliate'
    },
    democenter: {
      isCdn: true,
      host: 'https://cdn-one.smsassist.com/frontend/affiliate'
    },
    devDemocenter: {
      isCdn: true,
      host: 'https://cdn-onedemocenterdev.smsassist.com/frontend/affiliate'
    }
  };
  
  export type IEnvironment = {
    [key in IEnv]: {
      isCdn: boolean;
      host: string;
      cdnHost?: string;
    };
  };
  
export type IEnv = 'dev' | 'stage' | 'live' | 'test' | 'democenter' | 'devDemocenter';
