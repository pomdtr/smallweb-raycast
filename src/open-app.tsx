import { getPreferenceValues, BrowserExtension, open, showToast, Toast, LocalStorage } from "@raycast/api";
import { loadConfig, type Config } from "./config";
import path from "path";
import { App } from "./app";

// function lookupApp(config: Config, hostname: string): App | null {
//   for (const [app, appConfig] of Object.entries(config.apps ?? {})) {
//     if (appConfig.additionalDomains?.includes(hostname)) {
//       return {
//         dir: path.join(config.dir, app),
//         domain: hostname,
//         rootDomain: config.domain,
//         url: `https://${app}.${config.domain}`,
//         name: app,
//       }
//     }
//   }

//   const [app, ...parts] = hostname.split(".");
//   const domain = parts.join(".");
//   if (config.domain == domain) {
//     return {
//       dir: path.join(config.dir, app),
//       name: app,
//     }
//   }

//   for (const additionalDomain of config.additionalDomains ?? []) {
//     if (additionalDomain == domain) {
//       return {
//         dir: path.join(config.dir, app),
//         name: app,
//       }
//     }
//   }

//   return null;
// }

const preferences = getPreferenceValues<Preferences.OpenApp>();
export default async function () {
  const dirs = JSON.parse(await LocalStorage.getItem<string>("dirs") || "[]") as string[];
  if (!dirs) {
    await showToast({ title: "No dirs found", style: Toast.Style.Failure });
    return;
  }


  const tabs = await BrowserExtension.getTabs();
  const selectedTab = tabs.find((tab) => tab.active == true);
  if (!selectedTab) {
    await showToast({ title: "No active tab", style: Toast.Style.Failure });
    return;
  }

  // const url = new URL(selectedTab.url);

  // const configs = await Promise.all(dirs.map(async (dir) => loadConfig(dir)));
  // for (const config of configs) {
  //   const app = lookupApp(config, url.hostname);
  //   if (app) {
  //     await open(app.dir, preferences.editor);
  //     return;
  //   }
  // }

  // await showToast({ title: `Active tab is not a smallweb app`, style: Toast.Style.Failure });
  // return;

}
