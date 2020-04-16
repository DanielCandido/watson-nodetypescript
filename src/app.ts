import express from 'express'
import cors from 'cors'
import router from './router'

class App {
    public express: express.Application

    public constructor () {
      this.express = express()
      this.middlewares()
      this.router()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private router (): void {
      this.express.use(router)
    }
}

export default new App().express
