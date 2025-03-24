// Importe les méthodes d'extension pour les assertions de React Testing Library
import '@testing-library/jest-dom/vitest';

// Définition des matchers personnalisés si nécessaire pour les tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
}));

// Mock pour les composants UI de ShadCN qui utilisent portals
beforeAll(() => {
  // Création d'un conteneur pour les portails
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'radix-portal');
  document.body.appendChild(portalRoot);
});

afterAll(() => {
  // Nettoyage après les tests
  const portalRoot = document.getElementById('radix-portal');
  if (portalRoot) {
    document.body.removeChild(portalRoot);
  }
}); 