// App.jsx
import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ManagementPanel from "./ManagementPanel";
import DefineUser from "./DefineUser";
import OriginDefineUser from "./OriginDefineUser.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const Dashboard = lazy(() => import("./features/Dashboard"));
const MediaTester = lazy(() => import("./features/lobby/MediaTester"));
const MobileMediaTester = lazy(() => import("./features/lobby/MobileMediaTester.tsx"));
const Main = lazy(() => import("./features/meeting/Main"));
const AuthModal=lazy(()=>import("./AuthModal.tsx"))

/*controller req server */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
  </div>
);


function App() {
  
    


  return (
    <Suspense fallback={<Spinner />}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" >
            <Route index element={<AuthModal isOpen={true}  />} />
          
          </Route>
          <Route path="/" element={<ManagementPanel />}>
            <Route index element={<Dashboard />} />
            <Route path="define-role-user" element={<DefineUser />} />
            <Route path="define-user" element={<OriginDefineUser />} />
          </Route>


          <Route path="/session" >
            <Route index element={<Main />} />
            <Route path="testDevice" element={<MediaTester />} />
            <Route path="testMobileDevice" element={<MobileMediaTester />} />

          </Route>
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
