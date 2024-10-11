export default [
    { heading: 'Demandes' },
    {
      title: 'Relevé de notes',
      icon: { icon: 'bx-file' },
      children: [
        { title: 'Demandes de relevé', to: 'demandes-releve-notes-encours-traitement' },
        { title: 'Demandes payées', to: 'demandes-releve-notes-demande-payer' },
        { title: 'Demandes à traiter', to: 'demandes-releve-notes-demande-ensignature' },
        { title: 'Relevé disponible', to: 'demandes-releve-notes-demande-disponible' },
      ],
    },
    {
      title: 'Duplicata',
      icon: { icon: 'bx-copy' },
      children: [
        { title: 'Demandes de duplicata', to: 'demandes-duplicata-encours-traitement' },
        { title: 'Duplicatas payés', to: 'demandes-duplicata-demande-payer' },
        { title: 'Duplicatas à traiter', to: 'demandes-duplicata-demande-ensignature' },
        { title: 'Duplicatas disponibles', to: 'demandes-duplicata-demande-disponible' },
      ],
    },
    {
      title: 'Diplôme',
      icon: { icon: 'bx-bxs-graduation' },
      children: [
        { title: 'Demandes de diplome', to: 'demandes-diplome-encours-traitement' },
        { title: 'Diplômes à traiter', to: 'demandes-diplome-demande-ensignature' },
        { title: 'Demande dèja traitées', to: 'demandes-diplome-demande-disponible' },
        { title: 'Diplômes disponible ', to: 'demandes-diplome-demande-payer' },
        { title: 'Diplômes delivrés ', to: 'demandes-diplome-demande-payer' },
      ],
    },
    {
      title: 'Attestation',
      icon: { icon: 'bx-bxs-graduation' },
      children: [
        { title: "Demandes d'attestaion", to: 'demandes-attestation-encours-traitement' },
        { title: 'Attestations payées ', to: 'demandes-attestation-demande-payer' },
        { title: 'Attestations à traiter', to: 'demandes-attestation-demande-ensignature' },
        { title: 'Attestations disponibles', to: 'demandes-attestation-demande-disponible' },
      ],
    },
    
  ]
  