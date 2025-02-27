import { open, getPreferenceValues } from "@raycast/api";
import path from "path";

const preferences = getPreferenceValues<Preferences.OpenConfig>();

export default async function () {
    const configPath = path.join(preferences.dir, ".smallweb", "config.json");
    await open(configPath, preferences.editor)

}

