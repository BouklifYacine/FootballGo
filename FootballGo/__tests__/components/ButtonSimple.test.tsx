import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Bouton', () => {
  it('affiche correctement le texte du bouton', () => {
    // Rendu du bouton avec un texte
    render(<Button>Cliquez-moi</Button>);
    
    // Vérification que le texte est bien affiché
    expect(screen.getByText('Cliquez-moi')).toBeTruthy();
  });

  it('déclenche la fonction onClick quand on clique dessus', () => {
    // Création d'une fonction mock
    const onClickMock = vi.fn();
    
    // Rendu du bouton avec la fonction mock
    render(<Button onClick={onClickMock}>Cliquez-moi</Button>);
    
    // Simulation du clic sur le bouton
    fireEvent.click(screen.getByText('Cliquez-moi'));
    
    // Vérification que la fonction a été appelée
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
}); 