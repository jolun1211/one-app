import { Environment, IEnv } from './const';
import childProcess from 'child_process';
import fs from 'fs-extra';
import md5 from 'md5';
import http, { Q } from './http';

const env: IEnv = process.env.NODE_ENV as IEnv;
const pipelineId = process.env.NODE_PID;
console.log('branch is: ', env);
console.log('pipelineId is: ', pipelineId);

const CDNConfig = Environment[env];
const NERKO_HOST = 'https://nerkogw.smsassist.com/react-build';

const Libs = [
  {
    pattern: /\/?dll\/vendor\.dll/,
    libName: 'vendor',
    path: '/dll/vendor.dll.js'
  },
  {
    pattern: /\/?dll\/echarts\.dll/,
    libName: 'echarts',
    path: '/dll/echarts.dll.js'
  },
  {
    pattern: /\/?dll\/fe-toolkit/,
    libName: 'fe-toolkit',
    path: '/dll/fe-toolkit.js'
  },
  {
    pattern: /\/?lib\/common-plugins/,
    libName: 'common-plugins',
    path: '/lib/common-plugins.js'
  },
  {
    pattern: /\/?css\/common/,
    libName: 'common-css',
    path: '/css/common.css'
  },
  {
    pattern: /\/?public\.js/,
    libName: 'public',
    path: '/public.js'
  }
];

const exec = childProcess.exec;

async function getProjects() {
  const stdout = await execute('lerna list');
  const packageList = stdout.split('\n');
  const packages = packageList.filter(item =>!item.includes('@core/'))
    .map(item => item.replace(/^@[^/]+\//, ''))
    .filter(item => !!item);

  return packages;
}

async function execute(command: string, options?: any): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      error ? reject(stderr.toString()) : resolve(stdout.toString());
    });
  });
}

const collectIndexGenerator = () => {
  const hashMap = new Map();
  return (filePath: string) => {
    if (filePath.startsWith('http') || filePath.startsWith('lib:')) return filePath;
    if (!fs.existsSync(`./dist/${filePath}`)) return null;
    let newFilePath = '';
    if (hashMap.has(filePath)) {
      newFilePath = filePath.replace(/\.(\w*)$/, `.${hashMap.get(filePath)}.$1`);
    } else {
      const md5Value = md5(fs.readFileSync(`./dist/${filePath}`));
      newFilePath = filePath.replace(/\.(\w*)$/, `.${md5Value}.$1`);
      fs.copySync(`./dist/${filePath}`, `./dist_temp/${newFilePath}`);
      hashMap.set(filePath, md5Value);
    }
    return newFilePath.startsWith('/') ? newFilePath : `/${newFilePath}`;
  }; 
};

(async () => {
  const collect = collectIndexGenerator();
  console.time('caculate');
  const projectList = await getProjects();
  const result: IManifest = { projects: {}, library: {}, host: CDNConfig.host, isCdn: CDNConfig.isCdn };

  Libs.forEach(lib => {
    const path = collect(lib.path);
    path && (result.library[lib.libName] = path);
  });

  projectList.map(project => {
    const htmlPath = `./dist/${project}.html`;
    if (fs.existsSync(htmlPath)) {
      console.log('start to deal with project:', project);
      const html = fs.readFileSync(htmlPath).toString();
      let jsList = html.match(/<script[^>]*>(?:.*?)<\/script>/g).map(i => i.match(/src="(.*)"/)[1]).map(i => i.replace(/^\//, ''));
      const pageIndex = jsList.findIndex(i => /\/?pages/.test(i));
      console.log('prepare to insert public.js, pageIndex is ', pageIndex);
      jsList.splice(pageIndex, 0, `public.js`);

      jsList = jsList.map(js => {
        const lib = Libs.find(lib => lib.pattern.test(js));
        return lib ? `lib:${lib.libName}` : js;
      });      
      console.log('new js list is ', jsList);

      jsList = jsList.map(js => js.replace(/^.+\/affiliate\//g, '').replace(/\?.*/g, '')).map(js => collect(js)).filter(i => !!i);
      console.log('last js list is ', jsList);

      let cssList = html.match(/<link[^>]*>/g).map(i => i.match(/href="(.*)"/)[1]).map(i => i.replace(/^\//, ''));
      cssList = cssList.map(css => {
        const lib = Libs.find(lib => lib.pattern.test(css));
        return lib ? `lib:${lib.libName}` : css;
      });
      cssList = cssList.map(css => collect(css)).filter(i => !!i);
      result.projects[project] = {
        js: jsList, css: cssList
      };
    }
  });
  console.timeEnd('caculate');
  console.log('start to fetch previous manifest');

  let prevManifest: IManifest = null;
  try {
    const versionRes = await Q<IResponse>(http.get(`${NERKO_HOST}/automation/getManifest`, { params: {
      env: env,
      portal: 'affiliate'
    }}));
    let version = null;
    if (versionRes.code === 200 && versionRes.data) version = versionRes.data;
    console.log('prev version is ', version);
    const cdnHost = CDNConfig.isCdn ? CDNConfig.host : CDNConfig.cdnHost; // manifest.json upload to s3 when env is develop
    prevManifest = await Q<IManifest>(http.get(version ? `${cdnHost}${version}` :
      `${cdnHost}/manifest.json?t=${new Date().getTime()}`));
    console.log('prevManifest :', prevManifest);
  } catch(e) {
    console.log('no previous manifest, build new one');
  }
  if (prevManifest) {
    result.library = { ...prevManifest.library || {}, ...result.library };
    result.projects = { ...prevManifest.projects || {}, ...result.projects };
  }
  fs.writeFileSync(`./manifest.json`, JSON.stringify(result, null, 2), { encoding: 'utf-8' });
  const md5Value = md5(fs.readFileSync(`./manifest.json`));
  fs.copySync('./manifest.json', `./versions/manifest.${md5Value}.json`);
  console.log(result);
  // execute(`curl -d "pipeline_id=${pipelineId}&manifest=/versions/manifest.${md5Value}.json" ${NERKO_HOST}/automation/createNewVersion`);
})();

interface IManifestItem {
  js: string[];
  css: string[];
}

interface ILibrary {
  [key: string]: string;
}

interface IManifest {
  projects: {
    [key: string]: IManifestItem;
  },
  library: ILibrary;
  host: string;
  isCdn: boolean;
}

interface IResponse {
  code: number;
  data: any;
  error: string;
}
