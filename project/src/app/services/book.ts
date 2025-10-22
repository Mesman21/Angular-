import { Injectable } from '@angular/core';

export interface Book {
  id: number;
  title: string;
  author: string;
  excerpt: string;
  fullText: string;
  imageUrl?: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  public readonly categories: string[] = [ 
    'Усі Книги', 
    'TypeScript', 
    'Angular', 
    'CSS/HTML',
    'Роман'
  ];
  
  private books: Book[] = [
    {
      id: 1,
      title: "Основи TypeScript",
      author: "Анонім",
      excerpt: "Ця книга пояснює базові концепції TypeScript та його переваги у великих проєктах.",
      fullText: "Привіт, це перша частина тексту книги про TypeScript. Він є суперсетом JavaScript і додає статичну типізацію. Це значно зменшує кількість помилок при розробці великих додатків. Ми розглянемо інтерфейси, класи, дженерики та інші ключові елементи. Читайте далі, щоб дізнатися більше...",
      imageUrl: "https://via.placeholder.com/150/007bff/ffffff?text=TS",
      category: 'TypeScript'
    },
    {
      id: 2,
      title: "Вступ до Angular",
      author: "Angular Dev",
      excerpt: "Посібник для початківців із компонентів, модулів та двобічного біндингу.",
      fullText: "Angular — це потужний фреймворк для створення односторінкових додатків (SPA). Він базується на компонентній архітектурі. Кожен додаток складається з компонентів, які керують своєю частиною інтерфейсу та логіки...",
      imageUrl: undefined,
      category: 'Angular'
    },
    {
      id: 3,
      title: "Майстерність CSS Grid",
      author: "Веб Дизайнер",
      excerpt: "Повний посібник з Flexbox та Grid для створення сучасних макетів.",
      fullText: "...",
      imageUrl: "https://via.placeholder.com/150/28a745/ffffff?text=CSS",
      category: 'CSS/HTML'
    },
    {
      id: 4,
      title: "Основи HTTP та API",
      author: "Бекенд Розробник",
      excerpt: "Як працювати з HTTP-запитами, API та асинхронним кодом у JavaScript.",
      fullText: "...",
      category: 'CSS/HTML'
    },
    {
      id: 5,
      title: "Священник",
      author: "Сьєра Сімоне",
      excerpt: "Книга досліджує боротьбу між тілом і душею, гріхом і святістю, і є досить відвертою у зображенні чуттєвих сцен. Це історія про те, як пристрасть кидає виклик глибокій вірі та обов'язку.",
      fullText: "Його життя кардинально змінюється, коли на сповідь до нього приходить Поппі Денфорт. Її голос і зізнання глибоко вражають його. Незважаючи на те, що отець Белл намагається щиро допомогти Поппі знайти духовну розраду, він не може приборкати сильну фізичну і емоційну спокусу, яка виникає між ними.",
      category: 'Роман'
    }
  ];

  constructor() { }

  getAllBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }
}