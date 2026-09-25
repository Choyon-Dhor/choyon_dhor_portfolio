import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const AdminLayout = lazy(() => import('./layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const PublicLayout = lazy(() => import('./layouts/PublicLayout').then((m) => ({ default: m.PublicLayout })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const ContentManagerPage = lazy(() => import('./pages/admin/ContentManagerPage').then((m) => ({ default: m.ContentManagerPage })));
const MediaPage = lazy(() => import('./pages/admin/MediaPage').then((m) => ({ default: m.MediaPage })));
const MessagesPage = lazy(() => import('./pages/admin/MessagesPage').then((m) => ({ default: m.MessagesPage })));
const PagesManagerPage = lazy(() => import('./pages/admin/PagesManagerPage').then((m) => ({ default: m.PagesManagerPage })));
const ProtectedRoute = lazy(() => import('./pages/admin/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute })));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then((m) => ({ default: m.AboutPage })));
const BlogPage = lazy(() => import('./pages/public/BlogPage').then((m) => ({ default: m.BlogPage })));
const CollectionPage = lazy(() => import('./pages/public/CollectionPage').then((m) => ({ default: m.CollectionPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then((m) => ({ default: m.ContactPage })));
const DetailPage = lazy(() => import('./pages/public/DetailPage').then((m) => ({ default: m.DetailPage })));
const GamePage = lazy(() => import('./pages/public/GamePage').then((m) => ({ default: m.GamePage })));
const HomePage = lazy(() => import('./pages/public/HomePage').then((m) => ({ default: m.HomePage })));
const LeadershipPage = lazy(() => import('./pages/public/LeadershipPage').then((m) => ({ default: m.LeadershipPage })));
const ResearchHubPage = lazy(() => import('./pages/public/ResearchHubPage').then((m) => ({ default: m.ResearchHubPage })));

function RouteFallback() {
  return <div className="route-fallback"><span>N//</span><p>LOADING MODULE...</p></div>;
}

export default function App() {
  return <Suspense fallback={<RouteFallback />}><Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="research" element={<ResearchHubPage />} />
      <Route path="research/:slug" element={<DetailPage type="research" backPath="/research" />} />
      <Route path="projects" element={<CollectionPage type="project" pageSlug="projects" title="Project Garage" detailBase="/projects" />} />
      <Route path="projects/:slug" element={<DetailPage type="project" backPath="/projects" />} />
      <Route path="publications" element={<CollectionPage type="publication" pageSlug="publications" title="Publication Archive" detailBase="/publications" />} />
      <Route path="publications/:slug" element={<DetailPage type="publication" backPath="/publications" />} />
      <Route path="awards" element={<CollectionPage type="achievement" pageSlug="awards" title="Achievement Vault" detailBase="/awards" />} />
      <Route path="awards/:slug" element={<DetailPage type="achievement" backPath="/awards" />} />
      <Route path="skills" element={<CollectionPage type="skill" pageSlug="skills" title="Capability Evidence" detailBase="/skills" />} />
      <Route path="skills/:slug" element={<DetailPage type="skill" backPath="/skills" />} />
      <Route path="education" element={<CollectionPage type="education" pageSlug="education" title="Academic Archive" detailBase="/education" />} />
      <Route path="education/:slug" element={<DetailPage type="education" backPath="/education" />} />
      <Route path="leadership" element={<LeadershipPage />} />
      <Route path="leadership/:slug" element={<DetailPage type="experience" backPath="/leadership" />} />
      <Route path="activities" element={<CollectionPage type="activity" pageSlug="activities" title="Activities and Involvement" detailBase="/activities" />} />
      <Route path="activities/:slug" element={<DetailPage type="activity" backPath="/activities" />} />
      <Route path="events" element={<CollectionPage type="event" pageSlug="events" title="Event Arena" detailBase="/events" />} />
      <Route path="events/:slug" element={<DetailPage type="event" backPath="/events" />} />
      <Route path="blog" element={<BlogPage />} />
      <Route path="blog/:slug" element={<DetailPage type="blog" backPath="/blog" />} />
      <Route path="game" element={<GamePage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
    <Route path="admin/login" element={<AdminLoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="content" element={<ContentManagerPage />} />
        <Route path="pages" element={<PagesManagerPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="messages" element={<MessagesPage />} />
      </Route>
    </Route>
  </Routes></Suspense>;
}
