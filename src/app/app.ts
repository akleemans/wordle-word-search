import {Component, computed, signal} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {UpperCasePipe} from '@angular/common';
import {WORDLE_GB_LIST} from './wordle-gb';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {WORDYL_GB_LIST} from './wordyl-gb';
import {WORDLE_LIST} from './wordle';

interface Letters {
  l1: string;
  l2: string;
  l3: string;
  l4: string;
  l5: string;
}

@Component({
  selector: 'app-root',
  imports: [MatFormField, MatLabel, MatInput, MatSelectModule, UpperCasePipe, FormsModule, MatButton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected l1 = signal('');
  protected l2 = signal('');
  protected l3 = signal('');
  protected l4 = signal('');
  protected l5 = signal('');
  protected matching = signal('');
  protected notMatching = signal('');

  protected selectedWordlist = signal('wordle');

  protected allWords = computed(() => this.getWordList(this.selectedWordlist()));
  protected results = computed(() => this.filterWords(this.allWords(), {
    l1: this.l1(), l2: this.l2(),
    l3: this.l3(), l4: this.l4(), l5: this.l5()
  }, this.matching(), this.notMatching()));

  private filterWords(allWords: string[], letters: Letters, matching: string, notMatching: string): string[] {
    console.log('Filtering!');

    const results: string[] = allWords.filter(w => {
      if (letters.l1 !== '' && w[0] !== letters.l1.toUpperCase()) {
        return false;
      }
      if (letters.l2 !== '' && w[1] !== letters.l2.toUpperCase()) {
        return false;
      }
      if (letters.l3 !== '' && w[2] !== letters.l3.toUpperCase()) {
        return false;
      }
      if (letters.l4 !== '' && w[3] !== letters.l4.toUpperCase()) {
        return false;
      }
      if (letters.l5 !== '' && w[4] !== letters.l5.toUpperCase()) {
        return false;
      }

      for (let match of matching) {
        console.log('Checking match:', match, 'word:', w);
        if (!w.includes(match.toUpperCase())) {
          return false;
        }
      }

      for (let notMatch of notMatching) {
        if (w.includes(notMatch.toUpperCase())) {
          return false;
        }
      }
      return true;
    });
    return results;
  }

  private getWordList(name: string): string[] {
    return {
      'wordle': WORDLE_LIST,
      'wordle-gb': WORDLE_GB_LIST,
      'wordyl-gb': WORDYL_GB_LIST,
    }[name]!;
  }

  protected reset(): void {
    this.l1.set('');
    this.l2.set('');
    this.l3.set('');
    this.l4.set('');
    this.l5.set('');
    this.matching.set('');
    this.notMatching.set('');
  }
}
