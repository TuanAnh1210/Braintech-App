import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AdminLayout, DefaultLayout } from './layouts';
import { publicRoutes, privateRoutes } from './routes/routes';
import { Fragment } from 'react';
import Account from './pages/Client/Account';

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
        </Router>
    );
}

export default App;
