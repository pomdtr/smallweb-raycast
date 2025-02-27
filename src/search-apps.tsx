import { Action, ActionPanel, Detail, getPreferenceValues, Icon, Image, Keyboard, List } from "@raycast/api";
import { getFavicon, usePromise, useFrecencySorting } from "@raycast/utils";
import fs from "fs/promises";
import path from "path";
import { loadConfig } from "./config";

const prefs = getPreferenceValues<Preferences.SearchApps>();

async function listApps(dir: string) {
  const entries = await fs.readdir(dir);
  const names = entries.filter((entry) => !entry.startsWith("."));

  const config = await loadConfig(dir);
  return names.map((name) => ({
    name,
    url: `https://${name}.${config.domain}`,
    dir: path.join(dir, name),
  }));
}

export default function SearchApps() {
  const { data, isLoading, error } = usePromise(listApps, [prefs.dir]);
  if (error) {
    return <Detail markdown={error.message} />;
  }

  const { data: apps, visitItem } = useFrecencySorting(data, {
    key: (app) => app.name,
  });

  return (
    <List isLoading={isLoading}>
      {apps?.map((app) => (
        <List.Item
          icon={getFavicon(app.url, {
            mask: Image.Mask.RoundedRectangle,
            fallback: Icon.Globe,
          })}
          key={app.name}
          keywords={[app.name]}
          title={app.name}
          accessories={[{ text: new URL(app.url).hostname }]}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.OpenInBrowser title="Open in Browser" url={app.url} onOpen={() => visitItem(app)} />
                {prefs.editor ? (
                  <Action.Open title="Open in Editor" icon={Icon.Pencil} target={app.dir} application={prefs.editor} />
                ) : null}
                <Action.CopyToClipboard
                  shortcut={Keyboard.Shortcut.Common.Copy}
                  title="Copy Link"
                  content={app.url}
                  onCopy={() => visitItem(app)}
                />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action.Open
                  shortcut={Keyboard.Shortcut.Common.Open}
                  application="Finder"
                  title="Open in Finder"
                  target={app.dir}
                  onOpen={() => visitItem(app)}
                />
                <Action.OpenWith
                  shortcut={Keyboard.Shortcut.Common.OpenWith}
                  path={app.dir}
                  onOpen={() => visitItem(app)}
                />
                <Action.CopyToClipboard
                  shortcut={Keyboard.Shortcut.Common.CopyPath}
                  title="Copy Path"
                  content={app.dir}
                  onCopy={() => visitItem(app)}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
