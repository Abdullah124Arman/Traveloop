import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../layout/AppLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import TripList from '../pages/TripList';
import CreateTrip from '../pages/CreateTrip';
import Builder from '../pages/Builder';
import ItineraryView from '../pages/ItineraryView';
import Profile from '../pages/Profile';
import Search from '../pages/Search';
import Community from '../pages/Community';
import Checklist from '../pages/Checklist';
import Notes from '../pages/Notes';
import Invoice from '../pages/Invoice';
import Admin from '../pages/Admin';

export function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* Protected */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/create" element={<CreateTrip />} />
        <Route path="/trips/:id/builder" element={<Builder />} />
        <Route path="/trips/:id/view" element={<ItineraryView />} />
        <Route path="/trips/:id/checklist" element={<Checklist />} />
        <Route path="/trips/:id/notes" element={<Notes />} />
        <Route path="/trips/:id/invoice" element={<Invoice />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/community" element={<Community />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
