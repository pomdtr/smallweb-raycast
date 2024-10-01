import * as fets from 'fets'
import type openapi from 'smallweb'
import { getPreferenceValues } from '@raycast/api'
import * as webdav from 'webdav'

const { token, endpoint } = getPreferenceValues<ExtensionPreferences>()

const apiClient = fets.createClient<fets.NormalizeOAS<typeof openapi>>({
    endpoint,
    globalParams: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
})

const webdavClient = webdav.createClient(new URL("/webdav", endpoint).toString(), {
    authType: webdav.AuthType.Password,
    username: token,
})

webdavClient.getDirectoryContents("/", {
})


export { apiClient as api, webdavClient as webdav }
