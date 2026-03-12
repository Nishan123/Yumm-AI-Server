import { connectToDb } from '../database/connect-db';
import mongoose from 'mongoose';

beforeAll(async () => {
    await connectToDb();
});

afterAll(async () => {
    await mongoose.connection.close();
});
