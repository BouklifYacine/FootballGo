import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Ne pas afficher la pagination s'il n'y a qu'une seule page
  if (totalPages <= 1) {
    return null;
  }

  // Fonction pour générer les numéros de page à afficher
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    
    // Toujours afficher la première page
    pages.push(1);
    
    // Calculer la plage de pages à afficher
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Ajouter des ellipses si nécessaire
    if (startPage > 2) {
      pages.push("...");
    }
    
    // Ajouter les pages intermédiaires
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Ajouter des ellipses si nécessaire
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    
    // Toujours afficher la dernière page si elle existe
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((page, index) => {
        if (typeof page === "string") {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              {page}
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
