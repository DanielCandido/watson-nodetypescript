import { IamAuthenticator } from 'ibm-watson/auth'
import DiscoveryV1 from 'ibm-watson/discovery/v1'
import SpeechToText from 'ibm-watson/speech-to-text/v1'
import TextToSpeech from 'ibm-watson/text-to-speech/v1'
import Translator from 'ibm-watson/language-translator/v3'
import { Request, Response } from 'express'
import fs from 'fs'

class WatsonController {
  // LIST ENVIROMENT
  public async index (req: Request, res: Response): Promise<Response> {
    try {
      const discoveryClient = new DiscoveryV1({
        authenticator: new IamAuthenticator({
          apikey: process.env.PUBLIC_KEY_WATSON
        })
      })

      discoveryClient.listEnvironments().then(data => {
        console.log(data)
        return res.send('API NODE COM TYPESCRIPT + CONEXAO COM WATSON')
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      return res.send(e)
    }
  }

  // Speech
  public async translate (req: Request, res: Response): Promise<Response> {
    try {
      const message = req.body
      // const textToSpeech = new Speech({
      //   authenticator: new watson.IamAuthenticator({ apikey: 'wDR6_m4DQ43NJnIZ0KUFys-AJzVGdhDvFH1gAmkMpaNl' }),
      //   URL: 'https://stream.watsonplatform.net/text-to-speech/api/'
      // })

      const translator = new Translator({
        authenticator: new IamAuthenticator({ apikey: process.env.PRIVATE_KEY_TRANSLATION }),
        URL: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/5891d1e5-02a2-4d8d-919a-5c29da3f8318/v3/translate?version=2018-05-01',
        version: '2018-05-01',
        disableSslVerification: true
      })

      translator.translate(
        {
          text: [message.message],
          source: message.source,
          target: message.target
        }
      ).then(response => {
        res.send(JSON.stringify(response.result, null, 2))
      }).catch(e => {
        res.send(e)
      })
    } catch (e) {
      console.log(e)
      return res.send(e)
    }
  }

  public async speechToText (req: Request, res: Response): Promise<Response> {
    try {
      const speechText = new SpeechToText({
        authenticator: new IamAuthenticator({ apikey: process.env.PRIVATE_KEY_SPEECHTOTEXT }),
        url: 'https://stream.watsonplatform.net/speech-to-text/api/'
      })

      const params = {
        // From file
        audio: fs.createReadStream('./public/audio-file.flac'),
        contentType: 'audio/flac; rate=44100'
      }

      speechText.recognize(params, null).then(response => {
        console.log(JSON.stringify(response.result, null, 2))
        res.send(response.result.results[0].alternatives[0].transcript)
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      return res.send(e)
    }
  }

  public async textToSpeech (req: Request, res: Response): Promise<Response> {
    try {
      const msg = req.body

      const textSpeech = new TextToSpeech({
        authenticator: new IamAuthenticator({ apikey: process.env.PRIVATE_KEY_TEXTTOSPEECH }),
        url: 'https://stream.watsonplatform.net/text-to-speech/api/'
      })

      const params = {
        text: msg.message,
        voice: 'en-US_AllisonVoice', // Optional voice
        accept: 'audio/wav'
      }

      textSpeech
        .synthesize(params)
        .then(response => {
          const audio = response.result
          return textSpeech.repairWavHeaderStream(audio)
        })
        .then(repairedFile => {
          fs.writeFileSync('audio.wav', repairedFile)
          res.send('Ok')
        })
        .catch(err => {
          console.log(err)
        })
    } catch (e) {
      return res.send(e)
    }
  }
}

export default new WatsonController()
