import {
  RouteObject,
  RouterProvider,
  RouterProviderProps,
  createBrowserRouter,
} from "react-router-dom";
import { IS_DEV } from "@web/common/constants/env.constants";
import { ROOT_ROUTES } from "@web/common/constants/routes";
import { AbsoluteOverflowLoader } from "@web/components/AbsoluteOverflowLoader";
import {
  loadAuthenticated,
  loadDayData,
  loadRootData,
  loadSpecificDayData,
} from "@web/routers/loaders";

const devOnlyRoutes: RouteObject[] = IS_DEV
  ? [
      {
        path: ROOT_ROUTES.CLEANUP,
        lazy: async () =>
          import(
            /* webpackChunkName: "cleanup" */ "@web/views/Cleanup/Cleanup"
          ).then((module) => ({
            Component: module.CleanupView,
          })),
      },
    ]
  : [];

export const router = createBrowserRouter(
  [
    {
      lazy: async () =>
        import(/* webpackChunkName: "calendar" */ "@web/views/Root").then(
          (module) => ({
            Component: module.RootView,
          }),
        ),
      loader: loadAuthenticated,
      children: [
        {
          path: ROOT_ROUTES.NOW,
          lazy: async () =>
            import(
              /* webpackChunkName: "now" */ "@web/views/Now/view/NowView"
            ).then((module) => ({
              Component: module.NowView,
            })),
        },
        {
          path: ROOT_ROUTES.DAY,
          lazy: async () =>
            import(
              /* webpackChunkName: "day" */ "@web/views/Day/view/DayView"
            ).then((module) => ({ Component: module.DayView })),
          children: [
            {
              path: ROOT_ROUTES.DAY_DATE,
              id: ROOT_ROUTES.DAY_DATE,
              loader: loadSpecificDayData,
              lazy: async () =>
                import(
                  /* webpackChunkName: "date" */ "@web/views/Day/view/DayViewContent"
                ).then((module) => ({ Component: module.DayViewContent })),
            },
            {
              index: true,
              loader: loadDayData,
            },
          ],
        },
        {
          path: ROOT_ROUTES.LOGOUT,
          lazy: async () =>
            import(/* webpackChunkName: "logout" */ "@web/views/Logout").then(
              (module) => ({
                Component: module.LogoutView,
              }),
            ),
        },
        {
          path: ROOT_ROUTES.WEEK,
          lazy: async () =>
            import(/* webpackChunkName: "week" */ "@web/views/Calendar").then(
              (module) => ({
                Component: module.CalendarView,
              }),
            ),
        },
        {
          path: ROOT_ROUTES.ROOT,
          loader: loadRootData,
        },
      ],
    },
    {
      path: ROOT_ROUTES.LOGIN,
      lazy: async () =>
        import(
          /* webpackChunkName: "login" */ "@web/views/Login/LoginView"
        ).then((module) => ({
          Component: module.LoginView,
        })),
    },
    {
      path: ROOT_ROUTES.SIGNUP,
      lazy: async () =>
        import(
          /* webpackChunkName: "signup" */ "@web/views/Signup/SignupView"
        ).then((module) => ({
          Component: module.SignupView,
        })),
    },
    {
      path: ROOT_ROUTES.FORGOT_PASSWORD,
      lazy: async () =>
        import(
          /* webpackChunkName: "forgot-password" */ "@web/views/ForgotPassword/ForgotPasswordView"
        ).then((module) => ({
          Component: module.ForgotPasswordView,
        })),
    },
    {
      path: ROOT_ROUTES.RESET_PASSWORD,
      lazy: async () =>
        import(
          /* webpackChunkName: "reset-password" */ "@web/views/ResetPassword/ResetPasswordView"
        ).then((module) => ({
          Component: module.ResetPasswordView,
        })),
    },
    {
      path: ROOT_ROUTES.VERIFY_EMAIL,
      lazy: async () =>
        import(
          /* webpackChunkName: "verify-email" */ "@web/views/VerifyEmail/VerifyEmailView"
        ).then((module) => ({
          Component: module.VerifyEmailView,
        })),
    },
    ...devOnlyRoutes,
    {
      path: "*",
      lazy: async () =>
        import(/* webpackChunkName: "not-found" */ "@web/views/NotFound").then(
          (module) => ({
            Component: module.NotFoundView,
          }),
        ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

export const CompassRouterProvider = (
  props?: Partial<Pick<RouterProviderProps, "router">>,
) => {
  return (
    <RouterProvider
      router={props?.router ?? router}
      future={{ v7_startTransition: true }}
      fallbackElement={<AbsoluteOverflowLoader />}
    />
  );
};
