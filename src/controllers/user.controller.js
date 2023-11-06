import UserDTO from "../dto/user.dto"
import UserModel from "../models/user.model"
import { devLogger } from "../utils/logger"

export const premiumUserController = async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.uid)
      await UserModel.findByIdAndUpdate(req.params.uid, { role: user.role === 'user' ? 'premium' : 'user' })
      res.json({ status: 'success', message: 'Se ha actualizado el rol del usuario' })
    } catch (err) {
      res.json({ status: 'error', error: err.message })
    }
  }

  export const addFilesController = async (req, res) => {
    try {
        if(!req.files) {
            devLogger.info("no image")
        }

        const uid = req.params.uid
        const user = await res.UserModel.findById(uid)
        if(!user) return res.status(404).json({ status: 'error', message: 'User Not found' })

        if(!user.documents) {
            user.documents = []
            user.status = false
        }

        const { fileType } = req.body
        if (fileType === "profile") {
            user.profilePicture = req?.files[0]?.originalname
        }
        if (fileType === "document") {
            user.documents.push({
                name: req.files[0].originalname,
                reference: req.files[0].originalname
            })
            
            user.status = true
        }
        await UserModel.findByIdAndUpdate(uid, user, { new: true })
        res.redirect("/session/current")

    } catch (err) {

        devLogger.error(err.message)
        res.status(500).json({ status: 'error', message: 'Server Error' })
    }
  }

  export const deleteUserController = async (req, res) => {
    try {
        const uid = req.params.uid
        const findUserById = await UserModel.findById(uid)
        if (findUserById) {
            const user = new UserDTO(findUserById)
            //funcion para enviar mail al usuario de que su cuenta fue eliminada 
            ///await sendDeletedAccountEmail(user)
        }
        await UserModel.findByIdAndDelete(uid)
        res.status(200).json({ status: 'success', message: 'The user has been deleted' })

    } catch (err) {
        devLogger.error(err.message)
        res.status(500).json({ status: 'error', message: 'error.message' })
    }
  }

  export const deleteInactiveUserController = async (req, res) => {
    try {
        const currentDate = new Date()
        const twoDaysAgo = new Date(currentDate)
        twoDaysAgo.setDate(currentDate.getDate() -2)
        // const thirtyMinutesAgo = new Date(currentDate)
        // thirtyMinutesAgo.setDate(currentDate.getDate() -30)
        const findInactiveUsers = await UserModel.find({ last_connection: {$lt: twoDaysAgo} })
        const users = findInactiveUsers.map((user) => new UserDTO(user))
        const inactiveUsers = users.filter((user) => user.role !== 'admin')

        if (inactiveUsers.length > 0) {
            for (const user of inactiveUsers) {
                if (user.role != 'admin') {
                    await UserModel.findByIdAndDelete(user.id)
                     ///await sendDeletedAccountEmail(user)
                }
            }
            res.status(200).json({ status: 'success', message: 'The inactives user has been deleted' })
        } else {
            res.status(404).json({ status: "error", message: "inactive users not found" })
        }
    } catch (err) {
        devLogger.error(err.message)
        res.status(500).json({ status: "error", message: "Server Error" })
    }
  }