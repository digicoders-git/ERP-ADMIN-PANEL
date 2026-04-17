import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainDashBord from "./Dashbord.jsx/MainDashBord";
import Login from "./Login";
import AdminDashboard from "./Dashbord.jsx/AdminDashboard";
import BranchManagement from "./Dashbord.jsx/BranchManagement";
import BranchDetail from "./Dashbord.jsx/BranchDetail";
import AddBranch from "./Dashbord.jsx/AddBranch";
import ChangePassword from "./Dashbord.jsx/ChangePassword";
import Reports from "./Dashbord.jsx/Reports";
import StaffPanelData from "./Dashbord.jsx/StaffPanelData";
import TeacherPanelData from "./Dashbord.jsx/TeacherPanelData";
import FeePanelData from "./Dashbord.jsx/FeePanelData";
import StaffProfile from "./Dashbord.jsx/StaffProfile";
import AdminProfile from "./Dashbord.jsx/AdminProfile";
import { TransportPanelData, LibraryPanelData, HostelPanelData, ParentPanelData, LibrarianPanelData } from "./Dashbord.jsx/AllPanelsData";

// Guard: redirect to dashboard if panel not in allowedPanels
function PanelRoute({ panel, element }) {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const allowed = admin?.allowedPanels || [];
  return allowed.includes(panel) ? element : <Navigate to="/dashbord" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashbord" element={<MainDashBord />}>
          <Route index element={<AdminDashboard />} />

          {/* school panel */}
          <Route path="branches" element={<PanelRoute panel="school" element={<BranchManagement />} />} />
          <Route path="branch/:branchId" element={<PanelRoute panel="school" element={<BranchDetail />} />} />
          <Route path="add-branch" element={<PanelRoute panel="school" element={<AddBranch />} />} />

          {/* staff panel */}
          <Route path="staff" element={<PanelRoute panel="staff" element={<StaffPanelData />} />} />
          <Route path="staff-profile/:id" element={<PanelRoute panel="staff" element={<StaffProfile />} />} />

          {/* teacher panel */}
          <Route path="teachers" element={<PanelRoute panel="teacher" element={<TeacherPanelData />} />} />

          {/* fee panel */}
          <Route path="fees" element={<PanelRoute panel="fee" element={<FeePanelData />} />} />

          {/* transport panel */}
          <Route path="transport" element={<PanelRoute panel="transport" element={<TransportPanelData />} />} />

          {/* library panel */}
          <Route path="library" element={<PanelRoute panel="library" element={<LibraryPanelData />} />} />
          <Route path="librarians" element={<PanelRoute panel="library" element={<LibrarianPanelData />} />} />

          {/* warden/hostel panel */}
          <Route path="hostel" element={<PanelRoute panel="warden" element={<HostelPanelData />} />} />

          {/* parent/student panel */}
          <Route path="parents" element={<PanelRoute panel="parent" element={<ParentPanelData />} />} />

          {/* always accessible */}
          <Route path="reports" element={<Reports />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
