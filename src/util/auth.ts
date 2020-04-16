import passport from 'passport'
import { Strategy } from 'passport-steam'

passport.use(new Strategy({
  apiKey: '4E1429D021E17917F27A658AFA81D97A',
  realm: 'http://localhost:3333/',
  returnURL: 'http://localhost:3333/success'
}, (identifier, profile, done) => {
  profile.identifier = identifier
  done(null, profile)
}))
