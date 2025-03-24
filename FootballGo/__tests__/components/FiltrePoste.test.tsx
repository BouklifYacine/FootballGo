import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FiltrePoste from '@/app/dashboardclient/(components)/FiltrePoste';

// Configuration pour les tests du composant FiltrePoste
describe('FiltrePoste', () => {
  // Test vérifiant que la valeur par défaut est correctement affichée
  it('affiche correctement la valeur de filtre sélectionnée', () => {
    render(<FiltrePoste filtrePoste="MILIEU" setFiltrePoste={() => {}} />);
    
    // Vérifie que le texte "Milieu" apparaît quelque part dans le composant
    expect(screen.getByText(/milieu/i)).toBeTruthy();
  });

  // Test vérifiant que la fonction de changement est appelée lors d'un changement de sélection
  it('appelle setFiltrePoste quand une nouvelle valeur est sélectionnée', async () => {
    // Création d'une fonction mock pour vérifier si elle est appelée
    const mockSetFiltrePoste = vi.fn();
    
    // Rendu du composant avec la fonction mock
    const { getByRole } = render(
      <FiltrePoste filtrePoste="TOUS" setFiltrePoste={mockSetFiltrePoste} />
    );
    
    // Simulation du clic sur le trigger du select
    fireEvent.click(getByRole('combobox'));
    
    // Simulation de la sélection d'une option
    fireEvent.click(screen.getByText('Défenseur'));
    
    // Vérification que la fonction a été appelée avec la bonne valeur
    expect(mockSetFiltrePoste).toHaveBeenCalledWith('DEFENSEUR');
  });

  // Test vérifiant que toutes les options de postes sont disponibles
  it('affiche toutes les options de postes disponibles', () => {
    render(<FiltrePoste filtrePoste="TOUS" setFiltrePoste={() => {}} />);
    
    // Ouvrir le menu déroulant
    fireEvent.click(screen.getByRole('combobox'));
    
    // Vérifier que toutes les options sont présentes
    expect(screen.getByText('Tous les postes')).toBeTruthy();
    expect(screen.getByText('Gardien')).toBeTruthy();
    expect(screen.getByText('Défenseur')).toBeTruthy();
    expect(screen.getByText('Milieu')).toBeTruthy();
    expect(screen.getByText('Attaquant')).toBeTruthy();
    expect(screen.getByText('Sans poste')).toBeTruthy();
  });
}); 