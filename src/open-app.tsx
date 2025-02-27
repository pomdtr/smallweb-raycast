import { getPreferenceValues, BrowserExtension, open, showToast, Toast } from "@raycast/api";
import { loadConfig, type Config } from "./config";
import path from "path";

function lookupApp(config: Config, hostname: string): string | null {
  for (const [app, appConfig] of Object.entries(config.apps ?? {})) {
    if (appConfig.additionalDomains?.includes(hostname)) {
      return app;
    }
  }

  const [app, ...parts] = hostname.split(".");
  const domain = parts.join(".");
  if (config.domain == domain) {
    return app;
  }

  for (const additionalDomain of config.additionalDomains ?? []) {
    if (additionalDomain == domain) {
      return app;
    }
  }

  return null;
}

const preferences = getPreferenceValues<Preferences.OpenApp>();
export default async function () {
  const config = await loadConfig(preferences.dir);

  const tabs = await BrowserExtension.getTabs();
  const selectedTab = tabs.find((tab) => tab.active == true);
  if (!selectedTab) {
    await showToast({ title: "No active tab", style: Toast.Style.Failure });
    return;
  }

  const url = new URL(selectedTab.url);

  const app = lookupApp(config, url.hostname);
  if (!app) {
    await showToast({ title: `Active tab is not a smallweb app`, style: Toast.Style.Failure });
    return;
  }

  const dir = path.join(preferences.dir, app);
  await open(dir, preferences.editor);
}
