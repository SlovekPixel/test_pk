import { google } from 'googleapis'
import getEnv from '../helpers/getEnv.js'


const GOOGLE_SERVICE_ACCOUNT_KEY = getEnv("GOOGLE_SERVICE_ACCOUNT_KEY")
const SHEET_ID = getEnv("SHEET_ID")

export const exportToGoogleSheet = async (data) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: GOOGLE_SERVICE_ACCOUNT_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth });

    const rows = data.map(client => [
        client.id,
        client.firstName,
        client.lastName,
        client.gender,
        client.address,
        client.city,
        client.phone,
        client.email,
        client.status,
    ])

    const LIST_NAME = getEnv("LIST_NAME")
    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${LIST_NAME}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
            values: [['ID', 'First Name', 'Last Name', 'Gender', 'Address', 'City', 'Phone', 'Email', 'Status'], ...rows],
        },
    })

    console.log('Данные успешно экспортированы в Google Таблицу.')
}
