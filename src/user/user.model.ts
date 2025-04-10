import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
  toObject(): any;
}

export enum AccountType {
  ADMIN = 'admin',
  USUARIO = 'usuario',
  TIENDA = 'tienda',
  DELIVERY = 'delivery',
}

@Schema({ timestamps: true, collection: 'user' })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({ required: true, enum: AccountType, default: AccountType.USUARIO })
  account_type: AccountType;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
