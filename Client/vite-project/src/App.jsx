import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import { AuthProvider } from './components/authcontext';
import PrivateRoute from './components/Privateroute';
import ProtectedRoute from './components/ProtextedRpute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CostEstimatorInput from './components/Cost_Estimator_Input';
import CostEstimatorOutput from './components/Cost_Estimator_Output';
import About from './components/About';
import SignUpForm from './components/SignUp';
import SignInForm from './components/SignIn';
import SocietyFinder from './components/Search';
import SocietyCards from './components/socitiescard';
import SocietyDetails from './components/SocietyDetails';
import History from './components/History';
import SocietyTrends from './components/FutureTrends';
import PricePredictor from './components/PricePredictor';
import SocietyReviewForm from './components/SocietyReview';
import TrendingSocietiesIntro from './components/TrendingIntro';
import TrendingSocietiesByCity from './components/TrendingSocities';
import SocietyReviewsChart from './components/SocietyReviewsChart';
import SocietyRecommender from './components/SocietyRecommender';
import AdminDashboard from './components/adminDashboard';
import ManageUsers from './components/Adminmanageusers';
import ManageSocieties from './components/Adminmanagesocities';
import ManageStandardMaterials from './components/Adminmanagestandardmatrials';
import ManageQualityMaterials from './components/Adminmanagequalitymaterials';
import ManageQualityMaterialQuantities from './components/Adminqualityquantities';
import ManageElectricalCosts from './components/Adminelectricalcosts';
import { Toaster } from 'react-hot-toast';

import ContactPage from './components/ContactPage'; // Import Contact Page component

function App() {
  return (
    <ParallaxProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

                {/* Protected Contact Page Route */}
                <Route
                  path="/contact"
                  element={
                    <PrivateRoute>
                      <ContactPage />
                    </PrivateRoute>
                  }
                />

                {/* Authentication Routes */}
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/signin" element={<SignInForm />} />

                {/* Trending Societies Introduction */}
                <Route
                  path="/trending-societies-intro"
                  element={<TrendingSocietiesIntro />}
                />

                {/* Trending Societies by City Route */}
                <Route
                  path="/top-trending-societies"
                  element={<TrendingSocietiesByCity />}
                />

                {/* Society Trends Route */}
                <Route
                  path="/society-trends/:societyId"
                  element={<SocietyTrends />}
                />

                {/* Society Reviews Chart */}
                <Route
                  path="/society-reviews/:societyId"
                  element={<SocietyReviewsChart />}
                />

                {/* Protected Routes (Require Authentication) */}
                <Route
                  path="/cost-estimator"
                  element={
                    <PrivateRoute>
                      <CostEstimatorInput />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cost-estimator-output"
                  element={
                    <PrivateRoute>
                      <CostEstimatorOutput />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <PrivateRoute>
                      <SocietyFinder />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/societies"
                  element={
                    <PrivateRoute>
                      <SocietyCards />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/society-details/:societyId"
                  element={
                    <PrivateRoute>
                      <SocietyDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <History />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/price-predictor"
                  element={
                    <PrivateRoute>
                      <PricePredictor />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/society-review/:societyId"
                  element={
                    <PrivateRoute>
                      <SocietyReviewForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/society-recommender"
                  element={
                    <PrivateRoute>
                      <SocietyRecommender />
                    </PrivateRoute>
                  }
                />

                {/* Admin Routes (Require Admin Role) */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <ManageUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/societies"
                  element={
                    <ProtectedRoute>
                      <ManageSocieties />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/standard-materials"
                  element={
                    <ProtectedRoute>
                      <ManageStandardMaterials />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quality-materials"
                  element={
                    <ProtectedRoute>
                      <ManageQualityMaterials />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quality-material-quantities"
                  element={
                    <ProtectedRoute>
                      <ManageQualityMaterialQuantities />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/electrical-costs"
                  element={
                    <ProtectedRoute>
                      <ManageElectricalCosts />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
        <Toaster /> {/* Toaster component for displaying toast notifications */}
      </AuthProvider>
    </ParallaxProvider>
  );
}

export default App;
