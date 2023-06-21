/* eslint-disable react/prop-types */
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/Header';

const DefaultLayout = ({ children }) => {
    return (
        <div className="main">
            <Header />
            <div>{children}</div>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
