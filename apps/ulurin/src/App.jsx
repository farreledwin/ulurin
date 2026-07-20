import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell.jsx";
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
        <Route path="/dashboard/buat" element={<CreateCampaignPage />} />
        <Route path="/dashboard/bukti/:slug" element={<ProofPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
