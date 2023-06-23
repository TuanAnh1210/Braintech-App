/* eslint-disable react/prop-types */
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/Header';

const DefaultLayout = ({ children }) => {
    return (
        <div className="main">
            <Header />
            <div style={{ paddingTop: 'var(--height-header)' }}>{children}</div>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
