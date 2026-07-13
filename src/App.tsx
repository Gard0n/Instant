import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { CreateEventPage } from './features/create-event/CreateEventPage'
import { CameraPage } from './features/camera/CameraPage'
import { GalleryPage } from './features/gallery/GalleryPage'
import { PrivacyPage } from './features/legal/PrivacyPage'
import { Button } from './components/Button'

function HomePage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="text-5xl">📸</div>
      <div>
        <h1 className="text-2xl font-semibold">Instant</h1>
        <p className="mt-2 text-instant-text-muted">
          L'appareil photo jetable de votre mariage. Vos invités capturent la soirée, vous
          découvrez toutes les photos ensemble le jour de votre choix.
        </p>
      </div>
      <Link to="/create">
        <Button>Créer mon événement</Button>
      </Link>
      <Link to="/privacy" className="text-xs text-instant-text-muted underline">
        Politique de confidentialité
      </Link>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateEventPage />} />
        <Route path="/event/:id" element={<CameraPage />} />
        <Route path="/event/:id/gallery" element={<GalleryPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
