import { Action, ActionPanel, Clipboard, Detail, getPreferenceValues, Icon, Image, Keyboard, List } from "@raycast/api";
import { getFavicon, usePromise, useFrecencySorting } from "@raycast/utils";
import * as client from "./client";
import type { FileStat } from "webdav"
import path from "path";

const { dir } = getPreferenceValues<Preferences.SearchApps>()

export default function SearchApps() {
    const { data, isLoading } = usePromise(async () => {
        const resp = await client.api["/v0/apps"].get()
        if (!resp.ok) {
            throw new Error(resp.statusText)
        }

        return resp.json()
    })

    const { data: apps, visitItem } = useFrecencySorting(data, {
        key: app => app.name,
    });

    return <List isLoading={isLoading}>{
        apps?.map(app => <List.Item icon={getFavicon(app.url, {
            fallback: Icon.Globe,
            mask: Image.Mask.RoundedRectangle,
        })} key={app.name} keywords={[app.name]} title={app.manifest?.short_name || app.name} subtitle={app.manifest?.description} accessories={[{ text: app.name }]} actions={
            <ActionPanel>
                <ActionPanel.Section>
                    <Action.OpenInBrowser title="Open in Browser" url={app.url} onOpen={() => visitItem(app)} />
                    <Action.Push icon={Icon.Folder} title="Browse Files" target={<BrowseDir path={`/${app.name}`} />} />
                    <Action.CopyToClipboard shortcut={Keyboard.Shortcut.Common.Copy} title="Copy Link" content={app.url} onCopy={() => visitItem(app)} />
                </ActionPanel.Section>
                {dir ?
                    <ActionPanel.Section>
                        <Action.Open shortcut={Keyboard.Shortcut.Common.Open} application="Finder" title="Open in finder" target={path.join(dir, app.name)} />
                        <Action.OpenWith shortcut={Keyboard.Shortcut.Common.OpenWith} path={path.join(dir, app.name)} onOpen={() => visitItem(app)} />
                        <Action.CopyToClipboard shortcut={Keyboard.Shortcut.Common.CopyPath} title="Copy Path" content={path.join(dir, app.name)} onCopy={() => visitItem(app)} />
                    </ActionPanel.Section> : null}
            </ActionPanel>
        } />)
    }</List>
}

function BrowseDir(props: { path: string }) {
    const { data: entries, isLoading } = usePromise(async () => {
        return client.webdav.getDirectoryContents(props.path) as Promise<FileStat[]>
    })

    return <List isLoading={isLoading}>{
        entries?.map(entry => <List.Item icon={entry.type == "directory" ? Icon.Folder : Icon.Document} key={entry.filename} title={entry.basename} accessories={[{ text: entry.type }]} actions={
            <ActionPanel>
                {entry.type === "directory" ?
                    <ActionPanel.Section>
                        <Action.Push icon={Icon.Folder} title="Browse Files" target={<BrowseDir path={entry.filename} />} />
                    </ActionPanel.Section>
                    :
                    <ActionPanel.Section>
                        <Action.Push title="View File" target={<ViewFile entry={entry} />} />
                        <FileActions entry={entry} />
                    </ActionPanel.Section>
                }
            </ActionPanel>

        } />)
    }</List>
}

function FileActions({ entry }: { entry: FileStat }) {
    return <>
        {dir ? <Action.Open shortcut={Keyboard.Shortcut.Common.Open} title="Open" icon={Icon.Document} target={path.join(dir, entry.filename)} /> : null}
        {dir ? <Action.OpenWith shortcut={Keyboard.Shortcut.Common.OpenWith} path={path.join(dir, entry.filename)} /> : null}
        {dir ? <Action.CopyToClipboard shortcut={Keyboard.Shortcut.Common.CopyPath} title="Copy Path" content={path.join(dir, entry.filename)} /> : null}
        <Action shortcut={Keyboard.Shortcut.Common.Copy} icon={Icon.Clipboard} title="Copy Content" onAction={async () => {
            const content = await client.webdav.getFileContents(entry.filename, { format: "text" }) as string
            await Clipboard.copy(content)
        }} />
    </>
}



function ViewFile({ entry }: { entry: FileStat }) {
    const { data: content, isLoading } = usePromise(async () => {
        return client.webdav.getFileContents(entry.filename, { format: "text" }) as Promise<string>
    })
    const extension = path.extname(entry.filename) || "txt"

    return <Detail isLoading={isLoading} markdown={content ? codeblock(content, extension.slice(1)) : undefined} actions={
        <ActionPanel>
            <FileActions entry={entry} />
        </ActionPanel>
    } />
}

function codeblock(code: string, lang: string) {
    return "```" + lang + "\n" + code + "\n```"
}
