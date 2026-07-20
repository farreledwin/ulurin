import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
import { useApp } from "./context/AppContext.jsx";
import { CampaignPage } from "./pages/CampaignPage.jsx";
import { CompletedCampaignPage } from "./pages/CompletedCampaignPage.jsx";
import { CreateCampaignPage } from "./pages/CreateCampaignPage.jsx";
import { CreatorDashboardPage } from "./pages/CreatorDashboardPage.jsx";
import { CreatorProfilePage } from "./pages/CreatorProfilePage.jsx";
import { CreatorReviewPage } from "./pages/CreatorReviewPage.jsx";
import { DonatePage } from "./pages/DonatePage.jsx";
import { ExplorePage } from "./pages/ExplorePage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { ProofPage } from "./pages/ProofPage.jsx";
import { ReceiptPage } from "./pages/ReceiptPage.jsx";
import { StoryFeedPage } from "./pages/StoryFeedPage.jsx";
import { TierPage } from "./pages/TierPage.jsx";
import { TransparencyPage } from "./pages/TransparencyPage.jsx";

// Creator-only routes: any signed-in account gets a wallet at /dashboard, but the
// campaign-create and proof-upload actions stay owner-only. A non-owner (or a
// logged-out visitor) is bounced to /dashboard — their wallet, or the login gate.
function OwnerRoute({ children }) {
  const { session } = useApp();
  if (!session?.owner) return <Navigate to="/dashboard" replace />;
  return children;
}

export function App() {
  const location = useLocation();
  const landing = location.pathname === "/";

  return (
    <AppShell landing={landing}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cerita" element={<StoryFeedPage />} />
        <Route path="/jelajahi" element={<ExplorePage />} />
        <Route path="/campaign/:slug" element={<CampaignPage />} />
        <Route path="/completed/:slug" element={<CompletedCampaignPage />} />
        <Route path="/donate/:slug" element={<DonatePage />} />
        <Route path="/receipt/:receiptId" element={<ReceiptPage />} />
        <Route path="/creator/:slug" element={<CreatorProfilePage />} />
        <Route path="/review/completed/:slug" element={<CreatorReviewPage />} />
        <Route path="/transparansi" element={<TransparencyPage />} />
        <Route path="/tier" element={<TierPage />} />
        <Route path="/dashboard" element={<CreatorDashboardPage />} />
        <Route path="/dashboard/buat" element={<OwnerRoute><CreateCampaignPage /></OwnerRoute>} />
        <Route path="/dashboard/bukti/:slug" element={<OwnerRoute><ProofPage /></OwnerRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
