import { Routes } from 'react-router-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './pages/Home';
import TermsOfUse from './pages/TermsofUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FindAccount from './pages/FindAccount';
import Product from './pages/Product';
import About from './pages/About';
import ScrollToTopRouter from './components/elements/ScrollToTopRouter';
import MasVendidos from './pages/MasVendidos';
import PurchaseSafe from './pages/help/PurchaseSafe';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTopRouter />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/find-account" element={<FindAccount />} />
                <Route path="/product/:productId" element={<Product />} />
                <Route path="/MasVendidos" element={<MasVendidos />} />
                <Route path="/about" element={<About />} />
                <Route path="/purchase-safe" element={<PurchaseSafe />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
