import { Adn } from './entites/adn.entites';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

class mockModel {
  constructor(public data?: any) {}

  save() {
    return this.data;
  }

  static async aggregate(data) {
    return new Promise((resolve) => {
      return resolve([
        {
          _id: {
            totalHumans: 10,
            totalMutant: 1,
            count: 1,
          },
        },
      ]);
    });
  }
}

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getModelToken(Adn.name),
          useValue: mockModel,
        },
      ],
    }).compile();
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('Should create a entity', async () => {
      expect(
        await appService.isMutant([
          'ATGCGA',
          'CAGTGC',
          'TTATGT',
          'AGAAGG',
          'CCCCTA',
          'TCACTG',
        ]),
      ).toBe(true);
    });
    it('Should create a entity', async () => {
      expect(
        await appService.isMutant([
          'ATGCGA',
          'CAGTGC',
          'TTATGT',
          'AGAAGG',
          'CCCTTA',
          'TCACTG',
        ]),
      ).toBe(true);
    });
    it('Should not create a entity', async () => {
      expect(
        await appService.isMutant([
          'TCACTG',
          'GAACCT',
          'TCGCAT',
          'GATCGG',
          'GCGCAT',
          'TAGCTG',
        ]),
      ).toBe(false);
    });
  });
  it('Shoud return stats', async () => {
    const data = await appService.statsMutant();
    expect(data).toEqual({
      ratio: 0.1,
      count_mutant_dna: 1,
      count_human_dna: 10,
    });
  });
});
