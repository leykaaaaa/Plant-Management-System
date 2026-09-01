import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CropAssessment from "./pages/CropAssessment";
import Profile from "./pages/Profile";
import PlantingCalendar from "./pages/PlantingCalendar";
import Weather from "./pages/Weather";
import ProtectedRoute from "./components/ProtectedRoute";
import CropCatalogue from "./pages/CropCatalogue";
import CropDetails from "./pages/CropDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/catalogue"
    element={
        <ProtectedRoute>
            <CropCatalogue />
        </ProtectedRoute>
    }
/>

<Route
    path="/crops/:id"
    element={
        <ProtectedRoute>
            <CropDetails />
        </ProtectedRoute>
    }
/>

<Route
    path="/crop-assessment"
    element={
        <ProtectedRoute>
            <CropAssessment />
        </ProtectedRoute>
    }
/>

<Route
    path="/planting-calendar"
    element={
        <ProtectedRoute>
            <PlantingCalendar />
        </ProtectedRoute>
    }
/>

<Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>

<Route
    path="/weather"
    element={
        <ProtectedRoute>
            <Weather />
        </ProtectedRoute>
    }
/>

                

            </Routes>
        </BrowserRouter>
    );
}

export default App;