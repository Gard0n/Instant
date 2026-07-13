const CONTACT_EMAIL = 'mathieu.jardin.pro@gmail.com'

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-instant-text-muted">
      <h1 className="mb-6 text-2xl font-semibold text-instant-text">
        Politique de confidentialité — Instant
      </h1>

      <p className="mb-4">
        Instant permet à un organisateur de créer un événement (par exemple un mariage) et à ses
        invités de prendre des photos sans créer de compte. Cette page explique quelles données
        sont collectées et comment elles sont utilisées.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-instant-text">Données collectées</h2>
      <ul className="mb-4 list-disc space-y-1 pl-5">
        <li>Le nom de l'événement et la date de révélation, saisis par l'organisateur.</li>
        <li>
          Les photos prises par les invités, ainsi qu'un prénom optionnel qu'ils peuvent renseigner
          librement (aucune vérification d'identité).
        </li>
        <li>
          Aucun compte n'est requis pour prendre une photo. L'organisateur utilise une session
          anonyme technique (sans email ni mot de passe) pour être reconnu comme propriétaire de
          son événement avant la révélation.
        </li>
      </ul>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-instant-text">Stockage et hébergement</h2>
      <p className="mb-4">
        Les données (événements, photos) sont hébergées chez Supabase (infrastructure AWS, région
        Europe). Aucune donnée n'est vendue ni partagée avec des tiers à des fins publicitaires.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-instant-text">Accès aux photos</h2>
      <p className="mb-4">
        Les photos d'un événement ne sont visibles par les invités qu'à partir de la date de
        révélation choisie par l'organisateur. Avant cette date, seul l'organisateur (depuis
        l'appareil utilisé pour créer l'événement) peut les consulter.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-instant-text">
        Caméra et permissions
      </h2>
      <p className="mb-4">
        L'accès à la caméra de votre appareil est utilisé uniquement pour la prise de photo au
        moment où vous appuyez sur le déclencheur. Aucune image n'est capturée ni transmise sans
        action explicite de votre part.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-instant-text">Suppression des données</h2>
      <p className="mb-4">
        Pour toute demande de suppression d'un événement, de photos, ou pour toute question
        relative à vos données, contactez :{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-instant-accent underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  )
}
