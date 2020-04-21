import { Router } from 'express'
import WatsonController from './controllers/watson-controller'
import uploads from './util/upload'

const router = Router()

router.get('/watson', WatsonController.index)
router.post('/watson-translator', WatsonController.translate)
router.post('/watson-speechToText', uploads.single('audio'), WatsonController.speechToText)
router.post('/watson-textToSpeech', WatsonController.textToSpeech)

export default router
