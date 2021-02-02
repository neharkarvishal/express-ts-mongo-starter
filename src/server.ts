import './miscSetup'

import 'dotenv/config'

import App from './app'
import Auth from './modules/auth'
import Home from './modules/home'
import Users from './modules/users'
import validateEnv from './utils/validateEnv'

validateEnv()

App.of([Home, Users, Auth]).listen()
