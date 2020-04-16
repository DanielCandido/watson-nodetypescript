import { Router } from 'express'
import WatsonController from './controllers/watson-controller'

const router = Router()

router.get('/watson', WatsonController.index)
router.post('/watson-translator', WatsonController.translate)
router.post('/watson-speechToText', WatsonController.speechToText)
router.post('/watson-textToSpeech', WatsonController.textToSpeech)

export default router
