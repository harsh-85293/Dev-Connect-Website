import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Components/Body"
import Login from "./Components/Login";
import Profile from "./Components/Profile"
import EditProfile from "./Components/EditProfile"
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./Components/Feed";
import Connections from "./Components/Connections";
import Requests from "./Components/Requests";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import ChatbotWrapper from "./Components/ChatbotWrapper";
import { ThemeProvider } from "./contexts/ThemeContext";
import HelpCenter from "./Components/HelpCenter";
import CommunityGuidelines from "./Components/CommunityGuidelines";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsOfService from "./Components/TermsOfService";
import ContactUs from "./Components/ContactUs";
import EmailPreferences from "./Components/EmailPreferences";
import Checkout from "./Components/Checkout";
import CheckoutSuccess from "./Components/CheckoutSuccess";
import CheckoutCancel from "./Components/CheckoutCancel";
import Premium from "./Components/Premium";
import Chat from "./Components/Chat";

function App() {
  return (  
    <Provider store={appStore}>
      <ThemeProvider>
        <BrowserRouter basename="/">
          <div className="min-h-screen flex flex-col bg-base-100">
            <NavBar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Body/>}>
                  <Route index element={<Feed/>} />
                  <Route path="feed" element={<Feed/>} />
                  <Route path="profile" element={<Profile/>} />
                  <Route path="edit-profile" element={<EditProfile/>} />
                  <Route path="email-preferences" element={<EmailPreferences/>} />
                  <Route path="connections" element={<Connections/>} />
                  <Route path="requests" element={<Requests/>} />
                </Route>
                <Route path="/login" element={<Login/>} />
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/checkout/phonepe/success" element={<CheckoutSuccess/>} />
                <Route path="/checkout/cancel" element={<CheckoutCancel/>} />
                <Route path="/premium" element={<Premium/>} />
                <Route path="/help" element={<HelpCenter/>} />
                <Route path="/guidelines" element={<CommunityGuidelines/>} />
                <Route path="/privacy" element={<PrivacyPolicy/>} />
                <Route path="/terms" element={<TermsOfService/>} />
                <Route path="/contact" element={<ContactUs/>} />
                <Route path="/chat/:targetuserid" element = {<Chat/>} /> 
              </Routes>
                </main>
                <Footer />
                <ChatbotWrapper />
              </div>
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
  );
}

export default App;