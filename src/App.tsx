import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

/* ─── Root Route ─── */
const rootRoute = createRootRoute({
  component: () => (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  ),
})

/* ─── Routes ─── */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$slug',
  component: ProjectDetailPage,
})

/* ─── Router ─── */
const routeTree = rootRoute.addChildren([indexRoute, projectDetailRoute])
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return <RouterProvider router={router} />
}
