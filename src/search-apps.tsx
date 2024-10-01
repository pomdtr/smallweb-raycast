import { Action, ActionPanel, Clipboard, Detail, getPreferenceValues, Icon, List } from "@raycast/api";
import { getFavicon, usePromise } from "@raycast/utils";
import * as client from "./client";
import type { FileStat } from "webdav"
import path from "path";

const { dir } = getPreferenceValues<Preferences.SearchApps>()

export default function SearchApps() {
    const { data: apps, isLoading } = usePromise(async () => {
        const resp = await client.api["/v0/apps"].get()
        if (!resp.ok) {
            throw new Error(resp.statusText)
        }

        return resp.json()
    })

    return <List isLoading={isLoading}>{
        apps?.map(app => <List.Item icon={getFavicon(app.url, {
            fallback: Icon.Globe,
        })} key={app.name} title={app.name} accessories={[{ text: app.url }]} actions={
            <ActionPanel>
                <Action.OpenInBrowser title="Open in Browser" url={app.url} />
                {dir ? <Action.Open application="Finder" title="Open in finder" target={path.join(dir, app.name)} /> : null}
                {dir ? <Action.OpenWith path={path.join(dir, app.name)} /> : null}
                <Action.Push icon={Icon.Folder} title="Browse Files" target={<BrowseDir path={`/${app.name}`} />} />
                <Action.CopyToClipboard title="Copy URL" content={app.url} />
            </ActionPanel>
        } />)
    }</List>
}

function BrowseDir(props: { path: string }) {
    const { data: files, isLoading } = usePromise(async () => {
        return client.webdav.getDirectoryContents(props.path) as Promise<FileStat[]>
    })

    return <List isLoading={isLoading}>{
        files?.map(file => <List.Item key={file.filename} title={file.basename} accessories={[{ text: file.type }]} actions={
            <ActionPanel>
                {
                    file.type === "directory" ? <Action.Push icon={Icon.Folder} title="Browse Files" target={<BrowseDir path={file.filename} />} /> : <Action.Push title="View File" target={<ViewFile path={file.filename} />} />
                }
                <Action title="Copy Content" onAction={async () => {
                    const content = await client.webdav.getFileContents(file.filename, { format: "text" }) as string
                    await Clipboard.copy(content)
                }} />
            </ActionPanel>

        } />)
    }</List>
}

function codeblock(code: string) {
    return "```" + "\n" + code + "\n```"
}

function ViewFile(props: { path: string }) {
    const { data: content, isLoading } = usePromise(async () => {
        return client.webdav.getFileContents(props.path, { format: "text" }) as Promise<string>
    })

    return <Detail isLoading={isLoading} markdown={codeblock(content || "")} />
}

