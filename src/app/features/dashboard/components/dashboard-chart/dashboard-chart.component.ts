import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { Expense } from '../../models/dashboard';
import { ListCategory } from 'src/app/features/category/models/category';
import { CategoryService } from 'src/app/features/category/services/category.service';

// Enregistrement de tous les types de graphiques disponibles dans Chart.js pour utilisation.
Chart.register(...registerables);

// Décorateur Component qui définit le sélecteur, le template HTML et le CSS pour ce composant.
@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss'],
})
export class DashboardChartComponent implements OnInit {
  // Référence à l'élément canvas dans le template HTML où le graphique Chart.js sera rendu.
  @ViewChild('myChart') myChart!: ElementRef<HTMLCanvasElement>;

  // Propriétés pour stocker les états et les données du composant.
  chart: any; // Instance de Chart.js pour le graphique.
  selectedDate?: string; // Date sélectionnée pour filtrer les dépenses.
  selectedPeriodType = 'day'; // Type de période sélectionné (jour, semaine, mois, année).
  categories: ListCategory[] = []; // Liste des catégories chargées depuis le service.
  selectedCategoryId?: number | undefined; // ID de la catégorie sélectionnée pour filtrer.
  expenses: Expense[] = []; // Liste des dépenses chargées depuis le service.

  // Injection des services DashboardService et CategoryService.
  constructor(
    private _dashboardService: DashboardService,
    private _categoryService: CategoryService
  ) {}

  // Méthode appelée à l'initialisation du composant.
  ngOnInit(): void {
    this.selectedDate = this.getCurrentFormattedDate(); // Définit la date actuelle comme sélectionnée.
    this.loadCategories(); // Charge les catégories depuis le service.
    this.loadDataExpenseByPeriod(); // Charge les dépenses en fonction de la période sélectionnée.
  }

  // Récupère la date actuelle et la formate en yyyy-MM-dd.
  getCurrentFormattedDate(): string {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }

