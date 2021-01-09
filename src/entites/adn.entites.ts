import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdnDocument = Adn & Document;

@Schema()
export class Adn {
  @Prop()
  dna: string[];

  @Prop({ default: 0 })
  isMutant: number;

  @Prop({ default: 0 })
  isHuman: number;
}

export const AdnSchema = SchemaFactory.createForClass(Adn);
