import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MINIMUM_SEQUENCE_REQUIRED, MUTANT_DNA_SEQUENCES } from './contanst';
import { AdnDocument, Adn } from './entites/adn.entites';

@Injectable()
export class AppService {
  constructor(@InjectModel(Adn.name) private adnModel: Model<AdnDocument>) {}
  private countMutantSequence = 0;
  getHello(): string {
    return 'Hello World!';
  }

  async statsMutant() {
    const response = await this.adnModel.aggregate([
      {
        $group: {
          _id: null,
          totalHumans: { $sum: '$isHuman' },
          totalMutant: { $sum: '$isMutant' },
          count: { $sum: 1 },
        },
      },
    ]);
    return {
      ratio: response[0].totalMutant / response[0].totalHumans,
      count_mutant_dna: response[0].totalMutant,
      count_human_dna: response[0].totalHumans,
    };
  }

  async isMutant(dna: string[]): Promise<boolean> {
    this.countMutantSequence = 0;
    this.checkHorizontal(dna);
    this.checkVertical(dna);
    this.checkDiagonal(dna);

    const dnaModel = new this.adnModel({
      dna: dna,
      isMutant: this.countMutantSequence >= MINIMUM_SEQUENCE_REQUIRED ? 1 : 0,
      isHuman: this.countMutantSequence >= MINIMUM_SEQUENCE_REQUIRED ? 0 : 1,
    });
    await dnaModel.save();

    return this.countMutantSequence >= MINIMUM_SEQUENCE_REQUIRED;
  }
  checkVertical(dna) {
    for (let i = 0; i < dna.length; i++) {
      let word = '';
      dna.forEach((sequence) => {
        word = word.concat(sequence.charAt(i));
      });
      this.sumIfSequence(word);
    }
  }

  checkHorizontal(dna) {
    dna.forEach((sequence) => this.sumIfSequence(sequence));
  }

  checkDiagonal(dna) {
    let word = '';
    for (let i = 0; i < dna.length; i++) {
      dna.forEach((sequence, index) => {
        if (i === index) word = word.concat(sequence.charAt(i));
      });
    }
    this.sumIfSequence(word);
  }

  sumIfSequence(sequence) {
    if (MUTANT_DNA_SEQUENCES.find((mds) => sequence.indexOf(mds) != -1)) {
      this.countMutantSequence += 1;
    }
  }
}
