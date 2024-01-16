import { Component } from '@angular/core';
import { ListCategory } from '../../models/category'; // Modèle de catégorie.
import { CategoryService } from '../../services/category.service'; // Service pour les opérations de catégorie.

// Décorateur Component pour définir les métadonnées du composant Angular.
@Component({
  selector: 'app-list-category', // Sélecteur CSS du composant.
  templateUrl: './list-category.component.html', // Chemin vers le template HTML.
  styleUrls: ['./list-category.component.scss'] // Chemin vers les styles CSS.
})
export class ListCategoryComponent {
  // Tableau pour stocker les catégories récupérées.
  listCategory : ListCategory[] = [];

  // Constructeur pour injecter les dépendances nécessaires.
  constructor(private _categoryService: CategoryService) { }

  //Appelé après la création du composant.
  ngOnInit(): void {
    // Appel du service pour récupérer toutes les catégories.
    this._categoryService.getAll().subscribe({
      next : (response) => {
        // Assignation des catégories récupérées à la variable listCategory.
        this.listCategory = response;
        console.log("Récupération de la liste des catégories avec succès", response);
      },
      error : (error) => {
        console.error("Erreur lors de la recuperation de la liste des catégories : ", error);
      },
      complete : () => {
        console.log("Récupération de la liste des catégories terminée");
      }
    });
  }

  // Méthode pour supprimer une catégorie par son identifiant.
  deleteCategory(id : number) : void {
    // Appel du service pour supprimer la catégorie spécifiée.
    this._categoryService.delete(id).subscribe({
      next : (response) => {
      console.log("Suppression de la catégorie : ", response);
      // Recharge la liste des catégories pour visualiser les changements.
      this.ngOnInit();
      },
      error : (error) => {
      // Gestion des erreurs lors de la tentative de suppression.
      console.error("Erreur lors de la suppression de la catégorie : ", error);
      },
      complete : () => {
      // Message dans la console indiquant la fin de l'opération de suppression.
      console.log("Suppression de la catégorie terminée");
      }
    });
  }
}