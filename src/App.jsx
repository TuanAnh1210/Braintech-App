import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from './layouts';
import { RoutesAdmin, publicRoutes } from './routes/routes';
import { AdminLayout, DefaultLayout } from './layouts';
import { publicRoutes, privateRoutes } from './routes/routes';
import { Fragment } from 'react';
import AdminLayout from './layouts/Admin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="">
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = DefaultLayout;
                        if (route.layout === null) {
                            Layout = Fragment;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Route>
            </Routes>

            <Routes>
                <Route path="admin">
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;
                        let Layout = AdminLayout;
                        if (route.layout === null) {
                            Layout = Fragment;
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Route>
            </Routes>
            <Routes>
                {RoutesAdmin.map((route, index) => {
                    const Page = route.component;
                    let Layout = AdminLayout;
                    if (route.layout === null) {
                        Layout = Fragment;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
