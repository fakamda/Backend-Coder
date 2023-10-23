import { PERSISTENCE } from '../config/config.js'

export let User

switch (PERSISTENCE) {
    case 'MONGO': 
        const { default: UserDAO } = await import('../Dao/user.mongo.dao.js')
        User = UserDAO
        break
    case 'FILE':
        const { default: UserFileDAO } = await import('../Dao/user.file.dao.js')
        User = UserFileDAO
        break
        
    default:
        break
}