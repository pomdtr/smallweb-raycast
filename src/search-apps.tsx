import { Action, ActionPanel, Detail, Form, getPreferenceValues, Icon, Image, Keyboard, List, useNavigation } from "@raycast/api";
import { getFavicon, usePromise, useFrecencySorting } from "@raycast/utils";
import fs from "fs/promises";
import path from "path";
import { loadConfig } from "./config";
import { useDirs } from "./hooks";
import { useState } from "react";

const preferences = getPreferenceValues<Preferences.SearchApps>();


function useSmallweb(dirs?: string[]) {
  const listApps = async (dirs?: string[]) => {
    if (!dirs) {
      return [];
    }

    const apps = await Promise.all(dirs.map(async (dir) => {
      const entries = await fs.readdir(dir);
      const names = entries.filter((entry) => !entry.startsWith("."));

      const config = await loadConfig(dir);
      return names.map((name) => ({
        name,
        rootDomain: config.domain,
        url: `https://${name}.${config.domain}`,
        dir: path.join(dir, name),
      }))

    }))

    return apps.flat()
  }

  return usePromise(listApps, [dirs])
}

export default function SearchApps() {
  const { dirs, setDirs } = useDirs()
  const navigation = useNavigation();
  const [selectedDomain, setSelectedDomain] = useState<string>();
  const { data, error, mutate } = useSmallweb(dirs);
  if (error) {
    return <Detail markdown={error.message} />;
  }

  const domains = data?.map((app) => app.rootDomain).filter((value, index, self) => self.indexOf(value) === index);
  const { data: apps, visitItem } = useFrecencySorting(data?.filter(app => {
    if (!selectedDomain || selectedDomain == "<all>") {
      return true;
    }

    return app.rootDomain == selectedDomain;
  }), {
    key: (app) => app.name,
  });


  return (
    <List isLoading={apps.length == 0} searchBarAccessory={<List.Dropdown tooltip="Domain" defaultValue={"<all>"} onChange={(domain) => setSelectedDomain(domain)}>
      <List.Dropdown.Section>
        <List.Dropdown.Item icon={Icon.Globe} key="all" title="All Domains" value="<all>" />
      </List.Dropdown.Section>
      <List.Dropdown.Section>
        {domains?.map(domain => <List.Dropdown.Item icon={Icon.Globe} key={domain} title={domain} value={domain} />)}
      </List.Dropdown.Section>
    </List.Dropdown>}>
      <List.EmptyView title="No Apps Found" actions={<ActionPanel>
        <Action.Push icon={Icon.Cog} title="Configure Dirs" target={<ConfigureDirs defaultValue={dirs} onSubmit={async (dirs) => { await setDirs(dirs); navigation.pop() }} />} onPop={() => mutate()} />
      </ActionPanel>} />
      {apps?.map((app) => (
        <List.Item
          icon={getFavicon(app.url, {
            mask: Image.Mask.RoundedRectangle,
            fallback: Icon.Globe,
          })}
          key={app.url}
          keywords={[app.name, app.rootDomain]}
          title={app.name}
          subtitle={app.rootDomain}
          accessories={[{ text: app.url }]}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.OpenInBrowser title="Open in Browser" url={app.url} onOpen={() => visitItem(app)} />
                {preferences.editor ? (
                  <Action.Open title="Open in Editor" icon={Icon.Pencil} target={app.dir} application={preferences.editor} onOpen={() => visitItem(app)} />
                ) : null}
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
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action.CopyToClipboard
                  shortcut={Keyboard.Shortcut.Common.Copy}
                  title="Copy Link"
                  content={app.url}
                  onCopy={() => visitItem(app)}
                />
                <Action.CopyToClipboard
                  shortcut={Keyboard.Shortcut.Common.CopyPath}
                  title="Copy Path"
                  content={app.dir}
                  onCopy={() => visitItem(app)}
                />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action.Push icon={Icon.Cog} title="Configure Dirs" target={<ConfigureDirs defaultValue={dirs} onSubmit={async (dirs) => { await setDirs(dirs); navigation.pop() }} />} onPop={() => mutate()} />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function ConfigureDirs(props: { defaultValue?: string[], onSubmit: (dirs: string[]) => void }) {
  return <Form actions={
    <ActionPanel>
      <Action.SubmitForm onSubmit={(values) => {
        props.onSubmit(values.dirs)
      }} />

    </ActionPanel>
  }>
    <Form.FilePicker id="dirs" title="Dirs" canChooseFiles={false} canChooseDirectories defaultValue={props.defaultValue} />
  </Form>
}

