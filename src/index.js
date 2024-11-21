import { authenticateUser } from './services/auth.js'
import { fetchClients, fetchStatuses } from './services/client.js'
import { exportToGoogleSheet } from './services/googleSheet.js'
import { handleError } from './helpers/error.js'
import getEnv from './helpers/getEnv.js'


(async () => {
    try {
        const USERNAME = getEnv('USERNAME')

        const token = await authenticateUser(USERNAME)

        const clients = await fetchClients(token)

        const userIds = clients.map(client => client.id)
        const statuses = await fetchStatuses(token, userIds)

        const clientData = clients.map(client => ({
            ...client,
            status: statuses.find(status => status.id === client.id)?.status || 'Unknown',
        }))

        await exportToGoogleSheet(clientData)
    } catch (error) {
        handleError(error)
    }
})()