  // Gère les changements de date sélectionnée par l'utilisateur.
  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value; // Met à jour la date sélectionnée.
    this.loadDataExpenseByPeriod(); // Recharge les données en fonction de la nouvelle date.
  }

  // Gère les changements de type de période (jour, semaine, mois, année).
  onPeriodTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriodType = select.value; // Met à jour le type de période sélectionné.
    this.loadDataExpenseByPeriod(); // Recharge les données pour la nouvelle période.
  }

  // Gère les changements de catégorie sélectionnée.
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategoryId = selectElement.value ? Number(selectElement.value) : undefined;
    this.loadDataExpenseByPeriod(); // Recharge les données pour la nouvelle catégorie.
  }

  // Convertit une date au format attendu par le backend (dd/MM/yyyy).
  formatDateToBackendFormat(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

// Charge les données de dépenses en fonction de la période sélectionnée.
loadDataExpenseByPeriod(): void {
  // Formatte la date sélectionnée ou utilise la date actuelle si aucune date n'est sélectionnée.
  // 'this.formatDateToBackendFormat' est la fonction qui convertit les dates au format attendu par le backend.
  const formattedDate = this.formatDateToBackendFormat(this.selectedDate ? this.selectedDate : this.getCurrentFormattedDate());

  // Fonction de rappel pour traiter les données de dépenses reçues.
  const dataCallback = (expensesData: Expense[]) => {
    // Associe les noms de catégories aux dépenses et les stocke dans 'this.expenses'.
    this.expenses = this.associateCategoryNames(expensesData, this.categories);

    // Trie 'this.expenses' par date en ordre décroissant.
    this.sortExpensesByDate(); 

    // Crée un graphique avec les données triées et associées.
    this.createChart(this.expenses);
  };
  
  // Sélectionne la méthode de chargement des données en fonction de 'this.selectedPeriodType'.
  switch (this.selectedPeriodType) {
    case 'day':
      // Charge les données de dépenses pour le jour sélectionné
      this._dashboardService.getExpensesByDay(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
    case 'week':
      // Charge les données de dépenses pour la semaine sélectionnée
      this._dashboardService.getExpensesByWeek(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
    case 'month':
      // Charge les données de dépenses pour le mois sélectionné
      this._dashboardService.getExpensesByMonth(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
    case 'year':
      // Charge les données de dépenses pour l'année sélectionnée
      this._dashboardService.getExpensesByYear(formattedDate, undefined, undefined, this.selectedCategoryId).subscribe(dataCallback);
      break;
  }
}



// Crée et configure le graphique avec les données fournies.
createChart(expenses: Expense[]): void {
  // Vérifie si un graphique existe déjà dans 'this.chart' et le détruit.
  // Ceci est fait pour éviter la superposition de graphiques si la méthode est appelée plusieurs fois.
  if (this.chart) {
    this.chart.destroy();
  }

  // Utilise une Map pour regrouper les montants des dépenses par catégorie.
  const groupExpense = new Map<string, number>();

  // Parcourt chaque dépense dans le tableau 'expenses'.
  // Pour chaque dépense, le montant est accumulé dans la catégorie correspondante.
  expenses.forEach(expense => {
    const categoryName = this.getCategoryName(expense.category_Id);
    groupExpense.set(categoryName, (groupExpense.get(categoryName) || 0) + expense.amount);
  });

  // Prépare les données pour le graphique, incluant les données et les étiquettes.
  const chartData = {
    datasets: [{
      // Les montants  par catégorie sont utilisés ici comme données pour le graphique.
      data: Array.from(groupExpense.values()),
      backgroundColor: this.generateColors(),
      hoverOffset: 4, // Définit un décalage au survol pour les segments du graphique.
    }],
    labels: Array.from(groupExpense.keys()), // Les noms de catégorie servent d'étiquettes pour le graphique.
  };

  // Crée un nouveau graphique en utilisant la bibliothèque Chart.js.

  this.chart = new Chart(this.myChart.nativeElement, {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true, // Rend le graphique réactif au redimensionnement de la fenêtre.
      maintainAspectRatio: true, // Maintient l'aspect ratio du graphique lors du redimensionnement.
      plugins: {
        legend: {
          display: true, // Affiche la légende.
          position: 'top', // Positionne la légende en haut.
        },
        title: {
          display: true, // Affiche un titre.
          text: 'Dépenses par Catégorie', 
        },
      },
    },
  });
}


  // Génère un tableau de couleurs pour le graphique.
  generateColors(): string[] {
    return [
      '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78',
      '#2ca02c', '#98df8a', '#d62728', '#ff9896',
      '#9467bd', '#c5b0d5', '#8c564b', '#c49c94',
      '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7',
      '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
    ];
  }
  
// Charge les catégories depuis le service et les stocke dans 'this.categories'.
loadCategories(): void {
  this._categoryService.getAll().subscribe((data) => {
    // Ici, 'data' contient  un tableau d'objets de catégorie retournés par le service.
    this.categories = data;
  });
}


// Associe les noms de catégorie aux dépenses en utilisant une Map pour un accès rapide.
associateCategoryNames(expenses: Expense[], categories: ListCategory[]): any[] {
  // Crée une Map où chaque clé est un ID de catégorie et chaque valeur est le nom de la catégorie correspondante.
  // Ceci est fait en mappant le tableau 'categories', qui est un tableau d'objets avec des propriétés 'id' et 'category_Name'.
  const categoryMap = new Map(categories.map((c) => [c.id, c.category_Name]));

  // Transforme le tableau 'expenses' en mappant chaque dépense à un nouvel objet.
  // Ce nouvel objet est une copie de l'objet de dépense original (en utilisant l'opérateur de propagation '...expense'),
  // avec l'ajout ou la modification de la propriété 'categoryName'.
  return expenses.map((expense) => ({
    ...expense,
    categoryName:
      // Récupère le nom de la catégorie associé à 'category_Id' de la dépense depuis 'categoryMap'.
      // Si l'ID de catégorie n'est pas trouvé dans 'categoryMap', utilise 'Catégorie Inconnue' comme valeur par défaut.
      categoryMap.get(expense.category_Id) || 'Catégorie Inconnue',
  }));
}


// Renvoie le nom de la catégorie basé sur l'ID de la catégorie.
getCategoryName(categoryId: number): string {
  // Recherche dans le tableau 'categories' pour trouver l'objet de catégorie correspondant.
  // 'categories' est probablement un tableau d'objets, chacun ayant un 'id' et un 'category_Name'.
  const category = this.categories.find((c) => c.id === categoryId);

  // Vérifie si un objet de catégorie correspondant a été trouvé.
  // Si oui, renvoie le nom de cette catégorie (category.category_Name).
  // Si non (c'est-à-dire, aucun objet avec l'ID fourni n'a été trouvé, et 'category' est 'undefined'),
  // renvoie la chaîne 'Catégorie Inconnue'.
  return category ? category.category_Name : 'Catégorie Inconnue';
}


  sortExpensesByDate(): void {
    this.expenses.sort((a, b) => {
      // Convertit les chaînes de caractères 'date_Expense' en objets Date pour chaque élément du tableau.
      const dateA = new Date(a.date_Expense);
      const dateB = new Date(b.date_Expense);
  
      // Compare les dates: renvoie une valeur négative si dateB est plus récente que dateA,
      // une valeur positive si dateA est plus récente que dateB,
      // et zéro si elles sont égales.
      // Cela permet de trier le tableau 'expenses' en ordre décroissant de dates.
      return dateB.getTime() - dateA.getTime(); 
    });
  }
  
}
