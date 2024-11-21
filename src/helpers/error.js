import {DateTime} from 'luxon'


export const handleError = (error) => {
    console.error(`Error received at ${DateTime.now().toFormat('hh-mm-ss')}: `, error.response?.data || error.message)
    throw new Error(error.message)
}
