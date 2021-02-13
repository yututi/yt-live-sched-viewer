import loadable from '@loadable/component'
import PropTypes from 'prop-types'
import {
  Switch,
  Route
} from 'react-router-dom'

export const routes = [
  {
    name: '配信予定',
    path: '/',
    component: loadable(() => import('./views/Home'))
  },
  {
    name: '配信中',
    path: '/streaming',
    component: loadable(() => import('./views/Streaming'))
  }
]

const RouterView = (props) => {
  const _routes = props.routes || routes
  const routerProps = props
  return (
        <Switch>
            {_routes.map((route, i) =>
              (<Route
                    exact
                    key={i}
                    path={route.path}
                    render={props => (<route.component {...props} routes={route.routes} {...routerProps}></route.component>)}/>
              ))
            }
        </Switch>
  )
}
RouterView.propTypes = {
  routes: PropTypes.arrayOf(Object)
}

export default RouterView
